# 官网

- [应用开发接口 API](electronjs.org/zh/docs/latest/api/app)

# `----------------`

# Electron 中的流程

## 进程间通信

### 渲染器进程到主进程（单向）

要讲单向 IPC 消息从渲染器进程发送到主进程，可以使用`ipcRenderer.send`API 发送消息，然后使用`ipcMain.on`API 接收。

通过使用此模式从 Web 内容调用主进程 API。我们将通过创建一个简单的应用来演示此模式，可以通过编程方式更改它的窗口标题。

# Main Process 模块（主进程）

每个 Electron 应用都有一个单一的主进程，作为应用程序的入口点。主进程在 Node.js 环境中运行，这意味着它具有`require`模块和使用所有 Node.js Api 的能力。

## app

- 事件-open-file

  - 在 windows 系统中，你需要解析`process.argv`（在主进程中）来获取文件路径。

  ```js
  app.whenReady().then(() => {
    createWindow();
    console.log("process.argv", process.argv);

    /* process.argv [
      ("D:\\Users\\gitlabProjects\\fusionsite\\web-view\\node_modules\\electron\\dist\\electron.exe",
      ".")
    ]; */
  });
  ```

## BrowserWindow

### webPreferences

webPreferences Object (可选) - 网页功能设置。

preload string (可选) -在页面运行其他脚本之前预先加载指定的脚本。无论页面是否集成 Node, 此脚本都始终可以访问所有 Node API。脚本路径为文件的绝对文件路径。 当 Node 集成（node integration）关闭时, 预加载的脚本将从全局范围重新引入 node 的全局引用标志。

## WebContents

> 渲染以及控制 web 页面，是`BrowserWindow`对象的一个属性。

# Renderer Process 模块（渲染器进程）

## ipcRenderer 从渲染器进程到主进程的异步通信

# 词汇表

## 进程间通信（IPC）

- 模式

## context isolation（上下文隔离）

上下文隔离是 Electron 中的一项安全措施，可确保 预加载脚本不会将拥有优先权的 Electron 或 Node.js API 泄漏到渲染器进程中的 Web 内容。 启用上下文隔离后，从预加载脚本公开 API 的唯一方法是通过 contextBridge API。

## preload script（预加载脚本）

预加载脚本包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码。这些脚本虽运行在渲染器环境中，却因能访问`Node.js` API 而拥有了更多的权限。

预加载脚本可以在`BrowserWindow`构造方法中的`webPreferences`选项里被附加到主进程。

另请参见：渲染器进程，上下文隔离

## process

一个进程是计算机程序执行中的一个实例。 Electron 应用同时使用了 main 进程和一个或者多个 renderer 进程来运行多个程序。

在 Node.js 和 Electron 里面，每个运行的进程包含一个 process 对象。 这个对象作为一个全局的提供当前进程的相关信息和操作方法。 作为一个全局变量，它在应用内能够不用 require() 来随时取到。

## renderer process

渲染进程是应用中的浏览器窗口。 与主进程不同，渲染进程可能同时存在多个，同时，每一个渲染进程都运行与独立的进程中。 渲染进程也可以隐藏。

## webview

webview 标签页用于在您的 Electron 应用中嵌入“访客”内容（例如外部网页）。 其功能与 iframe 类似，但 webview 运行于独立的进程中。 作为页面它拥有不一样的权限并且所有的嵌入的内容和你应用之间的交互都将是异步的。 这将保证你的应用对于嵌入的内容的安全性。

# `----------------`

# 功能

## 新增获取本机 ip 地址、计算机名、操作系统版本 api，暴露给渲染进程中的应用使用

```ts
// src/index.ts :主进程
const {
  getAllIPAddresses,
  getComputerName,
  getOperateSystemVersion,
} = require("./utils");

/**
 * 获取当前计算机所有IP 注册
 */
ipcMain.handle("get-local-ip", getAllIPAddresses);

/**
 * 获取当前计算机名 注册
 */
ipcMain.handle("get-computer-name", getComputerName);

/**
 * 获取本机操作系统版本 注册
 */
ipcMain.handle("get-operate-system-version", getOperateSystemVersion);
```

# 问题

## 反馈 webView 内嵌 Chrome 版本可能存在问题

**【问题描述】**

这个版本可能存在 iframe 内存泄漏的问题，需要升级下版本验证下。

```bash
# navigator.userAgent
("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) WebView/1.0.0 Chrome/104.0.5112.124 Electron/20.3.12 Safari/537.36");
```

