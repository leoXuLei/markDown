## 背景

react 上下文 context 是一个很有趣的 api，一方面 react 官网不推荐使用，另一方面许多官方依赖在使用。
目前使用 context 的依赖包：react-redux、mobx-react、react-router、拖拽组件 react-dnd

> **为什么使用**
> 考虑到组件有可能层层嵌套 ，在传 props 的过程中，如果书写大量的 `...props 或 propName={this.props.propValue}` 会导致代码灰常丑陋
> Context 提供了一个无需为每层组件手动添加 props，就能在组件树间进行数据传递的方法。

> **什么时候使用**
> Context 设计目的是为了共享那些对于一个组件树而言是“全局”的数据，例如当前认证的用户、主题或首选语言。

## 使用

新版 context 的使用步骤和方法：更好的解释了生产者和消费者模式

- 1、先定义全局 context 对象

```js
import React from "react";

const GlobalContext = React.createContext();
export default GlobalContext;
```

- 2、根组件引入 GlobalContext，并使用 GlobalContext.Provider（生产者）

```js
<GlobalContext.Provider
  value={{
    background: "green",
    color: "white",
    content: this.state.content,
    methodA: this.changeStateByChildren,
  }}
></GlobalContext.Provider>
```

注意：传入的 value 为根 context 对象的值，如果是动态的，使用状态管理

- 3、组件引入 GlobalContext 并调用 context，使用 GlobalContext.Consumer（消费者）

```js
<GlobalContext.Consumer>
  {(context) => {
    return (
      <div>
        <h1 style={{ background: context.background, color: context.color }}>
          {context.content}
        </h1>
        <Input methodA={context.methodA} value={context.content}></Input>
      </div>
    );
  }}
</GlobalContext.Consumer>
```

注意：**GlobalContext.Consumer 内必须是回调函数，改变 context，通过 context 方法改变根组件状态**

##　 context 优缺点

- 优点：跨组件访问数据

- 缺点：react 组件树种某个上级组件 shouldComponetUpdate 返回 false,当 context 更新时，不会引起下级组件更新

## 参考资料

- [使用 react Context API 的正确姿势](https://segmentfault.com/a/1190000018480764#item-1)

- [react 上下文 context 怎样使用](https://blog.csdn.net/qdmoment/article/details/82626525)
