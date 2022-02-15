## Fragments
### Fragments

> React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。


**Fragment与div的区别是：** 
==Fragment在渲染时不会绑定到dom节点。即少了一个无意义的div元素==
```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

### 短语法

你可以使用一种新的，且更简短的语法来声明 Fragments。它看起来像空标签：

**你可以像使用任何其他元素一样使用 <> </>，除了它不支持 key 或属性**。



```js
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Hello</td>
        <td>World</td>
      </>
    );
  }
}
```

### 带 key 的 Fragments

使用显式 <React.Fragment> 语法声明的片段可能具有 key。一个使用场景是将一个集合映射到一个 Fragments 数组 - 举个例子，创建一个描述列表：


**key 是唯一可以传递给 Fragment 的属性**。未来我们可能会添加对其他属性的支持，例如事件。

```js
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // 没有`key`，React 会发出一个关键警告
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```