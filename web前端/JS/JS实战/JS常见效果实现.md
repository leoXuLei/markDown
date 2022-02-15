## 单行写一个评级组件

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

## 实现金钱格式化

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

## 点击事件后元素滚动进入视图

垂直/水平方向都支持
**垂直滚动：**

```js
const ele = <Card id={"member-detail"} />;
const toDetail = () => {
  const ele = document.getElementById("member-detail");

  if (ele) {
    ele.scrollIntoView({
      behavior: "smooth",
    });
  }
};
```

**水平滚动：**

```jsx
// 最后一列滚到视区
const scrollLastIntoView = useCallback(() => {
  if (isLastItem) {
    const ele = document.getElementById('last-item')
    if (ele) {
      ele?.scrollIntoView({
        behavior: 'smooth',
      })
    }
  }
}, [isLastItem])

useEffect(() => {
  scrollLastIntoView()
}, [scrollLastIntoView])

return (
      <FolderColumnItemWrapper id={isLastItem ? 'last-item' : ''}>
        <div className="folder-picker-handlers">
          <Tooltip title="创建文件夹">
            <FolderAddOutlined className="create-icon" onClick={undefined} />
          </Tooltip>
        </div>
      </FolderColumnItemWrapper>
    )
  },
```

## 点击某个元素触发另一个元素的 click 事件

原理： Element?.click.()

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

## 输入型控件必填效果如何实现

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
