# Eslint 配置

## 简介

Eslint 是一个 JavaScript 验证工具,有了它可以让你的编辑器像 ide 一样进行一些静态的错误提示功能.

- eslint-plugin-react // 识别 react 特定语法规则和要求
- babel-eslint // 如果用到了 es6 的新语法, 需要安装 babel-eslint,不然会把箭头函数识别成错误

## 安装

```powerShell
npm install eslint -g   （全局安装ESLint）

npm install eslint babel-eslint eslint-plugin-react eslint-plugin-import  -D

eslint --init  // 创建ESlint配置文件.eslintrc.js：
```

## 配置文件

配置完后重启 VScode 并确保 ESLint 插件是开的。
下面的配置涵盖了开发者所需要的绝大部分信息，rules 中的值 0、1、2 分别表示不开启检查、警告、错误。你可以看到下面有些是 0，如果有需要开启检查，可以自己修改为 1 或者 2。

### 纯 ESlint 配置

```js
{
  "env": {
    "browser": true,
    "es2021": true,
    "es6": true
  },
  // 扩展就是直接使用别人已经写好的 lint 规则，方便快捷。扩展一般支持三种类型：
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "eslint-config-standard"
  ],
  // 解析器类型：espima(默认), babel-eslint, @typescript-eslint/parse
  "parser": "babel-eslint",
  // 解析器配置参数
  "parserOptions": {
    // es 版本号，默认为 5，也可以使用年份，比如 2015 (同 6)
    "ecmaVersion": 12,
    // 代码类型：script(默认), module
    "sourceType": "module",
    // es 特性配置
    "ecmaFeatures": {
      "globalReturn": true, // 允许在全局作用域下使用 return 语句
      "impliedStrict": true, // 启用全局 strict mode
      "jsx": false // 启用 JSX
    }
  },
  // "plugins": ["react", "@typescript-eslint"],
  "plugins": ["react"],
  "globals": {
    // 声明 jQuery 对象为全局变量
    "$": false // true表示该变量为 writeable，而 false 表示 readonly
    // "process": true,
    // "__dirname": true
  },
  "rules": {
    "arrow-parens": 0, // 箭头函数用小括号括起来
    "arrow-spacing": 0, // =>的前/后括号
    "camelcase": 0, //强制驼峰法命名
    "comma-dangle": 0, //对象字面量项尾不能有逗号
    "eol-last": 0, //文件以单一的换行符结束
    "func-style": 0,
    // 方法定义风格，参数：
    //    declaration: 强制使用方法声明的方式，function f(){} e.g [2, "declaration"]
    //    expression：强制使用方法表达式的方式，var f = function() {}  e.g [2, "expression"]
    //    allowArrowFunctions: declaration风格中允许箭头函数。 e.g [2, "declaration", { "allowArrowFunctions": true }]
    "jsx-quotes": [2, "prefer-double"], //强制在JSX属性（jsx-quotes）中一致使用双引号
    "no-console": 0, //不禁用console
    "no-debugger": 2, //禁用debugger
    "no-var": 0, //对var警告
    "no-irregular-whitespace": 0, //不规则的空白不允许
    "no-trailing-spaces": 1, //一行结束后面有空格就发出警告
    "no-unused-vars": [2, { "vars": "all", "args": "after-used" }], //不能有声明后未被使用的变量或参数
    "no-underscore-dangle": 0, //标识符不能以_开头或结尾
    "no-alert": 2, //禁止使用alert confirm prompt
    "no-class-assign": 2, //禁止给类赋值
    "no-cond-assign": 2, //禁止在条件表达式中使用赋值语句
    "no-const-assign": 2, //禁止修改const声明的变量
    "no-delete-var": 2, //不能对var声明的变量使用delete操作符
    "no-dupe-keys": 2, //在创建对象字面量时不允许键重复
    "no-duplicate-case": 2, //switch中的case标签不能重复
    "no-dupe-args": 2, //函数参数不能重复
    "no-empty": 2, //块语句中的内容不能为空
    "no-func-assign": 2, //禁止重复的函数声明
    "no-invalid-this": 0, //禁止无效的this，只能用在构造器，类，对象字面量
    "no-lone-blocks": 0, //禁止不必要的嵌套块
    "no-mixed-spaces-and-tabs": 0, //禁止混用tab和空格
    "no-redeclare": 2, //禁止重复声明变量
    "no-spaced-func": 1, //函数调用时 函数名与()之间不能有空格
    "no-this-before-super": 0, //在调用super()之前不能使用this或super
    "no-undef": 2, //不能有未定义的变量
    "no-unreachable": 1, //不能有无法执行的代码
    "no-use-before-define": 2, //未定义前不能使用
    "prefer-arrow-callback": 0, //比较喜欢箭头回调
    "quotes": [0, "single"], //单引号
    "react/display-name": 0, //防止在React组件定义中丢失displayName
    "react/forbid-prop-types": [2, { "forbid": ["any"] }], //禁止某些propTypes
    "react/jsx-boolean-value": 2, //在JSX中强制布尔属性符号
    "react/jsx-closing-bracket-location": 1, //在JSX中验证右括号位置
    "react/jsx-curly-spacing": [2, { "when": "never", "children": true }], //在JSX属性和表达式中加强或禁止大括号内的空格。
    "react/jsx-indent-props": ["off", 2], //验证JSX中的props缩进
    "react/jsx-key": 2, //在数组或迭代器中验证JSX具有key属性
    "react/jsx-max-props-per-line": [1, { "maximum": 3 }], // 限制JSX中单行上的props的最大数量
    "react/jsx-no-bind": 0, //JSX中不允许使用箭头函数和bind
    "react/jsx-no-duplicate-props": 2, //防止在JSX中重复的props
    "react/jsx-no-literals": 0, //防止使用未包装的JSX字符串
    "react/jsx-no-undef": 1, //在JSX中禁止未声明的变量
    "react/jsx-pascal-case": 0, //为用户定义的JSX组件强制使用PascalCase
    "react/jsx-sort-props": 0, //强化props按字母排序
    "react/jsx-uses-react": 1, //防止反应被错误地标记为未使用
    "react/jsx-uses-vars": 2, //防止在JSX中使用的变量被错误地标记为未使用
    "react/no-danger": 0, //防止使用危险的JSX属性
    "react/no-did-mount-set-state": 0, //防止在componentDidMount中使用setState
    "react/no-did-update-set-state": 1, //防止在componentDidUpdate中使用setState
    "react/no-direct-mutation-state": 2, //防止this.state的直接变异
    "react/no-multi-comp": 2, //防止每个文件有多个组件定义
    "react/no-set-state": 0, //防止使用setState
    "react/no-unknown-property": 2, //防止使用未知的DOM属性
    "react/prefer-es6-class": 2, //为React组件强制执行ES5或ES6类
    "react/prop-types": 0, //防止在React组件定义中丢失props验证
    "react/react-in-jsx-scope": 2, //使用JSX时防止丢失React
    "react/self-closing-comp": 0, //防止没有children的组件的额外结束标签
    "react/sort-comp": 2, //强制组件方法顺序
    "no-extra-boolean-cast": 0, //禁止不必要的bool转换
    "react/no-array-index-key": 0, //防止在数组中遍历中使用数组key做索引
    "react/no-deprecated": 1, //不使用弃用的方法
    "react/jsx-equals-spacing": 2, //在JSX属性中强制或禁止等号周围的空格
    "semi": 0, //不强制使用分号
    "space-before-function-paren": 0 // 方法名和括号之间需要有一个空格
  },
  "settings": {
    "import/ignore": ["node_modules"]
  }
}
```

