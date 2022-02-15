## Refs 转发

- **作用：** Ref 转发是**一项将 ref 自动地通过组件传递到其一子组件的技巧**。对于大多数应用中的组件来说，这通常不是必需的。但其对某些组件，尤其是可重用的组件库是很有用的

- **本质：** **Ref 转发使组件可以像暴露自己的 ref 一样暴露子组件的 ref**

### 转发 refs 到 DOM 组件

**Ref 转发是一个可选特性，其允许某些组件接收 ref，并将其向下传递（换句话说，“转发”它）给子组件。**

在下面的示例中，==FancyButton 使用 React.forwardRef 来获取传递给它的 ref，然后转发到它渲染的 DOM button==：

```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.testRef = React.createRef();
  }

  render() {
    return (
      <>
        <FancyButton ref={this.testRef}>Click me!</FancyButton>
        <div
          onClick={() => {
            this.testRef && this.testRef.current.focus();
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

这样，==使用 FancyButton 的组件可以获取底层 DOM 节点 button 的 ref ，并在必要时访问，就像其直接使用 DOM button 一样==。

以下是对上述示例发生情况的逐步解释：

- **解释：**

  - 我们通过调用 React.createRef 创建了一个 React ref 并将其赋值给 ref 变量。
  - 我们通过指定 ref 为 JSX 属性，将其向下传递给 <FancyButton ref={ref}>。
  - React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数。
  - 我们向下转发该 ref 参数到 `<button ref={ref}>`，将其指定为 JSX 属性。
  - 当 ref 挂载完成，ref.current 将指向 `<button>` DOM 节点。

- **注意：**
  - 第二个参数 ref 只在使用 React.forwardRef 定义组件时存在。常规函数和 class 组件不接收 ref 参数，且 props 中也不存在 ref。
  - Ref 转发不仅限于 DOM 组件，你也可以转发 refs 到 class 组件实例中。

### 在高阶组件中转发 refs

让我们从一个输出组件 props 到控制台的 HOC 示例开始：

```js
function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log("old props:", prevProps);
      console.log("new props:", this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return LogProps;
}
```

“logProps” HOC 透传（pass through）所有 props 到其包裹的组件，所以渲染结果将是相同的。例如：我们可以使用该 HOC 记录所有传递到 “fancy button” 组件的 props：

上面的示例有一点需要注意：==**refs 将不会透传下去**。这是因为 ref 不是 prop 属性。就像 key 一样，其被 React 进行了特殊处理==。**如果你对 HOC 添加 ref，该 ref 将引用最外层的容器组件，而不是被包裹的组件**。

这意味着用于我们 FancyButton 组件的 refs 实际上将被挂载到 LogProps 组件：

```js
import FancyButton from "./FancyButton";

const ref = React.createRef();

// 我们导入的 FancyButton 组件是高阶组件（HOC）LogProps。
// 尽管渲染结果将是一样的，
// 但我们的 ref 将指向 LogProps 而不是内部的 FancyButton 组件！
// 这意味着我们不能调用例如 ref.current.focus() 这样的方法
<FancyButton label="Click Me" handleClick={handleClick} ref={ref} />;
```

幸运的是，我们**可以使用 React.forwardRef API 明确地将 refs 转发到内部的 FancyButton 组件**。React.forwardRef 接受一个渲染函数，其接收 props 和 ref 参数并返回一个 React 节点。例如：

```js
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log("old props:", prevProps);
      console.log("new props:", this.props);
    }

    render() {
      const { forwardedRef, ...rest } = this.props;

      // 将自定义的 prop 属性 “forwardedRef” 定义为 ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // 注意 React.forwardRef 回调的第二个参数 “ref”。
  // 我们可以将其作为常规 prop 属性传递给 LogProps，例如 “forwardedRef”
  // 然后它就可以被挂载到被 LogProps 包裹的子组件上。
  return React.forwardRef((props, ref) => {
    return <LogProps {...props} forwardedRef={ref} />;
  });
}
```

### 在 DevTools 中显示自定义名称
