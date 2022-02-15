## refs 获取真实 DOM 节点

**ref：** reference 引用

### 简述

- **定义：** Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素。**多用于 React 组件内子组件的引用**。

#### 背景

在典型的 React 数据流中，props 是父组件与子组件交互的唯一方式。要修改一个子组件，你需要使用新的 props 来重新渲染它。但是，在某些情况下，你需要在典型数据流之外强制修改子组件。**被修改的子组件可能是一个 React 组件的实例，也可能是一个 DOM 元素**。对于这两种情况，React 都提供了解决办法。

#### 注意

- 勿过度使用 Refs

  你可能首先会想到使用 refs 在你的 app 中“让事情发生”。如果是这种情况，请花一点时间，认真再考虑一下 state 属性应该被安排在哪个组件层中。通常你会想明白，**让更高的组件层级拥有这个 state，是更恰当的**

- React 16.3 版本引入的 React.createRef() API。较早的是使用回调函数形式的 refs

### 两种获取方法

- `e.target`

  标签上触发的 `onChange/onClick` 函数的参数 `e.target` 就是获取到触发事件的元素节点。

- 给元素设置 ref

  有时需要从组件获取真实 DOM 的节点，这时就要用到  ref  属性，
  但是不推荐，有时可能会遇到各种各样的问题，但是在做一些极其复杂的业务时候，比如一些动画的时候，不可避免要用到页面上的 dom 标签 ，这时候再用 ref，但是 ref 跟 setStae 一起用容易出错：dom 的获取并不及时，因为 setState 是异步的，所以可以将获取页面 dom 的操作放在 setState 的回调函数中完成。

### (1):访问 Refs （React.createRef()）

- **如何访问：** 当 ref 被传递给 render 中的元素时，**对该节点的引用可以在 ref 的 current 属性中被访问**。
  ```js
  const node = this.myRef.current;
  ```
- **ref 的值根据节点的类型而有所不同：**

  - 当 ref 属性用于 HTML 元素时，构造函数中使用 **React.createRef() 创建的 ref 接收底层 DOM 元素作为其 current 属性**。
  - 当 ref 属性用于自定义 class 组件时，**ref 对象接收组件的挂载实例作为其 current 属性**。
  - **你不能在函数式组件上使用 ref 属性，因为他们没有实例**，（可以使用 React.forwardRef 包裹）。

#### 例【1】为 DOM 元素添加 ref

```js
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // 创建一个 ref 来存储 textInput 的 DOM 元素
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // 直接使用原生 API 使 text 输入框获得焦点
    // 注意：我们通过 "current" 来访问 DOM 节点
    this.textInput.current.focus();
  }

  static getDerivedStateFromProps() {
    // console.log(this.textInput.current); Uncaught TypeError: Cannot read property 'textInput' of undefined
    return null;
  }

  componentDidMount() {
    console.log(this.textInput.current); // <input type="text">
  }

  render() {
    // 告诉 React 我们想把 <input> ref 关联到
    // 构造器里创建的 `textInput` 上
    return (
      <div>
        <input type="text" ref={this.textInput} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React 会在组件挂载时给 current 属性传入 DOM 元素，并在组件卸载时传入 null 值。ref 会在 componentDidMount 或 componentDidUpdate 生命周期钩子触发前更新。

#### 例【2】为 class 组件添加 Ref

如果我们想包装上面的 CustomTextInput，我们可以使用 ref 来获取这个自定义的 input 组件并手动调用它的 focusTextInput 方法：

```js
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  render() {
    return (
      <>
        <CustomTextInput ref={this.textInput} />
        <div
          onClick={() => {
            this.textInput.current.focusTextInput();
          }}
        >
          父组件按钮
        </div>
      </>
    );
  }
}

export default AutoFocusTextInput;
```

#### 例【3】Refs 与函数组件

- ==默认情况下，你不能在函数组件上使用 ref 属性，因为它们没有实例==。
- 如果要在函数组件中使用 ref，你可以使用 forwardRef（可与 useImperativeHandle 结合使用），或者可以将该组件转化为 class 组件。
- 不管怎样，你可以在函数组件内部使用 ref 属性，只要它指向一个 DOM 元素或 class 组件：

```js
function CustomTextInput(props) {
  // 这里必须声明 textInput，这样 ref 才可以引用它
  const textInput = useRef(null);

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input type="text" ref={textInput} />
      <input type="button" value="Focus the text input" onClick={handleClick} />
    </div>
  );
}

