## Form2

```js
const res = await $form.current.validate({
  force: true, // 不加强制的话，假如某个控件A的必填校验受别的控件B影响，B值修改后期望A不再必填，点击提交，上次的A控件的必填校验提示任然会存在
});
```
