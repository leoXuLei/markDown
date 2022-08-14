# 简介

学过网页开发就会知道，CSS 不能算编程语言，只是网页样式的一种描述方法。

**为了让 CSS 也能适用软件工程方法**，程序员想了各种办法，让它变得像一门编程语言。从最早的 Less、SASS，到后来的 PostCSS，再到最近的 CSS in JS，都是为了解决这个问题。

本文介绍的 CSS Modules 有所不同。它不是将 CSS 改造成编程语言，而是功能很单纯，**只加入了局部作用域和模块依赖，这恰恰是网页组件最急需的功能**。

因此，CSS Modules 很容易学，因为它的规则少，同时又非常有用，**可以保证某个组件的样式，不会影响到其他组件**。

# 一、局部作用域

**CSS 的规则都是全局的，任何一个组件的样式规则，都对整个页面有效**。

**产生局部作用域的唯一方法，就是使用一个独一无二的 class 的名字，不会与其他选择器重名**。这就是 CSS Modules 的做法。

下面是一个 React 组件[`App.js`](https://github.com/ruanyf/css-modules-demos/blob/master/demo01/components/App.js)。

>

```js
import React from "react";
import style from "./App.css";

export default () => {
  return <h1 className={style.title}>Hello World</h1>;
};
```

上面代码中，我们将样式文件[`App.css`](https://github.com/ruanyf/css-modules-demos/blob/master/demo01/components/App.css)输入到 `style`对象，然后引用 `style.title`代表一个 `class`。

>

```css
.title {
  color: red;
}
```

构建工具会将类名 `style.title`编译成一个哈希字符串。

>

```html
<h1 class="_3zyde4l1yATCOkgn-DBWEL">Hello World</h1>
```

`App.css`也会同时被编译。

>

```css
._3zyde4l1yATCOkgn-DBWEL {
  color: red;
}
```

这样一来，这个类名就变成独一无二了，只对 `App`组件有效。

CSS Modules 提供各种[插件](https://github.com/css-modules/css-modules/blob/master/docs/get-started.md)，支持不同的构建工具。本文使用的是 Webpack 的[`css-loader`](https://github.com/webpack/css-loader#css-modules)插件，因为它对 CSS Modules 的支持最好，而且很容易使用。

# 二、全局作用域

CSS Modules 允许使用 `:global(.className)`的语法，声明一个全局规则。凡是这样声明的 `class`，都不会被编译成哈希字符串。

[`App.css`](https://github.com/ruanyf/css-modules-demos/blob/master/demo02/components/App.css)加入一个全局 `class`。

>

```css
.title {
  color: red;
}

:global(.title) {
  color: green;
}
```

**`App.js`使用普通的 `class`的写法，就会引用全局 `class`（即`className="title"`）**。

>

```js
import React from "react";
import styles from "./App.css";

export default () => {
  return <h1 className="title">Hello World</h1>;
};
```

应该会[看到](https://ruanyf.github.io/css-modules-demos/demo02/) `h1`标题显示为绿色。

CSS Modules 还提供**一种显式的局部作用域语法 `:local(.className)`，等同于 `.className`**，所以上面的 `App.css`也可以写成下面这样。

>

```css
:local(.title) {
  color: red;
}

:global(.title) {
  color: green;
}
```

# 三、定制哈希类名

`css-loader`默认的哈希算法是 `[hash:base64]`，这会将 `.title`编译成 `._3zyde4l1yATCOkgn-DBWEL`这样的字符串。

[`webpack.config.js`](https://github.com/ruanyf/css-modules-demos/blob/master/demo03/webpack.config.js)里面可以定制哈希字符串的格式。

>

```js
module: {
  loaders: [
    // ...

    {
      test: /\.css$/,
      loader:
        "style-loader!css-loader?modules&localIdentName=[path][name]---[local]---[hash:base64:5]",
    },
  ];
}
```

运行这个示例。

>

```bash

$ npm run demo03
```

你会[发现](https://ruanyf.github.io/css-modules-demos/demo03/) `.title`被编译成了 `demo03-components-App---title---GpMto`。

# 四、 Class 的组合

**在 CSS Modules 中，一个选择器可以继承另一个选择器的规则，这称为"组合"**（["composition"](https://github.com/css-modules/css-modules#composition)）。

在[`App.css`](https://github.com/ruanyf/css-modules-demos/blob/master/demo04/components/App.css)中，让 `.title`继承 `.className`（composes: `${className}`） 。

>

```css
.className {
  background-color: blue;
}

.title {
  composes: className; /* 继承语法 */
  color: red;
}
```

[`App.js`](https://github.com/ruanyf/css-modules-demos/blob/master/demo04/components/App.js)不用修改。

```js
import React from "react";
import style from "./App.css";

export default () => {
  return <h1 className={style.title}>Hello World</h1>;
};
```

运行这个示例。

>

```bash

$ npm run demo04
```

打开 `http://localhost:8080`，会[看到](https://ruanyf.github.io/css-modules-demos/demo04/)红色的 `h1`在蓝色的背景上。

`App.css`编译成下面的代码。

>

```css
._2DHwuiHWMnKTOYG45T0x34 {
  color: red;
}

._10B-buq6_BEOTOl9urIjf8 {
  background-color: blue;
}
```

相应地， `h1`的 `class`也会编译成 `<h1 class="_2DHwuiHWMnKTOYG45T0x34 _10B-buq6_BEOTOl9urIjf8"></h1>`。

# 五、输入其他模块

**选择器也可以继承其他 CSS 文件里面的规则（composes: `${className}` from "./another.css";）**。

[`another.css`](https://github.com/ruanyf/css-modules-demos/blob/master/demo05/components/another.css)

```css
.className {
  background-color: blue;
}
```

[`App.css`](https://github.com/ruanyf/css-modules-demos/blob/master/demo05/components/App.css)可以继承 `another.css`里面的规则。

>

```css
.title {
  composes: className from "./another.css";
  color: red;
}
```

运行这个示例。

>

```bash

$ npm run demo05
```

打开 `http://localhost:8080`，会[看到](https://ruanyf.github.io/css-modules-demos/demo05/)蓝色的背景上有一个红色的 `h1`。

# 六、输入变量

CSS Modules 支持使用变量，不过需要安装 PostCSS 和 [postcss-modules-values](https://github.com/css-modules/postcss-modules-values)。

>

```bash

$ npm install --save postcss-loader postcss-modules-values
```

把 `postcss-loader`加入[`webpack.config.js`](https://github.com/ruanyf/css-modules-demos/blob/master/demo06/webpack.config.js)。

>

```js
var values = require("postcss-modules-values");

module.exports = {
  entry: __dirname + "/index.js",
  output: {
    publicPath: "/",
    filename: "./bundle.js",
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["es2015", "stage-0", "react"],
        },
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader?modules!postcss-loader",
      },
    ],
  },
  postcss: [values],
};
```

接着，在[`colors.css`](https://github.com/ruanyf/css-modules-demos/blob/master/demo06/components/colors.css)里面定义变量。

>

```css
@value blue: #0c77f8;
@value red: #ff0000;
@value green: #aaf200;
```

[`App.css`](https://github.com/ruanyf/css-modules-demos/tree/master/demo06/components)可以引用这些变量。

>

```css
@value colors: "./colors.css";
@value blue, red, green from colors;

.title {
  color: red;
  background-color: blue;
}
```

运行这个示例。

>

```bash

$ npm run demo06
```

打开 `http://localhost:8080`，会[看到](https://ruanyf.github.io/css-modules-demos/demo06/)蓝色的背景上有一个红色的 `h1`。

# 实例

- 实例一

```css
/* ./index.scss */
.datePickerDropdown {
  :global {
    .ant-picker-footer {
      display: flex;
      flex-direction: row-reverse;
      justify-content: space-between;
      padding-left: 12px;
    }
  }
}
```

```css
/* ./styles */
export const extraFooterContainerCss = css`
  display: flex;
  justify-content: flex-end;
  padding: 6px 0;
`
```

```jsx
import * as styles from "./styles"; // css-in-js 把css当组件玩，问题是拿不到类名
import myStyles from "./index.scss"; // css模块化

<DatePicker
  defaultValue={value ? moment?.(value) : undefined}
  defaultOpen
  open={disabled ? false : visible}
  css={css`
    width: 100%;
  `}
  allowClear={false}
  onChange={(v) => {
    setSelfValue(v?.valueOf?.());
  }}
  dropdownClassName={myStyles.datePickerDropdown}
  renderExtraFooter={() => (
    <div css={styles.extraFooterContainerCss}>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          onChange?.(selfValue);
          setVisible(false);
        }}
      >
        确定
      </Button>
    </div>
  )}
/>;
```

# 参考链接
- [2016/6/10-原文-阮一峰-CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)