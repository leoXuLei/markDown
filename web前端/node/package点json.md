# script

> **【描述】**

在 `package.json` 文件中的 `scripts` 字段可以用来定义一些命令脚本。在 `scripts` 字段中，你可以定义多个键值对，每个键值对包括一个自定义的命令名称和对应要执行的命令。

```json
{
  "scripts": {
    "dev": "yarn collectInfo && webpack-dev-server --config config/webpack.dev.config.js --open",
    "collectInfo": "node infoCollecter"
  }
}
```

在这个例子中，`package.json` 文件中的 `scripts` 字段中定义了一个 dev 命令。当运行 `npm run dev` 时，将会执行`"webpack-dev-server --config config/webpack.dev.config.js --open"`这个命令。

具体来说，**这个命令会启动 `webpack-dev-server` 工具，并且指定了配置文件为 `config/webpack.dev.config.js`。同时，使用`--open` 参数表示会在启动服务器之后自动打开浏览器**。这个配置通常用于开发环境中，方便开发人员进行实时调试和预览。通过定义脚本命令，可以方便地启动一些常用的工具或命令，提高开发效率。

在你提供的例子中，`scripts` 字段中定义了一个 `collectInfo` 命令，当运行该命令时，会执行`"node infoCollecter"`这个命令。**这意味着当你运行 npm run collectInfo 时，会调用 node 命令执行 infoCollecter 文件。这种配置让你可以通过简单的自定义命令来进行一些特定的操作，提高了开发过程的效率**。

# 依赖

## `webpack-dev-server`

webpack-dev-server 是一个基于 Webpack 的开发服务器工具，用于帮助开发人员在开发过程中快速调试和预览前端应用程序。webpack-dev-server 会启动一个 Node.js 服务器，用于提供静态文件服务，并支持实时自动编译和热模块替换（Hot Module Replacement，HMR）。这意味着当代码发生变化时，webpack-dev-server 会自动重新编译并刷新页面，而无需手动刷新浏览器。

webpack-dev-server 还能够提供一些其他功能，比如搭配 Source Map 进行调试、代理请求到后端 API 服务、支持 HTTPS 等。在开发过程中，webpack-dev-server 可以大大提高开发效率，帮助开发人员快速定位问题，并即时查看修改后的效果。


