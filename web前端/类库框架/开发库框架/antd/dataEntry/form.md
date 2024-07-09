# 自定义表单控件

自定义或第三方的表单控件，也可以与 Form 组件一起使用。只要该组件遵循以下的约定：

- 提供受控属性 value 或其它与 valuePropName 的值同名的属性。
- 提供 onChange 事件或 trigger 的值同名的事件。

# `formItem`

## `rules.validator`

formItem 的 `rules.validator` 规则校验（只能校验本控件的值，如果受到其他控件的值影响，则没法实现（但是 TY 项目里面 YB 封装的表单组件是可以的，因为重写了 validator，第三个参数传了 form 实例，通过实例方法获取其它控件的值。））。

```tsx
const rules = [
  {
    validator: async (rule, value) => {
      return new Promise<void>((resolve, reject) => {
        console.log("rule, value", rule, value);
        const { selected, other } = value || {};
        if (!value) {
          reject();
        }
        if (!selected || (selected === "other" && !other)) {
          reject(new Error(rule.message));
        } else {
          resolve();
        }
      });
    },
    message: "标准产量",
  },
];
```

# `<Input.Password />`密码输入框直接回车确认

**【实现方法】**

控件设置`onPressEnter`属性即可，回车触发确认提交。

```tsx
onSubmit = () => {
  return new Promise((resolve, reject) => {
    let password = "";
    this.formRef.current.validateFields().then((values) => {
      password = values.password;
      values.password = values.password ? encrypt(values.password) : "";
      const operationLog = {
        ...this.props.operationLog,
        user: values.userName,
      };
      return checkPwd(values, operationLog);
    });
  });
};

return (
  <Form.Item name="password" label={passwordLabel}>
    <Input.Password placeholder={passwordLabel} onPressEnter={this.onSubmit} />
  </Form.Item>
);
```