是这样的，我在 xx 的服务器上，vf 内置浏览器版本 104，chrome 版本是 105，两边的现象是一样的；另一个服务器 xx，vf 内置浏览器版本 104，chrome 版本 114，vf 内置的异常，chrome 打开的页面正常

**【思路】**

`webView`项目启动后，查看信息。

```bash
# navigator.userAgent
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) WebView/1.0.0 Chrome/104.0.5112.124 Electron/20.3.12 Safari/537.36'
```

尝试升级 Electron 版本。

在 Electron 官网参看 [Electron 发行版信息](https://www.electronjs.org/zh/docs/latest/tutorial/electron-timelines)。发现 chrome 版本是 112 的 Electron 版本是 `24.0.0`。

```bash
# 查询electron历史版本（只要是package.json中装过的依赖，哪怕是私有npm包都能查询到）
npm view electron versions

# 删除依赖
yarn remove electron

# 安装指定版本@24.0.0到 devDependencies
yarn add electron@24.0.0 -D
```

启动项目后，查看 chrome 版本信息。

```bash
# navigator.userAgent
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) WebView/1.0.0 Chrome/112.0.5615.49 Electron/24.0.0 Safari/537.36'
```

**【后续】**

FB: 刚验证过 112 的版本没问题了

## Electron 应用`键盘组合快捷键`打不开开发者工具

**【问题描述】**

本机本地快捷键`ctrl+shift+i`能够正常打开开发者工具。但是在 A5 某台机器却怎么都打不开，输入快捷键没有反应。同样情况其它人也反应过一次。

**【解决思路】**

- 思路一：实现方式从`globalShortcut.register('ctrl+shift+i', {})`改为键盘监听事件`keydown`。

下面是`globalShortcut.register`的实现，是在主进程中。

```js
// 之前版本
// src/index.js
const registerShortcut = () => {
  globalShortcut.register("ctrl+r", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win?.webContents?.reload();
    }
  });
  globalShortcut.register("ctrl+shift+i", () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win?.webContents?.openDevTools({ mode: "detach" });
    }
  });
};

const createWindow = () => {
  console.log(param);
  const win = new BrowserWindow({
    //  xxx
  });

  // 注册快捷键
  registerShortcut();

  win
    .loadURL(param.url)
    .then((r) => {
      console.info("loader url success, URL:", param.url);
    })
    .catch((e) => {
      console.log("load URL failed, error:", e);
    });

  ipcMain.on("window-close", function () {
    win.close();
  });
};
```

下面是键盘监听事件`keydown`的实现，是先在预加载脚本中监听，然后触发主进程中的回调。

```js
// src/preload.js

// 添加打开开发者工具的 组合快捷键：ctrl + shift + b
const addOpenDevToolsShortcutEvent = () => {
  document.addEventListener(
    "keydown",
    function (event) {
      if (
        event.ctrlKey === true &&
        event.shiftKey === true &&
        (event.key === "b" || event.keyCode === 66)
      ) {
        event.preventDefault();
        // 监听到组合快捷键后，发送消息到主进程
        ipcRenderer.send("open-dev-tools");
      }
    },
    false
  );
};

window.addEventListener("DOMContentLoaded", () => {
  addOpenDevToolsShortcutEvent();
  createCloseBtn();
  disableConsoleAndErrorCatch();
});
```

```js
// src/index.js

const createWindow = () => {
  console.log(param);
  const win = new BrowserWindow({
    //  xxx
  });

  // 注册快捷键
  registerShortcut();

  win
    .loadURL(param.url)
    .then((r) => {
      console.info("loader url success, URL:", param.url);
    })
    .catch((e) => {
      console.log("load URL failed, error:", e);
    });

  ipcMain.on("window-close", function () {
    win.close();
  });

  // 主进程接收消息并处理
  ipcMain.on("open-dev-tools", function () {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win?.webContents?.openDevTools({ mode: "detach" });
    }
  });
};
```

问题：修改后的版本，在 19 楼虚拟机 webview 长期测试环境中，测试过是能正常打开开发者工具的。但是第二天再次打开开发者工具却失败了。试过十几次才能成功一次。

- 思路二：键盘监听事件`keydown`中的组合快捷键从`ctrl+shift+b`改为`ctrl+alt+b`。

```js
// 添加打开开发者工具的 组合快捷键：ctrl + alt + b
const addOpenDevToolsShortcutEvent = () => {
  document.addEventListener(
    "keydown",
    function (event) {
      if (
        event.ctrlKey === true &&
        event.altKey === true &&
        (event.key === "b" || event.keyCode === 66)
      ) {
        event.preventDefault();
        ipcRenderer.send("open-dev-tools");
      }
    },
    false
  );
};
```

问题：测试过更容易触发打开开发者工具了，但是还是会偶现打不开。

- 思路三：打不开时，切换搜狗输入法为美式键盘能偶然打开。
- 思路四：输入快捷键之前， 先鼠标点击一下页面顶部的文案。

经测试，目前每次都能正常快速打开开发者工具了。

# Tips

## `electron` 中重写 `windows` 方法

- 方法一：`webContents.executeJavaScript`执行 JS 脚本，
  - 结果：【失败，依然有 Promise.reject 抛出的错误和 throw 出的 Error】

```tsx
const win = new BrowserWindow({});

win.webContents.executeJavaScript(`
      window.addEventListener('unhandledrejection', (event) => {
         console.info('Unhandled Promise Rejection:1111', event);
         event?.preventDefault?.();
      });

      window.addEventListener('error', (event) => {
        event?.preventDefault?.();
     });


      const consoleProxy = new Proxy(console, {
        get: function(target, prop) {
          if (typeof target[prop] === 'function') {
            return () => {};
          } else {
            return target[prop];
          }
        }
      });
      
      // 代理 console.error 方法
      Reflect.defineProperty(console, 'error', {
        value: consoleProxy.log.bind(consoleProxy),
        writable: true,
        enumerable: true,
        configurable: true
      });

      Reflect.defineProperty(console, 'warn', {
        value: consoleProxy.log.bind(consoleProxy),
        writable: true,
        enumerable: true,
        configurable: true
      });

      Reflect.defineProperty(console, 'log', {
        value: consoleProxy.log.bind(consoleProxy),
        writable: true,
        enumerable: true,
        configurable: true
      });
    `);
```

- 方法二：方法一的代码放在预加载脚本`preload.js`中的`window.addEventListener("DOMContentLoaded", () => {})`函数中。

  - 结果：【失败，依然有 Promise.reject 抛出的错误和 throw 出的 Error】

- 方法三：预加载脚本`preload.js`中，通过添加`script`脚本来执行 JS 脚本

```jsx
// 禁用console 和 捕获Error
const disableConsoleAndErrorCatch = () => {
  const logDisable = localStorage.getItem("log-disable") || "true";

  if (logDisable === "true") {
    const _scriptElement = document.createElement("script");
    _scriptElement.textContent = `
      console.log = () => { console.clear(); };
      console.error = () => { console.clear(); };
      console.warn = () => { console.clear(); };
      window.addEventListener('error', function(event) { event?.preventDefault?.(); console.clear(); });
      window.addEventListener('unhandledrejection', function(event) { event?.preventDefault?.(); console.clear();});
    `;
    _scriptElement.type = "text/javascript";
    _scriptElement.charset = "utf-8";
    document.head.appendChild(_scriptElement);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  disableConsoleAndErrorCatch();
});
```

## `electron` 打包出的 exe 可执行文件如何修改`公司`列

**【描述】**

`electron` 打包出的 exe 可执行文件，在`资源管理器`中查看，选择`公司`列后，发现 exe 可执行文件的`公司`列的值是`GitHub, Inc.`，应该是默认值。

**【需求】**

如何修改 exe 可执行文件的`公司`列的值呢？

**【思路】**

查看`webview`项目打包出的 exe 可执行文件，发现其 exe 可执行文件的`公司`列的值是`deng liu`，项目中搜索发现`package.json`中有：`"author": "deng liu",`。

**【结果】**

所以也在 700neo 项目的`package.json`中，添加`author`字段，测试发现果然成功，exe 可执行文件的`公司`列的值变成了`author`字段的值。

## `electron`项目中`package.json` 文件中`asar`配置

**【描述】**

在 `Electron` 项目中，`package.json` 文件被用于配置应用程序的各种设置。其中一个设置是 `asar`（也称为 `"Atom-Shell Archive"`），**它用于将应用程序的源代码、资源文件和依赖项打包成一个单独的压缩文件**。

`asar` 的**目的是加快应用程序的启动速度和加载速度，并减少应用程序占用的磁盘空间。它将所有源代码和资源文件打包成一个只读的文件系统，允许 Electron 在启动时一次性加载所有内容，减少磁盘读取次数**。

通过使用 `asar`，开发人员可以将源代码和资源文件结构化为一个或多个 `asar` 文件，在打包应用程序时可以选择只包括必要的文件，减少了发布的应用程序的大小。

在 `package.json` 文件中，`asr` 的配置选项使用 "`asar`" 键进行设置。例如，可以使用以下语法来配置 `asar`：
