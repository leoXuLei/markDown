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

# `yarn cache clean` 清理 yarn 的缓存

yarn cache clean 是一个命令，用于清理 yarn 的缓存。**Yarn 缓存是默认情况下将下载的软件包存储在本地计算机上的目录中，以便在后续安装相同版本的软件包时可以快速从缓存中获取，而无需重新下载**。

**yarn cache clean 命令会删除 Yarn 缓存中的所有软件包文件，这样可以确保之后的安装过程中重新下载软件包。它有助于解决一些与缓存相关的问题，如完整性校验失败或缓存损坏等**。

当你遇到依赖安装或完整性校验错误时，运行 yarn cache clean 可能是一个解决问题的常见步骤。它会快速清理缓存并强制重新下载所需的软件包，以确保安装过程的正确性。

请注意，运行 yarn cache clean 不会影响你的项目或依赖关系的其他方面，它只会清理缓存。

# `yarn --update-checksums` 更新依赖包的校验和

`yarn --update-checksums` 是一个 Yarn 命令，用于更新依赖包的校验和（checksums）。在 Yarn 中，每个依赖包都有一个与之关联的校验和值，用于验证下载的软件包是否完整、未被篡改。

运行 `yarn --update-checksums` 命令**将重新计算项目中所有依赖包的校验和，并将新的校验和值更新到 yarn.lock 文件中**。这可以解决一些与依赖完整性相关的问题，例如当依赖包的源发生变化或校验和不匹配时可能出现的错误。

在执行此命令之前，请确保你的项目已经安装了所有依赖包。注意，运行 `yarn --update-checksums` 可能会需要较长的时间，因为它需要重新计算和更新所有依赖包的校验和，并且可能会触发网络资源的下载。

总结来说，`yarn --update-checksums` 命令用于更新项目中所有依赖包的校验和，以确保它们与当前使用的源和版本相匹配。**这是一种解决与校验和相关的问题的常见方法**。

# 配置文件

## `yarn.lock`文件解析

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

## `.yarnrc`文件

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

# 依赖

## （1）使用没有直接通过`package.json`引入的依赖会怎样

**【描述】**

700neo 项目，`lodash` 在`yarn.lock`中能搜到很多，在某些依赖的`dependencies`中能看到，但是该依赖没有在`package.json`中直接引入。

**【疑问一：如何按需引入依赖中某个方法】**

业务中也没有使用到 `lodash` 过，如何按需只引入`lodash`中的一个方法，如下。

```tsx
const _omit = require("lodash/omit");
```

**【疑问二：没有直接通过`package.json`引入的依赖会进生产环境包嘛？】**

由于 `lodash` 没有在`package.json`中引入，担心生产环境会报错找不到该 api。

结果：在 render 中打印该方法，然后`yarn packager`进行 Electron 打包，直接打开打包后的`index.html`。发现能打印出该 api，是个函数，测试该函数，功能也是正常的。

# 问题

## （1）yarn 报错：`Integrity check failed for "依赖名"`

```bash
yarn add webpack-bundle-analyzer -D
```

**【报错如下】**：

```bash
error http://192.168.xx.xx:8081/repository/npm-group/@supcon/supcond2/-/supcond2-2.1.4.tgz: Integrity check failed for "@supcon/supcond2" (computed integrity doesn't match our records, got "sha512-kFrlMCBLE9D9Q8MJh5CqLEC503BE1XdIhxP6R+CmKZQsNJSIlBpk+/aC+NOXoa5OOdIdmvXIs+1nUxTQ9EJ3Jg== sha1-Mqtjestva9j4GlFizmeOMeUkkx0=")
```

**【Ask GPT】**：

A:
该错误表示在使用 yarn 安装依赖时，发生了完整性校验（Integrity check）失败的情况。**完整性校验用于确保从镜像或缓存中下载的软件包与预期的完整性匹配**。

这种错误通常是由于网络问题、缓存不一致或软件包被篡改所导致的。为了解决此问题，你可以尝试以下几个步骤：

