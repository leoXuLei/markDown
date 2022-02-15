# 条件渲染内容效果组件
实现条件渲染内容效果的组件，代码如下

```js
export const ConditionComponent: React.FC<{
  isShow: boolean
  component?: () => React.ReactElement
}> = (props) => {
  if (!props.isShow) {
    return null
  }
  if (props.component) {
    return props.component()
  }
  return <React.Fragment>{props.children}</React.Fragment>
}
```
使用如下
```js
<ConditionComponent isShow={!!(props.item.endTime || props?.item.planBugFixTime) && !props.finished}>
    <RenderTimeText value={props?.item.planBugFixTime || props.item.endTime} />
</ConditionComponent>

<ConditionComponent isShow={!hideSprint && !!props.item.sprint}>
    <span className="card-content-info-item with-text">
    <FunctionOutlined style={{ marginRight: 2 }} />
    <span>{props.item.sprint?.name}</span>
    </span>
</ConditionComponent>
```

# IF-ELSE渲染内容效果组件

```js
const IfElseComponent: React.FC<{
  if: React.ReactElement
  else: React.ReactElement
  checked: boolean
}> = (props) => {
  if (props.checked) {
    return props.if
  }
  return props.else
}
```

使用如下
```jsx
<div className="icon-bar">
    <IfElseComponent checked={props.show} if={<LeftOutlined />} else={<RightOutlined />} />
</div>
```