## 其它

### 检查 Git 提交的代码

除了静态代码检查，我们还设置一道关卡来保证提交的代码符合规范。这就需要使用到我们主角 `pre-commit` 钩子。
这里假设项目中使用 Git 进行代码的提交操作。

- 首先在 package.json 中增加如下脚本指令：

```js
// 这里将检查目录 src 下面所有以 .js或.jsx 格式结尾的代码文件。
{
  "scripts": {
    "lint": "eslint --ext .js --ext .jsx src"
  }
}
```

- 然后，安装 `pre-commit` ，以便检查提交操作：
  先执行安装 `npm install --save-dev pre-commit`，然后在 package.json 中增加下面配置。

  ```js
  {
  "pre-commit": [
      "lint"
  ]
  }
  ```

  这里的 lint 对应第 1 步中增加的脚本命令名。

完成之后，在每次提交代码之前，pre-commit 都会拦截 Git 的 commit 操作，然后运行 lint 命令进行代码检测，若检测到有违反校验规则的情况，则会返回错误，从而导致 git commit 失败。

### 关闭 Eslint 检查

- 某些文件关闭 eslint 检查
  你不总是希望所有的文件都开启 eslint 检查，那么，给单独的 js 文件关闭 eslint 的方式，只需要在该文件的最顶部加上一段注释。

  ```js
  /* eslint-disable react-hooks/exhaustive-deps */

  function test() {
    return true;
  }
  ```

