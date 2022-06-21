# 配置

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

# prettier 配置文件

```js
// .prettierrc.js
// {
//   "singleQuote": true,
//   "trailingComma": "all",
//   "printWidth": 80,
//   "overrides": [
//     {
//       "files": ".prettierrc",
//       "options": { "parser": "json" }
//     }
//   ]
// }

module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用缩进符，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: "as-needed",
  // jsx 不使用单引号，而使用双引号
  jsxSingleQuote: false,
  // 末尾需要有逗号
  trailingComma: "all",
  // 大括号内的首尾需要空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 箭头函数，只有一个参数的时候，也需要括号
  arrowParens: "always",
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: "preserve",
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: "css",
  // vue 文件中的 script 和 style 内不用缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf
  endOfLine: "lf",
  // 格式化嵌入的内容
  embeddedLanguageFormatting: "auto",
};
```

# 参考链接

- [使用 ESLint+Prettier 来统一前端代码风格](https://segmentfault.com/a/1190000015315545)
- [Prettier 的格式化配置](https://www.jianshu.com/p/a3b13dda486a)
