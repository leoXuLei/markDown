# 介绍

MobX 是一个经过战火洗礼的库，它通过`透明的函数响应式编程`(transparently applying functional reactive programming - TFRP)**使得状态管理变得简单和可扩展**。MobX 背后的哲学很简单:

> 任何源自应用状态的东西都应该自动地获得。

其中包括 UI、数据序列化、服务器通讯，等等。

![](../../imgs/flow.png)

React 和 MobX 是一对强力组合。**React 通过提供机制把应用状态转换为可渲染组件树并对其进行渲染**。而 **MobX 提供机制来存储和更新应用状态供 React 使用**。

对于应用开发中的常见问题，React 和 MobX 都提供了最优和独特的解决方案。React 提供了优化 UI 渲染的机制， **这种机制就是通过使用虚拟 DOM 来减少昂贵的 DOM 变化的数量**。**MobX 提供了优化应用状态与 React 组件同步的机制，这种机制就是使用响应式虚拟依赖状态图表**，它只有在真正需要的时候才更新并且永远保持是最新的。

# 概念

> **【mobx 是什么？】**

**MobX 是一个状态管理库，旨在简化前端应用程序中的状态管理和响应式编程**。它的主要特点是使用可观察对象（Observable）来自动跟踪应用程序的状态变化，并将这些变化自动地应用到相关的视图组件上。

在使用 MobX 时，开发人员只需要使用 observable 函数来将需要观察的对象转化为可观察对象，然后使用 computed 函数来创建使用这些可观察对象的计算属性，最后使用 autorun 函数来创建响应式的副作用。

通过这种方式，MobX 可以自动追踪和在可观察对象发生变化时自动触发相应的副作用。这种自动追踪和自动触发的特性使得应用程序中的状态管理变得非常简单和直观，开发人员无需显式地调用状态更新的方法或手动进行视图的重新渲染。

除了可观察对象和计算属性之外，MobX 还提供了其他一些特性，比如动作（Action）用于修改可观察对象的状态、反应（Reaction）用于在状态变化时执行副作用等。

总结来说，MobX 是一个用于状态管理和响应式编程的库，通过使用可观察对象和自动追踪机制，使得状态管理变得简单和高效，提供更好的用户体验和开发体验。它在 React 和 React Native 等前端框架中得到广泛应用，并且具有很高的灵活性和可扩展性。

> **【上个回答中的可观察对象是什么意思？】**

可观察对象（Observable）是 MobX 中的一个概念，指的是那些可以被自动追踪变化并且能够通知相关观察者的对象。简单来说，可观察对象是一个可以响应状态变化的对象。

**在 MobX 中，通过使用 observable 函数将需要观察的对象转化为可观察对象。可观察对象可以是 JavaScript 对象、类的实例、数组或数据结构等**。

**一旦某个对象被转化为可观察对象，MobX 就会自动跟踪该对象的属性和方法的访问和修改，当这些属性或方法发生变化时，可观察对象会通知所有的观察者，并触发相应的副作用或重新渲染**。

使用可观察对象可以让开发人员编写更简洁和高效的代码，无需手动注册和触发状态变化的监听器，也无需手动调用重新渲染的方法。MobX 利用了 JavaScript 语言本身的特性来实现自动追踪和自动触发的机制，使得状态管理变得更加直观和简单。

总结来说，可观察对象是 MobX 中用于自动追踪和通知状态变化的对象，通过使用 observable 函数来将需要观察的对象转化为可观察对象。可观察对象可以自动触发相应的副作用或重新渲染，从而实现更好的状态管理和响应式编程。

# Api 概览

## 创建 observables

observable(value)

> **【用法】**

- `observable(value)`
- **`@observable classProperty = value`**
  - `700neo-web`项目`Model`中使用过

Observable 值可以是 JS 基本数据类型、引用类型、普通对象、类实例、数组和映射。

## Computed values(计算值)

> **【用法】**

