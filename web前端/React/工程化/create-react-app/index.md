# 开发依赖库

## Antd

**安装：**

```powerShell
npm i antd -S
```

**基础使用：** 引入 antd 组件全部样式

修改 `src/App.js`，引入 antd 的按钮组件。

```TS
import React from 'react';
import { Button } from 'antd';
import './App.css';

const App = () => (
  <div className="App">
    <Button type="primary">Button</Button>
  </div>
);

export default App;
```

修改 src/App.css，在文件顶部引入 antd/dist/antd.css

```TS
@import '~antd/dist/antd.css';
.App {
text-align: center;
}
```

看 antd 组件文档使用 API

**高级配置：** 配置 antd 按需加载

使用 `babel-plugin-import`

> babel-plugin-import: 是**一个用于按需加载组件代码和样式的 babel 插件**（[原理](https://3x.ant.design/docs/react/getting-started-cn#%E6%8C%89%E9%9C%80%E5%8A%A0%E8%BD%BD))

安装：

```bash
npm install babel-plugin-import  -D  // 安装babel-plugin-import
```

使用配置：

```js
// .babelrc
{
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "libraryDirectory": "es",
        "style": "css" // `style: true` 会加载 less 文件
      }
    ]
  ]
}

```

然后只需从 antd 引入模块即可，无需单独引入样式。`babel-plugin-import` 会帮助你加载 JS 和 CSS

参考：

- [react 项目如何按需加载 antdDesign 组件](https://blog.csdn.net/qq_24147051/article/details/88318895)


## 添加 TS

要使用 TypeScript 启动新的 Create React App 项目，你可以运行：

```bash
$ npx create-react-app my-app --typescript
$ # 或者
$ yarn create react-app my-app --typescript
```

要将 TypeScript 添加到 Create React App 项目，请先安装它：

```bash
$ npm install --save typescript @types/node @types/react @types/react-dom @types/jest
$ # 或者
$ yarn add typescript @types/node @types/react @types/react-dom @types/jest
```

## 参考

- [Create React App 中文文档](https://www.html.cn/create-react-app/)
- [从零开始使用 react+antd 搭建项目](https://www.cnblogs.com/marvey/p/13127271.html)
- [react-项目搭建(dva+antd)](https://segmentfault.com/a/1190000016606938)
