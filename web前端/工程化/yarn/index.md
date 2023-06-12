# `yarn build`报错循环依赖

**【报错信息如下：】**
有一条信息是循环依赖，应该无关。
报错是关于`ahooks`依赖的。最近也只新增了这一个依赖。怀疑是依赖不应该放在 devDep?

```bash
Circular dependency: src\sfc\const.ts -> src\hooks\index.ts -> src\sfc\const.ts
×  error     Error: 'default' is not exported by node_modules\js-cookie\src\js.cookie.js, imported by node_modules\ahooks\es\useCookieState\index.js
    at error (D:\Users\gitlabProjects\batch-sfc\node_modules\rollup\dist\shared\rollup.js:5253:30)
    at Module.error (D:\Users\gitlabProjects\batch-sfc\node_modules\rollup\dist\shared\rollup.js:9821:16)
```

**【报错信息如下：】**
搜索报错信息搜到一个概念`peerDependencies`，尝试将`ahooks`放入其中，再次 `yarn build`，成功。

不过依然提示循环依赖。

```bash
Clean dist directory
Build cjs with rollup
Circular dependency: src\sfc\const.ts -> src\hooks\index.ts -> src\hooks\useData.tsx -> src\sfc\const.ts
Circular dependency: src\sfc\Editor\provider.tsx -> src\sfc\const.ts -> src\hooks\index.ts -> src\hooks\useData.tsx -> src\sfc\Editor\provider.tsx
Circular dependency: src\sfc\const.ts -> src\hooks\index.ts -> src\sfc\const.ts
Build cjs success entry: src/index.ts
```

# `yarn link`

**【介绍】**

`yarn link`的作用是帮助我们调试开发的 NPM 包。

因为普通项目的依赖包安装（`package.json`）是从网络下载安装的，如果要使用本地编译的 NPM 包，比较好的方式是删掉依赖包，通过快捷方式来链接我们本地的编译包。

为了简化这一流程，`yarn link`出现了，通过中间者的形式，来实现快速地 link 和 unlink。

**【使用好处】**

没有使用之前，没有办法去`webRecipeEditor`项目调试依赖包 A（即封装好的组件库项目），只能 A 修改后发版本，然后走 A 项目的 CICD，发布版本后才能在`webRecipeEditor`项目更新依赖版本号，来使用最新的包 A。此过程繁琐、耗时（提交、发版、CICD 下来起码 0.5H）、不方便。

使用`yarn link`后，包 A 不需要发版，本地打包`yarn build`后，`webRecipeEditor`项目重载一下项目、重新编译即可。调试验证新功能方便快捷（打包、重载、编译 5min 就能完成）。

**【使用方法】**

- 在包 A（即封装好的组件库项目）中执行`yarn link`
- 在包 A 中进行功能开发
- 执行打包命令 `yarn build`
- 在项目 B 中执行 `yarn link [包A的名称]`并重新执行`yarn`并清除浏览器缓存（记得把`package.json`中的 A 依赖暂时去除）
- 项目 B 中，重新加载项目，重新编译。
- 开发完成后，项目 B 要发版提测，则包 A 发版之后，项目 B 要`yarn unlink [包A的名称]`来取消连接，并`package.json`重新引入最新版本依赖 A，重新加载项目，重新编译，验证包 A 中的功能后，再提交代码。

- 使用 yarn Link 时，如果 sfc 重新 build 的时候，配方编辑器会有依赖引用报错`找不到模块“@supcon/batch-sfc”或其相应的类型声明。ts(2307)`，在 ts 文件`ctrl+P`: `> + 空格 + 选择reloadproject`

# `yarn config list` 查询 Yarn 配置信息

```tsx
yarn config v1.22.18
info yarn config
{
  'version-tag-prefix': 'v',
  'version-git-tag': true,
  'version-commit-hooks': true,
  'version-git-sign': false,
  'version-git-message': 'v%s',
  'init-version': '1.0.0',
  'init-license': 'MIT',
  'save-prefix': '^',
  'bin-links': true,
  'ignore-scripts': false,
  'ignore-optional': false,
  registry: 'http://192.168.1.131:4873',
  'strict-ssl': true,
  'user-agent': 'yarn/1.22.18 npm/? node/v14.19.1 win32 x64',
  CHROMEDRIVER_CDNURL: 'http://xxx/chromedriver/',
  ELECTRON_MIRROR: 'http://xxx/electron/',
  ELECTRON_BUILDER_BINARIES_MIRROR: 'http://xxx/electron-builder-binaries/',
  'cache-folder': 'D:\\yarn_cache'
}
info npm config
{
  registry: 'http://192.168.1.131:4873',
  ELECTRON_MIRROR: 'http://xxx/electron/',
  CHROMEDRIVER_CDNURL: 'http://xxx/chromedriver/',
  ELECTRON_BUILDER_BINARIES_MIRROR: 'http://xxx/electron-builder-binaries/',
  prefix: 'D:\\node_global',
  cache: 'D:\\node_cache'
}
Done in 0.04s.
```

