# ReactDOM API

- `ReactDOM`：这是 React 提供的用于操作 DOM 的库。
- `ReactDOM.unmountComponentAtNode`：这是 ReactDOM 中的一个方法，用于从指定的 DOM 节点上卸载已挂载的 React 组件。（常配合`ReactDOM.createPortal`使用）

## 实例一：`confirmModal`

`olympos-project`项目使用示例如下：

```tsx
export const confirmModal = (props: {
  title: string;
  content?: React.ReactNode;
  belowContent?: React.ReactNode;
  actualEndTimeField?: React.ReactNode;
  onOk: (v?: any) => void;
  okText?: string;
  options?: Array<{ label: string; value: string; disabled?: boolean }>;
}) => {
  const nodeWrapper = document.createElement("div");
  const nodeInner = document.createElement("div");
  nodeWrapper.appendChild(nodeInner);
  document.body.appendChild(nodeWrapper);
  ReactDOM.render(
    <div>
      {ReactDOM.createPortal(
        <MyModal
          {...props}
          onClose={() => {
            ReactDOM.unmountComponentAtNode(nodeWrapper);
            nodeWrapper.remove();
          }}
        />,
        nodeInner
      )}
    </div>,
    nodeWrapper
  );
};
```

# Fragments

## Fragments

> React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。

**Fragment 与 div 的区别是：**
==Fragment 在渲染时不会绑定到 dom 节点。即少了一个无意义的 div 元素==

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

## 短语法

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

## 带 key 的 Fragments

使用显式 <React.Fragment> 语法声明的片段可能具有 key。一个使用场景是将一个集合映射到一个 Fragments 数组 - 举个例子，创建一个描述列表：

**key 是唯一可以传递给 Fragment 的属性**。未来我们可能会添加对其他属性的支持，例如事件。

```js
function Glossary(props) {
  return (
    <dl>
      {props.items.map((item) => (
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

# 声明式加载组件 vs 命令式加载组件

## 声明式加载组件

声明式加载组件：`<ElectronicSignModal onRef={(e) => (this.eleSignRef = e)} />`

**【DOM 结构】**

使用声明式挂载`ElectronicSignModal`时，DOM 中的结构如下：

```html
<body>
  <div>
    <div class="supcon2-modal-root css-dev-only-do-not-override-w3qafl">
      <div
        tabindex="-1"
        class="supcon2-modal-wrap ele-sign-modal  supcon2-modal-centered"
      >
        <div role="dialog" aria-modal="true" class="supcon2-modal" />
      </div>
    </div>
  </div>
</body>
```

可以发现，

- 打开弹窗，组件是挂载在 body 的最后一个 div 元素内。`ele-sign-modal`是组件内部`Modal`的`wrapClassName`属性设置的类名。
- 关闭弹窗后，即从 body 的最后一个 div 元素及其后代全部删除。

**【调用处】**

调用处如下：

```tsx
class LoginHeader extends React.Component<LoginHeaderProps, LoginHeaderState> {
  eleSignRef = null;

// 取消全局配置设置
  handleGlobalSettingCancel = (callback = () => {}) => {
    this.setState(
      (prevState) => ({
        globalSettings: {
          ...prevState.globalSettings,
          visible: false,
        },
      }),
      () => {
        this.eleSignRef?.show(
          {
            signLevel: 2,
            signReason: "请确认位号xxxx",
            isRemarksRequired: true,
          },
          () => {
            console.log("完成了签名");
          }
        );
      }
    );
  };

  render() {
    const { timeStr, projectName, globalSettings } = this.state;
    return {
      <ElectronicSignModal onRef={(e) => (this.eleSignRef = e)} />
    };
  }
}
```

**【声明式加载的组件的源码】**

`ElectronicSignModal`源码如下：

```tsx
export interface IEleSignModalProps extends IEleSignModalParams {
  intl?: any;
  onRef?: (self) => void;
  onOk: (values: any) => void;
}

class ElectronicSignModal extends PureComponent<
  IEleSignModalProps,
  IEleSignModalState
