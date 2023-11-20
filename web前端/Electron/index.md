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
