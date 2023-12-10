# 本地开发环境代码 VS 线上生产环境代码

- **若已知开发中的代码信息，如何从生产环境代码（source 中转译后的代码，经过了压缩、重命名处理）中定位到目标位置，并打断点调试**。
  - **搜索函数名**。如下面的`executeHandler`、`setTags`。
  - **搜索 switch 中的 case**。如下面本地的`case 'addTags'`对应到生产环境的`case "addTags"`。
  - **搜索对象的属性名**，如下面的：
    - `updateRemainConfigs`，本地的`params.updateRemainConfigs`对应到生产环境的`e.updateRemainConfigs`。
    - `.basic.tagList`
    - `.basic.refs.tagSetting`
  - **接口参数**。
    ```js
    {
      depth: -1,
      category: "objs",
      visiblelevel: 0
    }
    ```

## 实例一

```tsx
// 生产环境
he = Object(N["a"])((e, a) => {
  var n = e.tagName,
    r = e.propertyName,
    i = e.propertyValue;
  L(
    {
      tagName: n,
      propertyName: r,
      propertyValue: i,
    },
    a
  ).then(() => {
    var e;
  });
});
```

## 实例二

```js
// 生产环境
{
  id: iv(),
  color: r,
  lrv: o.lrv || 0,
  urv: o.urv || 100,
  unit: o.unit || "",
  min: o.lrv || 0,
  max: o.urv || 100,
  decimal: 2,
  desc: e.desc || "",
  displayItem: i,
  displayItemCache: i,
  type: null !== (n = null === e || void 0 === e ? void 0 : e.dataType) && void 0 !== n ? n : e.typeName,
  name: "var://".concat(e.modelUuid, "/").concat(e.name)
}

// 开发环境
const tag =  {
  ...defaultTag,
  id: v1(),
  color,
  lrv: extProperty.lrv || 0,
  urv: extProperty.urv || 100,
  unit: extProperty.unit || '',
  min: extProperty.lrv || 0,
  max: extProperty.urv || 100,
  decimal: 2,
  desc: item.desc || '',
  displayItem: itemName,
  displayItemCache: itemName,
  type: item?.dataType ?? item.typeName,
  name: `var://${item.modelUuid}/${item.name}`
};
```

## 实例二

下面是同一份代码在 webSight 项目线上生产环境和本地开发环境的对比。

```js
// http://xxx.xx.xx.xxx:17084/websight/common/control-shapes-trend/index.js:formatted

{
  key: "executeHandler",
  value: function(e) {
    if (this.store)
      try {
        switch (e.type) {
          case "addTags":
            this.setTags(e.payload, "add", e.updateRemainConfigs);
            break;
          case "setTags":
            this.setTags(e.payload, "replace", e.updateRemainConfigs);
            break;
          case "setViewConfigs":
            this.setViewConfigs(e.payload);
            break;
          case "setStyles":
            this.setStyles(e.payload, e.updateRemainConfigs);
            break;
         case "destroy":
            this.destroy()
        }
      } catch (t) {}
  }
},
{
  key: "setTags",
  value: function() {
    var e = gr(yr().mark((function e(t) {
        var n, r, o, a, i, c, u, s, f, p, d, h, v, m, y, b, g, w, x = arguments;
        return yr().wrap((function(e) {
            for (; ; )
              switch (e.prev = e.next) {
                case 0:
                  if (i = x.length > 1 && void 0 !== x[1] ? x[1] : "replace",
                  c = !(x.length > 2 && void 0 !== x[2]) || x[2],
                  u = t,
                  16 !== (null === (s = this.store.getState().basic.tagList) || void 0 === s ? void 0 : s.length)) {
                    e.next = 7;
                    break
                  }
                  return Xd.message.warn("\u5f53\u524d\u5df2\u8fbe\u6700\u5927\u4f4d\u53f7\u6570\u91cf"),
                  e.abrupt("return");
                case 7:
                  if (f = s.map((function(e) {
                    return e.name
                  })),
                  "add" === i && (u = u.filter((function(e) {
                    return !f.includes(e)
                  }
                  )).splice(0, 16 - s.length)),
                  u.length) {
                      e.next = 11;
                      break
                  }
                  return e.abrupt("return");
                case 11:
                  return e.next = 13,
                  th({
                      depth: -1,
                      category: "objs",
                      visiblelevel: 0
                  });
                case 13:
                  return p = e.sent,
                  e.next = 16,
                  eh({
                      resPaths: mr(u)
                  });
                case 16:
                  if (d = e.sent,null !== p && null !== d) {
                      e.next = 20;
                      break
                  }
                  return Xd.message.error("\u6a21\u578b\u670d\u52a1\u67e5\u8be2\u9519\u8bef"),
                  e.abrupt("return");
                case 20:
                  if ((h = null === d || void 0 === d || null === (n = d.result) || void 0 === n || null === (r = n.data) || void 0 === r ? void 0 : r.var).length) {
                      e.next = 23;
                      break
                  }
                  return e.abrupt("return");
                case 23:
                  v = null === p || void 0 === p || null === (o = p.result) || void 0 === o ? void 0 : o.data,
                  m = Mh(v),
                  y = h.map((function(e, t) {
                      var n, r = _f[s.length + t], o = e.extProperty, a = m.get(e.modelUuid), i = "".concat(a.modelPath, "/").concat(e.name), c = l(l({}, Gd), {}, {
                          id: iv(),
                          color: r,
                          lrv: o.lrv || 0,
                          urv: o.urv || 100,
                          unit: o.unit || "",
                          min: o.lrv || 0,
                          max: o.urv || 100,
                          decimal: 2,
                          desc: e.desc || "",
                          displayItem: i,
                          displayItemCache: i,
                          type: null !== (n = null === e || void 0 === e ? void 0 : e.dataType) && void 0 !== n ? n : e.typeName,
                          name: "var://".concat(e.modelUuid, "/").concat(e.name)
                      });
                      return c.min = Ah(c), c.max = Nh(c), c
                  })),
                  b = y,
                  "add" === i && (b = [].concat(mr(s), mr(y))),
                  (g = null === (a = this.store) || void 0 === a ? void 0 : a.getState().basic.refs.tagSetting) && g.okCallBack(mr(b)),
                  c && (this.setTagCheckedAndSelected(b),
                  this.store.dispatch(xS(b)),
                  w = this.store.getState().basic.REMAIN_CONFIGS,
                  this.store.dispatch($S(l(l({}, w), {}, {
                      tagList: b
                  }))));
                case 31:
                case "end":
                  return e.stop()
                }
        }), e, this)
    }
    )));
    return function(t) {
            return e.apply(this, arguments)
    }
  }()
},
```

```tsx
// are-trend-web\src\projects\trend-control\control-period\index.tsx