> {
  static defaultProps = {
    onRef: null,
  };
  formRef: React.RefObject<FormInstance>;
  eleSignAuthDataRef: IEleSignAuthItem[];

  constructor(props) {
    super(props);
    this.props.onRef && this.props.onRef(this);
    this.formRef = React.createRef();
    this.resetRefData();
    this.initEleSignAuthData();
    this.state = {
      modalVisible: false,
      verifyIndex: 1,
      confirmBtnLoading: false,
    };
  }

  // 重置ref数据
  private resetRefData = () => {
    this.eleSignAuthDataRef = [];
  };

  // before: 声明式调用组件打开弹窗
  show = (args, callback) => {
    // 之前写法是用个this._propsRef缓存下所有props及callback
    for (var i in args) {
      this.props[i] = args[i];
    }
    this.initEleSignAuthData();
    this.setState({
      modalVisible: true,
    });
  };
}
```

## 命令式加载组件

命令式加载电子签名组件实例见`project/监控/index.md`

# 组件之间跨层级调用其函数的新思路

将函数和变量缓存至某个静态文件中。

```ts
// ../utils

const changePwdObj = {
  needChangePwd: false,
  registered: false,
  exec: () => void 0,
};

export const registerChangePwd = (cb: () => void) => {
  if (typeof cb !== "function") return;
  changePwdObj.registered = true;
  changePwdObj.exec = cb;
};

export const unRegisterChangePwd = () => {
  changePwdObj.registered = false;
  changePwdObj.exec = () => {};
};

export const globalChangePwd = () => {
  if (changePwdObj.registered) changePwdObj.exec();
};

export const setNeedChangePwd = (flag: any) => {
  changePwdObj.needChangePwd = !!flag;
};

export const getNeedChangePwd = () => {
  return changePwdObj.needChangePwd;
};
```

```tsx
// ./rightContent

class RightContent extends PureComponent {
  componentDidMount() {
    // 向utils相关对象中注册回调函数，功能为打开密码修改表单
    registerChangePwd(() => {
      this.handleVisibleClick("changePwd", true);
      this.setState({
        changePwdCancel: "false",
        changePwdMask: "true",
      });
    });
  }

  componentWillUnmount() {
    // 向utils相关对象中注册回调函数，功能为数据重置
    unRegisterChangePwd();
  }
}
```

```tsx
// src/pages/main/index

export default function Main() {
  useEffect(() => {
    const needsUpdatePwd =
      localStorage.getItem("password-needs-update") === "true";
    if (getNeedChangePwd() || needsUpdatePwd) {
      globalChangePwd();
      setNeedChangePwd(false);
    }
  }, []);
}
```

```tsx
// ../../login/loginForm.tsx

// 调用登录接口

userLogin({ ...params }).then((res) => {
  const { code = -1, modifyPassword = false } = res;
  if (code === 0) {
    // xxx
    setNeedChangePwd(modifyPassword);
  }
});
```

```tsx
// ../pages/header/index

class Header extends React.Component<any, any> {
  // ws消息回调
  private onWsMessage(msg: any) {
    const {
      data: { passwordRemainingDays = -1 },
    } = wsMsg;
    if (passwordRemainingDays > 0) {
      Modal.confirm({
        title: "密码即将过期",
        content: "您的密码即将过期，请及时修改",
        okText: "更新",
        cancelText: "稍后",
        onOk: () => {
          globalChangePwd();
        },
      });
    } else if (passwordRemainingDays === 0) {
      Modal.confirm({
        title: "密码已过期",
        content: "您的密码已经过期，请及时修改",
        okText: "更新",
        cancelText: "退出",
        onOk: () => {
          globalChangePwd();
        },
        onCancel: () => {
          this.ws?.sendMsg(
            JSON.stringify({
              type: "UserLogout",
              logInfo: { function: "logout" },
            })
          );
          logout().then(() => {
            this.props.exitOpenSource();
            this.props.navigate("/user/login");
          });
        },
      });
    }
  }
}
```
