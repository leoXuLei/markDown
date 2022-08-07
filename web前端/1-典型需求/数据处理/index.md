# 唯一标识中的数字顺序处理

```tsx
const keyValueList = list?.map((item) => Number(item?.[key]));

// keyValueList格式如下
["OP5", "OP6", "OP3"];
// curNumberList
["5", "6", "3"];

// 期望，每次新添加元素它的某个key的值，按照数字大小顺次设置，如果有重复的，+1后继续判断
// 即每次添加的如下
//    第一次：'1'
//    第二次：'2'
//    第三次：'4'
//    第四次：'7'
//    第五次：'8'
// ...
```

```tsx
const getLatestNameOrderField = (
  list: any[],
  key: string,
  namePrefix: string
) => {
  const curNumberList = list
    ?.map((item) => Number(item?.[key]?.split?.(namePrefix)?.[1]))
    .filter?.(Boolean);
  console.log("curNumberList :>> ", curNumberList);
  const curNumberListLen = curNumberList?.length;
  if (curNumberListLen) {
    let latestNum = 1;
    for (let i = 0; i < curNumberListLen; i++) {
      if (curNumberList?.includes(latestNum)) {
        latestNum += 1;
      } else {
        break;
      }
    }
    console.log("latestNum :>> ", latestNum);
    const maxNum = curNumberList?.reduce((t, v) => (v > t ? v : t));
    const handledMaxNum = latestNum > 9 ? latestNum : `0${latestNum}`;
    const res = `${namePrefix}${handledMaxNum}`;
    console.log("res :>> ", res);
  }
  return `${namePrefix}01`;
};
```

```tsx
// 使用如下
const latestNameOrder = getLatestNameOrderField(
  nextLevelChildrenList,
  stepFieldConvertItem.Name,
  stepFieldConvertItem.namePrefix
);

// 处理Tree数据：childrenList新增步节点
const latestNextLevelChildrenList = fmtRenderSFCData?.steps
  ?.map?.((stepItem) => {
    const { id, elementType, description } = stepItem?.attributes || {};
    // normalStep
    if (String(elementType) === "0" && id) {
      if (id in nextLevelChildrenMap) {
        return nextLevelChildrenMap[id];
      }
      return {
        sfcStepId: Number(id),
        // ID
        [stepFieldConvertItem.ID]: id,
        // Name
        [stepFieldConvertItem.Name]: latestNameOrder,
        // Remark
        [stepFieldConvertItem.Remark]: description,
      };
    }
    return null;
  })
  ?.filter(Boolean);
```

**【问题：】**

从上面使用看一次添加一个元素时能保证生成的`latestNameOrder`正确，如果是新增多个元素，那么每个新增元素的`latestNameOrder`值都一样了。

**【解决思路：】**

改动如下，不需要改动`getLatestNameOrderField`函数，只需要改动调用的逻辑即可，加个暂存数组。

```tsx
const keyValueList = list?.map((item) => Number(item?.[key]));

// keyValueList格式如下
["OP5", "OP6", "OP3"];
// curNumberList
["5", "6", "3"];

// 期望，每次新添加元素它的某个key的值，按照数字大小顺次设置，如果有重复的，+1后继续判断
// 即每次添加的如下
//    第一次：'1'
// 添加后
// keyValueList格式如下
["OP5", "OP6", "OP3", "OP1"];
// curNumberList
["5", "6", "3", "1"];

//    第二次：'2'
// 添加后
// keyValueList格式如下
["OP5", "OP6", "OP3", "OP1", "OP2"];
// curNumberList
["5", "6", "3", "1", "2"];

// 多次调用以此类推...
```

```tsx
// 同时新增多个步节点时，存储当前最新的NameOrderList
const stageNameOrderList = [] as any[];

// 处理Tree数据：childrenList新增步节点
const latestNextLevelChildrenList = fmtRenderSFCData?.steps
  ?.map?.((stepItem) => {
    const { id, elementType, description } = stepItem?.attributes || {};
    // normalStep
    if (String(elementType) === "0" && id) {
      if (id in nextLevelChildrenMap) {
        return nextLevelChildrenMap[id];
      }
      const latestNameOrder = getLatestNameOrderField(
        [...nextLevelChildrenList, ...stageNameOrderList],
        stepFieldConvertItem.Name,
        stepFieldConvertItem.namePrefix
      );
      stageNameOrderList.push({
        [stepFieldConvertItem.Name]: latestNameOrder,
      });

      return {
        sfcStepId: Number(id),
        // ID
        [stepFieldConvertItem.ID]: id,
        // Name
        [stepFieldConvertItem.Name]: latestNameOrder,
        // Remark
        [stepFieldConvertItem.Remark]: description,
      };
    }
    return null;
  })
  ?.filter(Boolean);
```
