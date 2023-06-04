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
