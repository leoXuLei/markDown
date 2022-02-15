## 配置

安装后`.prettierrc 文件如下`，shift + alt + F 既可格式化代码

```js
 {
  "singleQuote": true, //字符串是否使用单引号，默认为false，使用双引号
  "trailingComma": "none", //是否使用尾逗号，有三个可选值"<none|es5|all>"
  "semi": true, // 行尾是否使用分号，默认为true
  "printWidth": 100, //一行的字符数，如果超过会进行换行，默认为80
  "tabWidth": 2, //一个tab代表几个空格数
  "useTabs": false, // 是否使用tab进行缩进，默认为false，表示用空格进行缩减
  "bracketSpacing": true //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  "overrides": [
    {
      "files": ".prettierrc",
      "options": { "parser": "json" }
    }
  ]
}
```

## 参考链接

- [使用 ESLint+Prettier 来统一前端代码风格](https://segmentfault.com/a/1190000015315545)
- [Prettier 的格式化配置](https://www.jianshu.com/p/a3b13dda486a)
