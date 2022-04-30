# 实践

```jsx
className={classnames(
    'task-title-item',
    item.type === activeTab && 'task-title-item-active',
    {
        'task-title-item-active': item.css === 'disabled'
    }
)}

<Button className={classnames({
    //这里可以根据各属性动态添加，如果属性值为true则为其添加该类名，如果值为false，则不添加。这样达到了动态添加class的目的
      base: true,
      inProgress: this.props.store.submissionInProgress,
      error: this.props.store.errorOccurred,
      disabled: this.props.form.valid,
    })}>
<Button/>
```

# 参考资料
- [classnames 使用](https://www.jianshu.com/p/1125e9848af6)