public async setTags(
    tags: string[],
    type?: 'replace' | 'add' = 'replace',
    updateRemainConfigs = true
  ) {
    let newTagsName = tags;
    const oldTagList = this.store.getState().basic.tagList;
    if (oldTagList?.length === 16) {
      message.warn('当前已达最大位号数量');
      return;
    }
    const oldNames = oldTagList.map(i => i.name);
    if (type === 'add') {
      newTagsName = newTagsName
        .filter(i => !oldNames.includes(i))
        .splice(0, 16 - oldTagList.length); // 过滤已有位号,并限制多数量为16
    }
    if (!newTagsName.length) return;
    // 请求模型空间
    const modelRes = await fetchModelTree({
      depth: -1,
      category: 'objs',
      visiblelevel: 0
    });
    // 根据位号名请求详情
    const res = await fetchResource({
      resPaths: [...newTagsName]
    });

    if (modelRes === null || res === null) {
      message.error('模型服务查询错误');
      return;
    }
    const tagsData = res?.result?.data?.var;
    if (!tagsData.length) return;
    const modelData = modelRes?.result?.data;
    const modelMap = getModelItem(modelData);
    const newTagList: ITagItem[] = tagsData.map((item, index) => {
      const color = Constant.TAG_COLOR[oldTagList.length + index];
      const { extProperty } = item;
      const modelMesg = modelMap.get(item.modelUuid);
      const itemName = `${modelMesg.modelPath}/${item.name}`;
      const tag =  {
        ...defaultTag,
        id: v1(),
        color,
        lrv: extProperty.lrv || 0,
        urv: extProperty.urv || 100,
        unit: extProperty.unit || '',
        min: extProperty.lrv || 0,
        max: extProperty.urv || 100,
        decimal: 2,
        desc: item.desc || '',
        displayItem: itemName,
        displayItemCache: itemName,
        type: item?.dataType ?? item.typeName,
        name: `var://${item.modelUuid}/${item.name}`
      };
      tag.min = getMin(tag);
      tag.max = getMax(tag);
      return tag;
    });

    let tagList = newTagList;
    if (type === 'add') {
      tagList = [...oldTagList, ...newTagList];
    }

    const refTagSetting = this.store?.getState().basic.refs.tagSetting;
    // TODO 脚本操作重构
    if (refTagSetting) {
      refTagSetting.okCallBack([...tagList]);
    }
    if (updateRemainConfigs) {
      this.setTagCheckedAndSelected(tagList);
      this.store.dispatch(updateTags(tagList));
      const oldRemainConfigs = this.store.getState().basic.REMAIN_CONFIGS;
      this.store.dispatch(
        setRemainConfigs({
          ...oldRemainConfigs,
          tagList
        })
      );
    }
  }
```

# Tips

## 报错信息有开发文件路径可打断点

报错信息如果有开发文件的话，直接点击进去，在代码中点击左侧即可打断点。

## 复制源码包含大量`\t`tab 制表符(回车符)

**【问题描述】**
从 `chrome-sources` 复制的压缩、重命名后的生产环境代码，包含大量`\t`tab 制表符，如何替换为空格？一个`\t`tab 制表符替换为两个空格。

**【解决方法】**

- 方法一：Vscode`Ctrl + F`，查找框中输入正则`\t`，替换框中输入两个空格` `。然后选择代码范围后全部替换即可。

- 方法二：Vscode 中右下角`选择缩进`配置，选择使用`空格缩进`，点击`空格缩进`选项，可以选择当前文件的制表符大小，选`2`。