- 给某一行 js 代码关闭 eslint 检查
  关闭整个 js 文件的行为有点暴力，别担心，你还可以只给其中某段代码关闭 eslint。

  ```js
  // eslint-disable-line 让这一行代码不编译，即出错了也不会报错，可以git commit成功

  // eslint-disable-next-line  关闭下一行
  alert("foo");
  ```

### vscode 配置

```js
{
    "eslint.enable": true, // 启用Eslint 启用/禁用ESLint。 默认情况下启用。
     // 保存时自动格式化代码
    "editor.codeActionsOnSave": {
        "source.fixAll": false, // 包括ESLint在内的所有提供程序打开“自动修复”
        "source.fixAll.eslint": true // 仅在ESLint上将“自动修复”打开
    },
    "eslint.debug": {} // 启用ESLint的调试模式（与--debug命令行选项相同）。 请参阅ESLint输出通道以获取调试输出。 此选项对于跟踪ESLint的配置和安装问题非常有用，因为它提供了有关ESLint如何验证文件的详细信息。
    "eslint.options": // 用于配置如何使用ESLint CLI的选项。 默认为空。 指向自定义.eslintrc.json文件的示例是`{"eslint.options": { "configFile": "C:/mydirectory/.eslintrc.json" }}`

    "editor.formatOnSave", // 建议使用editor.codeActionsOnSave功能，因为它具有更好的可配置性。
    // 旧的eslint.autoFixOnSave设置现已弃用，可以安全地删除。 另请注意，如果您将ESLint用作默认格式化程序，则应在打开editor.codeActionsOnSave后关闭editor.formatOnSave。 否则，您的文件将被修复两次，这是不必要的。
}
```

## 参考链接

- [ESlint 官网](http://eslint.cn/)
- [深入理解 ESLint](https://segmentfault.com/a/1190000019896962)
- [React 项目配置 ESlint 总结](https://zhuanlan.zhihu.com/p/84329603)

- [eslint 使用规则，和各种报错对应规则](https://cloud.tencent.com/developer/article/1119444)
- [详解 React 开发必不可少的 eslint 配置](https://www.jianshu.com/p/f8d2ef372adf)
- [在 React 项目中使用 Eslint 代码检查工具](https://segmentfault.com/a/1190000016626739#item-3)
- [Eslint 配置及规则说明](https://blog.csdn.net/hsl0530hsl/article/details/78594973)
- [VSCode 配置 ESLint](https://segmentfault.com/a/1190000020335766?utm_source=tag-newest)
- [白话 Linters (EsLint)](https://www.jianshu.com/p/4d4900ce4230)
- [ESLint & typescript 配置文件 .eslintrc.js](https://www.jianshu.com/p/58882d3c2135)
- [规范化标准学习总结（ESLint 、StyleLint 、Prettier 、Git Hooks）](https://blog.csdn.net/u012961419/article/details/107991794)