# `yarn.lock`文件解析

**【ask gpt 1】**

Q: `yarn.lock` 文件中的这一段代码是什么意思？

```bash
cliui@^7.0.2:
  version "7.0.4"
  resolved "http://xxxx/repository/npm-group/cliui/-/cliui-7.0.4.tgz#a0265ee655476fc807aea9df3df8df7783808b4f"
  integrity sha512-OcRE68cOsVMXp1Yvonl/fzkQOyjLSu/8bhPDfQt0e0/Eb283TKP20Fs2MqoPsr9SwA595rRCA+QMzYc9nBP+JQ==
  dependencies:
    string-width "^4.2.0"
    strip-ansi "^6.0.0"
    wrap-ansi "^7.0.0"
```

A:

它指定了 cliui 模块及其依赖项的版本号和来源。具体来说，它包括以下几个部分：

- `cliui@^7.0.2`：这表示该项目依赖于 cliui 模块，并要求使用符合 ^7.0.2 版本范围内的任何版本。

- `version`："7.0.4" 和 `resolved`：这两个条目表示实际安装的版本为 7.0.4，并且该模块是从 `http://xxx/repository/npm-group/cliui/-/cliui-7.0.4.tgz` 下载的。

- `dependencies` 部分指定了 cliui 模块的三个依赖项及其对应的版本范围：
  - `string-width "^4.2.0"`：表示需要使用符合 ^4.2.0 版本范围内的任何版本的 string-width 模块。
  - `strip-ansi "^6.0.0"`：表示需要使用符合 ^6.0.0 版本范围内的任何版本的 strip-ansi 模块。
  - `wrap-ansi "^7.0.0"`：表示需要使用符合 ^7.0.0 版本范围内的任何版本的 wrap-ansi 模块。

**【ask gpt2】**
Q: yarn.lock 文件中的这一段代码是什么意思？

```bash
dependencies:
    string-width "^5.1.2"
    string-width-cjs "npm:string-width@^4.2.0"
    strip-ansi "^7.0.1"
    strip-ansi-cjs "npm:strip-ansi@^6.0.1"
    wrap-ansi "^8.1.0"
    wrap-ansi-cjs "npm:wrap-ansi@^7.0.0"
```

A:

它指定了项目所依赖的几个模块以及它们的版本号和来源。具体来说，它包括以下几个部分：

# `.yarnrc`文件

**【ask Gpt】**

A: `.yarnrc` 文件是干嘛的

Q:
`.yarnrc` 文件是一个 Yarn 配置文件，用于在特定项目中设置该项目的 Yarn 行为。该文件位于项目根目录下，可以包含多个 Yarn 配置选项，如 `registry`(yarn 代理)、`npmClient`、`ignore-scripts` 等。当运行 yarn 命令时，Yarn 将首先查找当前工作目录中是否存在.yarnrc 文件，并将其中的配置应用于当前项目。

通过`.yarnrc` 文件，用户可以轻松地自定义项目的 Yarn 环境，**比如更改 registry 地址、设置 cache 和禁用 scripts 等。这对于在不同项目中使用不同的 Yarn 配置非常有用**，例如当需要在某个项目中使用私有 NPM registry 或本地缓存时。

**【实际设置后】**
webRecipeEditor 本来的`yarn config.registry`是 `http://192.168.1.131:4873`。

在`D:\Users\gitlabProjects\fusionsite\web-view>`项目执行命令`yarn config set registry http://192.168.25.57:8081/repository/npm-group`设置后。

然后在`D:\Users\gitlabProjects\vxbatch_recipeeditor>`下`yarn config list`查询，发现代理不变`registry: http://192.168.1.131:4873`，即跟`.yarnrc`配置的一样。

接着在`D:\Users\gitlabProjects>`查询，发现不变`registry: http://192.168.25.57:8081/repository/npm-group`。

综上：`yarn config.registry`设置后，对于没有单独设置的项目，会生效。对于已经设置过了`.yarnrc`有`registry`属性的，就不会生效。