- 1. 清除 yarn 缓存：yarn cache clean
- 2. 删除 node_modules 目录
- 3. 锁定版本：如果你的项目中使用了 package-lock.json 文件，可以尝试删除该文件，然后重新安装依赖包：`rm package-lock.json & yarn install`
- 4. 检查网络连接：确保你的网络连接正常，并且可以访问 `http://192.168.xx.xx:8081/repository/npm-group/@supcon/supcond2/-/supcond2-2.1.4.tgz` 文件。

如果上述步骤无法解决问题，你可能需要考虑联系依赖包的维护者，以了解是否存在与完整性相关的问题。

另外，还可以尝试使用 npm 进行安装，因为 npm 和 yarn 在依赖管理方面有所不同，可能可以避免这种完整性校验错误。

**【尝试解决】**：

- 方式一：尝试清除 yarn 缓存：`yarn cache clean`
  然后重新 yarn。结果：yarn 过程依然报相同错误。

- 方式二：更新依赖包的校验和 `yarn --update-checksums`（成功解决）
  结果：1.26 机器 trend 项目成功 yarn 并可以正常启动。

**【参考链接】**：

- [yarn 安装依赖时出现错误（2 种解决方法）Integrity check failed for “antd“ computed integrity doesn‘t match our records）](https://blog.csdn.net/weixin_42182676/article/details/125758278)

## （2）安装依赖时报错`warning package-lock.json found`

**【报错如下】**：

```bash
warning package-lock.json found. Your project contains lock files generated by tools other than Yarn. It is advised not to mix package managers in order to avoid resolution inconsistencies caused by unsynchronized lock files. To clear this warning, remove package-lock.json.
```

**【ask gpt 】**

Q: React 项目中报错信息如下：？

A：

这个警告信息告诉你，**在你的 React 项目中，package-lock.json 文件被发现了。而你当前使用的是 Yarn 包管理器。项目中同时存在 package-lock.json 和 yarn.lock 文件可能会引起包解析的不一致。因此建议不要混用不同的包管理工具**（npm 和 Yarn）。

- 解决方法：
  - 1.删除 `package-lock.json` 文件：如果你决定使用 Yarn 作为你的包管理器，那么你应该删除 `package-lock.json` 文件，以确保不会与 Yarn 产生冲突。命令行：`rm package-lock.json`。
  - 2.确保使用 Yarn 安装依赖：如果你已经删除了 `package-lock.json` 文件，请确保你使用 Yarn 来安装项目依赖。如：`yarn add immer -S`

**【解决方法】**：

- 删除 `package-lock.json` 文件后，报错信息消失。

## （3）yarn 时卡在第一步`[1/4] Resolving packages...`不动了

**【报错如下】**：

且下一行一直是`"ahooks": "^3.7.7"`，并且一直在转圈。

```bash
PS E:\project\leoXuLei\react-demo> yarn
yarn install v1.22.19
[1/4] Resolving packages...
\"ahooks": "^3.7.7"
```

**【尝试解决】**：

- `yanr cache clean` 清理 yarn 的缓存。

**【验证】**：

- 睡前执行的 `yanr cache clean`命令，早上起来发现 yarn 正常了。如下。

```bash
PS E:\project\leoXuLei\react-demo> yarn
yarn install v1.22.19
[1/4] Resolving packages...
warning webpack-dev-server > webpack-dev-middleware > memfs@3.6.0: this will be v4
[2/4] Fetching packages...
[3/4] Linking dependencies...
warning "antd > rc-picker@2.5.10" has unmet peer dependency "dayjs@^1.8.30".
warning " > optimize-css-assets-webpack-plugin@5.0.4" has incorrect peer dependency "webpack@^4.0.0".
[4/4] Building fresh packages...
success Saved lockfile.
Done in 137.90s.
```

同时安装想要安装的依赖包 immer 也能正常了。

```bash
PS E:\project\leoXuLei\react-demo> yarn add immer -S
yarn add v1.22.19
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
warning "antd > rc-picker@2.5.10" has unmet peer dependency "dayjs@^1.8.30".
warning " > optimize-css-assets-webpack-plugin@5.0.4" has incorrect peer dependency "webpack@^4.0.0".
[4/4] Building fresh packages...
success Saved lockfile.
success Saved 1 new dependency.
info Direct dependencies
└─ immer@10.1.1
info All dependencies
└─ immer@10.1.1
Done in 14.86s.
```
