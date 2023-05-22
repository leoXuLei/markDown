# Each child in an array or iterator should have a unique "key" prop

只要在 js 中遍历数组生成 jsx 标签块时，必须给生成的标签块加一个唯一的 key，即 item 中的一个字段。

# can’t call state on an unmounted component

一般在 componentDidMount 里面 fetch 数据，都会出现这样的的 Warning
没有挂载的组件执行了 setState()操作，会造成内存泄漏。异步请求返回数据之前，组件可能就已经被卸载了，等数据回来再使用 setState 就会报出上面的警告

```js
componentDidMount() {
  this._isMounted = true;
}
componentWillUnmount() {
  this._isMounted = false;
}
fetchData() {
  fetchProdCatalogHisNumber({
    mhss: '',
    ksrq: '',
    jsrq: '',
    czcj: 1,
  })
  .then(({records = []}) => {
    if (_isMounted) {
      this.setState({
        cplxCountList: records
      })
    }
  })
  .catch(error => {

  })
}
```

# `a <Router> may have only one child element`

这是因为`<Router>` 只能包裹一个子标签，把 Router 之前包裹的东西用一个 div 再包一下就好了。

```js
<Router>
  <div>
    <ul>
      <li>
        <Link to="/">home组件</Link>
      </li>
      <li>
        <Link to="/news">news组件</Link>
      </li>
    </ul>
    <br />
    <Route exact path="/" component={Home} />
    <Route path="/news" component={News} />
  </div>
</Router>
```

# React.createElement: type is invalid

`expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.`

写表单控件时用法写错
`const FormItem = Form.Item;`

上面是正确写法，我写成了 `const { FormItem } = Form;`

# HTML entities must be escaped

HTML 实体必须被转义
因为字符串中含有转义字符，所以不能直接放到 html 标签中，

![](../imgs/other-error-3.png)

必须向下图这样
![](../imgs/other-error-4.png)

# Functions are not valid as a React child

`This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.`

已解决，还是创建 Form.create()的格式写错了（搞了一个小时。。。。）
写成了`export default Form.create(SearchForm);`
正确的应该是
`export default Form.create()(SearchForm);`

# Uncaught DOMException: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node.

插入节点，跟 react 底层 diff 相关，很可能是 JSX 块的问题。详见`Antv/X6`实例。