export default CustomTextInput;
```

### (2):回调 Refs

React 也支持另一种设置 refs 的方式，称为“回调 refs”。它能助你更精细地控制何时 refs 被设置和解除。

不同于传递 createRef() 创建的 ref 属性，你会**传递一个函数。这个函数中接受 React 组件实例或 HTML DOM 元素作为参数，以使它们能在其他地方被存储和访问**。

#### 例【1】使用 ref 回调函数

```js
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.focusTextInput = () => {
      // 使用原生 DOM API 使 text 输入框获得焦点
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // 组件挂载后，让文本框自动获得焦点
    this.focusTextInput();
  }

  render() {
    // 使用 `ref` 的回调函数将 text 输入框 DOM 节点的引用存储到 React
    // 实例上（比如 this.textInput）
    return (
      <div>
        <input
          type="text"
          ref={(element) => {
            this.textInput = element;
          }}
        />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React 将在组件挂载时，会调用 ref 回调函数并传入 DOM 元素，当卸载时调用它并传入 null。在 componentDidMount 或 componentDidUpdate 触发前，React 会保证 refs 一定是最新的。

#### 例【2】组件间传递回调形式的 refs

就像你可以传递通过 React.createRef() 创建的对象 refs 一样。

```js
class Parent extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <CustomTextInput
          ref={(node) => {
            this.textInput = node;
          }}
        />
        <div
          onClick={() => {
            this.textInput && this.textInput.focusTextInput();
          }}
        >
          父组件按钮
        </div>
      </>
    );
  }
}

export default Parent;
```

```js
import React from "react";

function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} defaultValue="test文本" />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <>
        <CustomTextInput inputRef={(el) => (this.inputElement = el)} />
        <div
          onClick={() => {
            this.inputElement && this.inputElement.focus();
          }}
          style={{ marginTop: 20 }}
        >
          父组件按钮
        </div>
      </>
    );
  }
}

export default Parent;
```

```jsx
// 父子组件都是函数式组件，也能使用回调Refs
import React, { memo, useRef } from "react";

function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} defaultValue="test文本" />
    </div>
  );
}

const Parent = memo(() => {
  let inputElementRef = useRef();
  return (
    <>
      <CustomTextInput inputRef={(el) => (inputElementRef = el)} />
      <div
        onClick={() => {
          console.log(inputElementRef);
          inputElementRef && inputElementRef && inputElementRef.focus();
        }}
        style={{ marginTop: 20 }}
      >
        父组件按钮
      </div>
    </>
  );
});

export default Parent;
```

在上面的例子中，Parent 把它的 refs 回调函数当作 inputRef props 传递给了 CustomTextInput，而且 CustomTextInput 把相同的函数作为特殊的 ref 属性传递给了 `<input>`。结果是，**在 Parent 中的 this.inputElement 会被设置为与 CustomTextInput 中的 input 元素相对应的 DOM 节点**。

### 注意

- 关于回调 refs 的说明

  如果 ref 回调函数是以内联函数的方式定义的，在更新过程中它会被执行两次，第一次传入参数 null，然后第二次会传入参数 DOM 元素。这是因为在每次渲染时会创建一个新的函数实例，所以 React 清空旧的 ref 并且设置新的。通过将 ref 的回调函数定义成 class 的绑定函数的方式可以避免上述问题，但是大多数情况下它是无关紧要的。

- 过时 API：String 类型的 Refs

  如果你之前使用过 React，你可能了解过之前的 API 中的 string 类型的 ref 属性，例如 "textInput"。你可以通过 this.refs.textInput 来访问 DOM 节点。我们不建议使用它，因为 string 类型的 refs 存在 一些问题。它已过时并可能会在未来的版本被移除。

### 其它

- **React.createRef：**

  直接看 React.createRef 的源码：

  ```js
  function createRef(): RefObject {
    const refObject = {
      current: null,
    };
    return refObject;
  }
  ```

  可见，ref 对象就是仅仅是包含 current 属性的普通对象。

  ### 参考资料

  - [关于 ref 的一切](https://mp.weixin.qq.com/s/hy0FQg2_vYmEvqMIaSpi5Q)