- `computed(() => expression)`
- `computed(() => expression, (newValue) => void)`
- `computed(() => expression, options)`
- `@computed({equals: compareFn}) get classProperty() { return expression; }`
- **`@computed get classProperty() { return expression; }`**
  - `700neo-web`项目`Model`中使用过

创建计算值，`expression` 不应该有任何副作用而只是返回一个值。 **如果任何 `expression` 中使用的 `observable` 发生改变，它都会自动地重新计算，但前提是计算值被某些 `reaction` 使用了**。

## Actions(动作)

任何应用都有动作。动作是任何用来修改状态的东西。

使用 MobX 你可以在代码中显式地标记出动作所在的位置。 动作可以有助于更好的组织代码。 建议在任何更改 `observable` 或者有副作用的函数上使用动作。 结合开发者工具的话，动作还能提供非常有用的调试信息。

> **【用法】**

- `action(fn)`
- `action(name, fn)`
- `@action classMethod`
- `@action(name) classMethod`
- `@action boundClassMethod = (args) => { body }`
- **`@action.bound boundClassMethod(args) { body }`**
  - `700neo-web`项目`Model`中使用过，`Model`中的函数。

对于一次性动作，可以使用 `runInAction(name?, fn)` , 它是 `action(name, fn)()` 的语法糖.

### `Flow`

> **【用法】**

- `flow(function\* (args) { })`

`flow()` 接收 `generator` 函数作为它唯一的输入。

当处理异步动作时，回调中执行的代码不会被 action 包装。这意味着你修改的 `observable state` 无法通过 `enforceActions` 检查。保留动作语义的简单方法是使用 flow 来包装异步函数。这将确保所有回调都会被 `action()` 包装。

注意，异步函数必须是 `generator` ，而且在内部只能 `yield promises` 。flow 会返回一个 `promise` ，需要的话可以使用 `cancel()` 进行撤销。

## Reactions(反应) & Derivations(衍生)

**计算值是自动响应状态变化的值。反应是自动响应状态变化的副作用。**

**反应可以确保当相关状态发生变化时指定的副作用(主要是 I/O)可以自动地执行**，比如打印日志、网络请求、等等。 **使用反应最常见的场景是 React 组件的 observer 装饰器(参见下文)**。

### `observer`

可以用作包裹 `React` 组件的高阶组件。 在组件的 `render` 函数中的任何已使用的 `observable` 发生变化时，组件都会自动重新渲染。 注意 `observer` 是由 `"mobx-react"` 包提供的，而不是 `mobx` 本身。

> **【用法】**

- `observer(React.createClass({ ... }))`
- **`observer((props, context) => ReactElement)`**
- **`observer(class MyComponent extends React.Component { ... })`**
- `@observer class MyComponent extends React.Component { ... }`

## 实用工具

有一些工具函数可以使得 `observable` 或者 计算值用起来更方便。 更多实用工具可以在 `mobx-utils` 包中找到。

### `Provider` (mobx-react 包)

可以用来使用 React 的 `context` 机制来传递 `store` 给子组件。参见 `mobx-react` 文档。

### `inject` (mobx-react 包)

相当于 Provider 的高阶组件。可以用来从 `React` 的 `context` 中挑选 `store` 作为 `prop` 传递给目标组件。

> **【用法】**

- `inject("store1", "store2")(observer(MyComponent))`
- `@inject("store1", "store2") @observer MyComponent`
- `@inject((stores, props, context) => props) @observer MyComponent`
- `@observer(["store1", "store2"]) MyComponent` is a shorthand for the the `@inject() @observer` combo.

### `toJS`

> **【用法】**

- `toJS(observableDataStructure, options?)`

把 `observable` 数据结构转换成普通的 javascript 对象并忽略计算值。

# 参考链接

- [Mobx 中文网-API 概览](https://cn.mobx.js.org/refguide/api.html)

# 其它

- 之前 700neo-web 项目使用的也是 mobx。
  - `"mobx": "^5.15.6",`
  - `"mobx-react": "^6.3.0"`

```ts
import { observable, action, computed, runInAction, toJS } from "mobx";
```

```ts
import { observer, useObserver } from "mobx-react";
```
