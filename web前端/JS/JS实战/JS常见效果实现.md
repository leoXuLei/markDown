# 单行写一个评级组件

```js
const getStar = (rate) => {
  return "★★★★★☆☆☆☆☆".slice(5 - rate, 10 - rate);
}

getStar(0)  "☆☆☆☆☆"
getStar(1)  "★☆☆☆☆"
getStar(2)  "★★☆☆☆"
getStar(3)  "★★★☆☆"
getStar(4)  "★★★★☆"
getStar(5)  "★★★★★"
getStar(6)  ""
```

# 实现金钱格式化

```js
// 正则实现
const moneyFormat = (money) => {
  return String(money).replace(/\B(?=(\d{3})+(?!\d))/g,',')
}

moneyFormat(22310)  "22,310"
moneyFormat(223100)  "223,100"
moneyFormat(22310.0)  "22,310"
moneyFormat(22310.02) "22,310.02"
moneyFormat(23220.36513) "23,220.36,513"
```

```js
// 非正则实现
const format = (money) => {
  String(money)
    .split("")
    .reverse()
    .reduce((prev, next, index) => {
      return (index % 3 ? next : next + ",") + prev;
    });
};

moneyFormat(22310)  "22,310"
moneyFormat(223100)  "223,100"
moneyFormat(22310.0)  "22,310"
moneyFormat(22310.02) "22,310.02"
moneyFormat(23220.36513) "23,220.36,513"
```

# 点击某个元素触发另一个元素的 click 事件

原理： `Element?.click.()`

```jsx

const TitleCss = css`
  .gap {
    margin-right: 5px;
  }
`

interface ITitleProps {
  readonly?: boolean
  item: ITaskItemListDetail
  index: number
  onChange
}

const Title: React.FC<ITitleProps> = ({ item, readonly, index, onChange }: ITitleProps) => {
  const i18n = useAppLocales()?.modify
  const [endDate, setEndDate] = useState(item?.endTime)
  const handleEndTimeChange = useCallback(
    (v) => {
      onChange?.(item, v)
      setEndDate(v)
    },
    [item, onChange],
  )

  const itemKey = useMemo(() => `${item?.title}_${index}`, [item, index])

  const handleShowTimePicker = useCallback(() => {
    const ele = document.getElementById(itemKey)
    if (ele) {
      ele?.click?.()
    }
  }, [itemKey])

  return (
    <div
      css={TitleCss}
      style={!readonly ? { cursor: 'pointer' } : {}}
      onClick={!readonly ? handleShowTimePicker : undefined}
    >
      <div>{item?.title}</div>
      <ConditionComponent isShow={!readonly}>
        <div>
          <EditOutlined className="gap" />
          <Picker.TimePicker
            triggerProps={{
              id: itemKey,
            }}
            disabled={readonly || !endDate}
            value={endDate}
            noTimeText={'暂无'}
            onChange={handleEndTimeChange}
          />
        </div>
      </ConditionComponent>
    </div>
  )
}
```

# 页面跳转

## a 链接跳转

```jsx
export const Link = styled.a`
  color: #262626;
  color: #1b9aee;
  &:hover {
    color: #1890ff;
  }
`;

export const RenderTitle = ({ sprintName, sprintId, projectId }) => (
  <Link
    href={`/project/${projectId}/sprint/section/${sprintId}?viewType=overview`}
    target="_blank"
    rel="noreferrer"
  >
    {sprintName}
  </Link>
);
```

## window.open 实现跳转

```jsx
<div
  onClick={() => {
    if (!(item?.projectId && item?.id)) {
      return;
    }
    window.open(
      `/project/${item?.projectId}/sprint/section/${item?.id}?viewType=overview`,
      "_blank"
    );
  }}
>
  {item?.name}
</div>
```

# 输入型控件必填效果如何实现

可以通过 css 来实现未填提交时提示的效果, 原理就是如此

```jsx
options.belowContent = isDelay ? (
  <div className="belowContent">
    <div>请填写逾期原因：</div>
    <div className="right-part">
      <Input.TextArea
        placeholder="请填写逾期原因"
        rows={4}
        onChange={(e) => {
          // @ts-ignore
          document.getElementById("sprint-finish-reason").style.display =
            "none";
          delayReasonRef.current = e.target.value;
        }}
        showCount
      />
      <div
        id={"sprint-finish-reason"}
        style={{ display: "none", marginTop: -20, color: "red" }}
      >
        请输入
      </div>
    </div>
  </div>
) : (
  ""
);
confirmModal({
  title: `是否要完成${sprintOrProjectDesc}？`,
  okText: "完成",
  width: 720,
  ...options,
  onOk: async (v?: string) => {
    if (!delayReasonRef.current && options.belowContent) {
      // @ts-ignore
      document.getElementById("sprint-finish-reason").style.display = "block";
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject("");
    }
    const actualEndTime = actualEndTimeRef.current?.valueOf();
    if (v === "2") {
      await completeUndoneTasks(projectId, item.id);
    }
    const res = await completeSprint(
      projectId,
      item.id,
      delayReasonRef.current ?? "",
      actualEndTime
    );
    if (res.success) {
      onRefresh();
    } else {
      delayReasonRef.current = "";
    }
  },
});
```

# 生成当前时间戳

```js
export const getCurTimestamp = () => {
  const timestamp = new Date();
  return timestamp.valueOf();
};

const timestamp = new Date();
timestamp.valueOf(); // 1668496165776
timestamp.getTime(); // 1668496165776

// 调用 Tips-根据时间戳转换年月日方法 如下
handledDate(timestamp); // '2022/11/15  15:09'
```

```js

// Tips: 配方详情编辑时，是前端的增删改，改动后离开页面才会提示掉接口保存，
// 列表新增数据的id就用时间戳生成，map生成时由于间隔太短，
// 导致时间戳一致了，不符合id唯一的要求，通过 【时间戳 + 10*index】 来保证id唯一。
const paramId = getCurTimestamp() + 10 * index, // 参数id用最新的时间戳
```
