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
