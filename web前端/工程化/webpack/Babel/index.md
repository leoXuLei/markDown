# 指南

## Babel 是什么？

> **定义：**
> Babel 是一个 JavaScript 编译器（输入源码 => 输出编译后的代码），就像其他编译器一样，编译过程分为三个阶段：解析、转换和打印输出。
> Babel 是一个工具链，==主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中==。

下面列出的是 Babel 能为你做的事情：

- 语法转换
- 通过 Polyfill 方式在目标环境中添加缺失的特性 (通过 @babel/polyfill 模块)
- 源码转换 (codemods)

> **实例：**

```js
// Babel 输入： ES2015 箭头函数
[1, 2, 3].map((n) => n + 1);

// Babel 输出： ES5 语法实现的同等功能
[1, 2, 3].map(function (n) {
  return n + 1;
});
```

## 使用指南

### 概览

本指南将想你展示如何将 ES2015+ 语法的 JavaScript 代码编译为能在当前浏览器上工作的代码。==这将涉及到新语法的转换和缺失特性的修补==。

整个配置过程包括：

- 1. 运行以下命令安装所需的包（package）：
  ```powershell
  npm install --save-dev @babel/core @babel/cli @babel/preset-env
  npm install --save @babel/polyfill
  ```
- 2. 在项目的根目录下创建一个命名为 babel.config.json 的配置文件（需要 v7.8.0 或更高版本），并将以下内容复制到此文件中：

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        },
        "useBuiltIns": "usage",
        "corejs": "3.6.5"
      }
    ]
  ]
}
```

### CLI 命令行的基本用法

你所需要的所有的 Babel 模块都是作为独立的 npm 包发布的，并且（从版本 7 开始）都是以 @babel 作为冠名的。这种模块化的设计能够让每种工具都针对特定使用情况进行设计。 下面我们着重看一下 @babel/core 和 @babel/cli。

#### 核心库

==Babel 的核心功能包含在 @babel/core 模块中==。通过以下命令安装：

```powershell
npm install --save-dev @babel/core
```

### Polyfill

从 Babel 7.4.0 版本开始，这个软件包已经不建议使用了，建议直接包含 core-js/stable （用于模拟 ECMAScript 的功能）和 regenerator-runtime/runtime （需要使用转译后的生成器函数）

@babel/polyfill 模块包含 core-js 和一个自定义的 regenerator runtime 来模拟完整的 ES2015+ 环境。

这意味着你可以使用诸如 Promise 和 WeakMap 之类的新的内置组件、 Array.from 或 Object.assign 之类的静态方法、 Array.prototype.includes 之类的实例方法以及生成器函数（generator functions）（前提是你使用了 regenerator 插件）。为了添加这些功能，polyfill 将添加到全局范围（global scope）和类似 String 这样的原生原型（native prototypes）中。

```powershell
npm install --save @babel/polyfill
// 注意，使用 --save 参数而不是 --save-dev，因为这是一个需要在你的源码之前运行的 polyfill。
```

幸运的是，我们所使用的 env preset 提供了一个 =="useBuiltIns" 参数，当此参数设置为 "usage" 时，就会加载上面所提到的最后一个优化措施，也就是只包含你所需要的 polyfill==。使用此新参数后，修改配置如下：

## 概览

### 插件

Babel 是一个编译器（输入源码 => 输出编译后的代码）。就像其他编译器一样，编译过程分为三个阶段：解析、转换和打印输出。

现在，Babel 虽然开箱即用，但是什么动作都不做。它基本上类似于 const babel = code => code; ，将代码解析之后再输出同样的代码。如果想要 Babel 做一些实际的工作，就需要为其添加插件。

除了一个一个的添加插件，你还可以以 preset 的形式启用一组插件。

### 转换插件

这些插件用于转换你的代码。

### 预设（Presets）

不想自己动手组合插件？没问题！preset 可以作为 Babel 插件的组合，甚至可以作为可以共享的 options 配置。

#### 官方 Preset

我们已经针对常用环境编写了一些 preset：

- @babel/preset-env
- @babel/preset-flow
- @babel/preset-react
- @babel/preset-typescript

# 参考链接

- [Babel 中文官网](https://www.babeljs.cn/docs/)
