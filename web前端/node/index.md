# Node

```bash
# 查看node安装路径
which node

# 显示版本，检查npm 是否正确安装。
npm -v

```

## process.env

**【ask gpt】**

Q: 下面这行代码是干嘛的？

```tsx
const { NODE_ENV } = process.env;
```

A:

这行代码是将 Node.js 进程环境变量 process.env 中的 NODE_ENV 属性解构出来，并将其赋值给常量 NODE_ENV。在 Node.js 中，process.env 对象包含了所有的进程环境变量，例如操作系统类型、当前用户、路径等信息。而 NODE_ENV 环境变量通常用于指定应用程序的运行环境，例如 "development"（开发环境）、"production"（生产环境）或者 "test"（测试环境）。在应用程序中，可以根据不同的 NODE_ENV 值来加载不同的配置文件、执行不同的逻辑等，以实现不同环境下的运行效果。

## nodejs 如何升级版本

**方法一：用 n 升级 nodejs** （测试了没成功）

```bash
# 全局安装n
$ npm install -g n

# 升级到最新稳定版
$ n stable

# 升级到最新版
$ n latest

# 升级到定制版
$ n v7.10.0

# 切换使用版本
$ n 7.10.0 (ENTER)

# 删除指定版本
$ n rm 7.10.0

# 用指定的版本执行脚本
$ n use 7.10.0 some.js
```

输入`n stable`报错，查询 n 的版本也是如下报错。

```bash
PS C:\Windows\system32> n -version

& : 无法将“bash.exe”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保 路径正确
，然后再试一次。
所在位置 C:\Users\XL\AppData\Roaming\npm\n.ps1:15 字符: 5
+   & "bash$exe"  "$basedir/node_modules/n/bin/n" $args
+     ~~~~~~~~~~
    + CategoryInfo          : ObjectNotFound: (bash.exe:String) [], CommandNotFoundException
    + FullyQualifiedErrorId : CommandNotFoundException
```

```bash
PS C:\Windows\system32> Get-ExecutionPolicy -List

        Scope ExecutionPolicy
        ----- ---------------
MachinePolicy       Undefined
   UserPolicy       Undefined
      Process       Undefined
  CurrentUser       Undefined
 LocalMachine    RemoteSigned
```

```bash
PS C:\Windows\system32> Set-ExecutionPolicy RemoteSigned -Scope CurrentUser

执行策略更改
执行策略可帮助你防止执行不信任的脚本。更改执行策略可能会产生安全风险，如
https:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies 帮助主题所述。是否要更改执行策略?
[Y] 是(Y)  [A] 全是(A)  [N] 否(N)  [L] 全否(L)  [S] 暂停(S)  [?] 帮助 (默认值为“N”): Y
```

重启后再次查询如下。重新试之前的 n 相关命令还是一样报错没变化。

```bash
PS C:\Windows\system32> Get-ExecutionPolicy -List

        Scope ExecutionPolicy
        ----- ---------------
MachinePolicy       Undefined
   UserPolicy       Undefined
      Process       Undefined
  CurrentUser    RemoteSigned
 LocalMachine    RemoteSigned
```

> 参考链接

- [npm install -g n 运行错误](https://blog.csdn.net/qq_42709302/article/details/120188538)
- [无法将“XXX”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。 对这个问题的解决方法](https://blog.csdn.net/sxeric/article/details/122403591)

**方法二：用 nvm 来管理 nodejs 版本**

```bash
# v14.15.3  2022/07/04之前都是这个版本，然后准备用nvm管理node版本

# 删除本机的node（应该看下`C:\Program Files\nodejs\node_modules`里面全局安装的依赖的）

# 下载的是nvm链接里面的`nvm-setup.exe`:4.63M

# 验证nvm是否安装成功
PS C:\Windows\system32> nvm -v

Running version 1.1.9.


# nvm安装node最新稳定版v16.15.1

PS C:\Windows\system32> nvm install 16.15.1
Downloading node.js version 16.15.1 (64-bit)...
Extracting...
Complete


Installation complete. If you want to use this version, type

nvm use 16.15.1

# nvm使用指定版本node
PS C:\Windows\system32> nvm use 16.15.1
Now using node v16.15.1 (64-bit)
PS C:\Windows\system32> node -v
v16.15.1

# npm 全局安装yarn
PS C:\Windows\system32> npm i yarn -g
PS C:\Windows\system32> yarn -v
1.22.19

# npm 全局安装clean-mark 也测试成功了
```

# 工具

## nvm：Node 的版本管理工具

**简介:** Node 的版本管理工具

> 背景：我们可能同时在进行多个个项目，而多个不同的项目所使用的 node 版本又是不一样的，或者是要用更新的 node 版本进行试验和学习。这种情况下，对于**维护多个版本的 node**将会是一件非常麻烦的事情，而 nvm 就是为解决这个问题而产生的，他可以**方便的在同一台设备上进行多个 node 版本之间切换**，而这个正是 nvm 的价值所在，详情可以查看官网 NVM 官网。

**安装:**

1. 下载 nvm
   如果已经单独安装了 node，建议卸载，然后继续向下看。直接进入[安装包下载地址](https://github.com/coreybutler/nvm-windows/releases)。选择 nvm-setup.zip，下载后直接安装。

2. 配置环境变量
   正常安装完毕，环境变量无需配置，可以进行查看，如果没有自动配置成功，需要手动进行配置。

3. 验证是否安装成功
   执行`nvm -v`，出现下图提示说明安装成功
   &emsp;&emsp; ![nvm_v](./imgs/nvm_v.png)

**使用:**

```js
nvm list/ls     // 本机中所有的node的版本列表
nvm install latest  // 安装最新版本
nvm install 4.8.4  // 安装指定版本node
nvm use 10.8.0  // 使用指定node版本

nvm list available // nvm 查询可安装的 Node 版本
```

![nvmInstallExample](./imgs/nvmInstallExample.png)

**参考:**

- [nvm，nrm 介绍及使用](https://www.jianshu.com/p/ab63d08cced4)
- [教你如何使用 nvm](https://www.jianshu.com/p/f8e175403dfb)

# 概念

## 设置 NPM 镜像源

```bash
Usage:
  npm config set <key> <value>
  npm config get [<key>]
  npm config delete <key>
  npm config list [--json]
  npm config edit
  npm set <key> <value>
  npm get [<key>]
```

```bash
npm config set registry http://xx.xx.xx.xx:8888/repository/npm-group

/npm i -g yarn// 以上是安装yarn

yarn config set registry http://xx.xx.xx.xx:8888/repository/npm-group
```

## UMD:通用模块定义

**【ask chatGpt】**

【Q: UMD 是什么意思】

A:

"UMD" 是 "Universal Module Definition" 的缩写，**通常翻译为 "通用模块定义"。它是一种 JavaScript 模块规范，旨在使模块能够在多个环境中运行，包括浏览器、Node.js 和 AMD (Asynchronous Module Definition)等模块加载器**。

UMD 模块定义**允许开发者编写可以在不同的 JavaScript 环境中使用的代码，并且可以在 CommonJS、AMD 和全局变量（global）等多种模块系统中使用**。这种灵活性使 UMD 成为一种流行的模块规范之一，特别适用于需要同时支持浏览器和 Node.js 等环境的项目。

【Q: react 项目中，UMD 是什么意思】

A:

UMD 模块既可以作为 CommonJS 模块（使用 require()），也可以作为 AMD 模块（使用 define()）来加载，还可以通过 script 标签在浏览器中直接引入。这使得 UMD 成为编写可移植性高的 JavaScript 库和组件的一种常见方式。在 React 中，许多库和插件都采用了 UMD 规范进行打包和发布。


## CommonJS 和 ES6

在 Node.js 中，有两种常见的模块系统：CommonJS 和 ES6。两者的区别在于模块定义和引入方式不同，在使用时需要注意兼容性。


strip-ansi 和 strip-ansi-cjs 是两个不同的 npm 依赖包，它们的区别在于：

- strip-ansi：
    使用 ES6 模块系统（即使用 import/export 语法）。在 package.json 文件中设置 "type": "module"。

- strip-ansi-cjs：
    使用 CommonJS 模块系统（即使用 require/module.exports 语法）。在 package.json 文件中没有设置 "type" 字段，因此默认使用 CommonJS 模块系统。

# 问题

## 1.nvm install 失败

报错：`Could not retrieve https://nodejs.org/dist/latest/SHASUMS256.txt.`

&emsp;&emsp;![nvmInstallError](./imgs/nvmInstallError.png)

解决方法：

1. 在 nvm 安装目录(找不到可通过环境变量)下找到`settings.txt`，打开在最后添加下面内容：
   ```js
   node_mirror:npm.taobao.org/mirrors/node/
   npm_mirror:npm.taobao.org/mirrors/npm/yarnInstallError
   ```
   &emsp;&emsp;![nvmInstallDir](./imgs/nvmInstallDir.png)
   ![nvmDirSetting_txt](./imgs/nvmDirSetting_txt.png)

参考资料：[使用 nvm-windows 安装 NodeJs 遇到的问题](https://blog.csdn.net/lisa2017_/article/details/107105016)

## 2.npm i yarn -g 失败

&emsp;&emsp;![npmYarnError](./imgs/npmYarnError.png)

解决方法：网络改成手机热点

> **mac 上同样报错如下**

- 报错：`npm WARN checkPermissions Missing write access to /usr/local/lib/node_modules`
- 解决方法： 命令前加上`sudo`

## 3.报错：无法加载文件 xxxx，因为在此系统上禁止运行脚本

报错：`无法加载文件 C:\Program Files\nodejs\npm.ps1，因为在此系统上禁止运行脚本。`

原因：现用执行策略是 Restricted（默认设置）

> 发现是在计算机上启动 Windows PowerShell 时，执行策略很可能是 Restricted（默认设置）。
> Restricted 执行策略不允许任何脚本运行。
> AllSigned 和 RemoteSigned 执行策略可防止 Windows PowerShell 运行没有数字签名的脚本。

> 为什么要弄这么一个执行策略呢，**因为 powershell 能做的事情太多了，为了避免一些恶意脚本直接运行，一般家用的 windows 系统默认将执行策略设置成了“Restricted”，即受限制的**

![报错-无法加载文件](./imgs/报错-无法加载文件.png)
![yarn_vError](./imgs/yarn_vError.png)

解决方法：

1. 以管理员身份运行 PowerShell
2. 执行：get-ExecutionPolicy，回复 Restricted，表示状态是禁止的
3. 执行：set-ExecutionPolicy RemoteSigned 即可，更改执行策略

   注意：一定要以管理员的身份运行 PowerShell，不是 cmd 窗口！

```bash
set-executionpolicy remotesigned # 输入y同意
```

**问题：** win

**参考：**

- [Powershell 执行策略限制相关](https://www.cnblogs.com/luckyuns/p/12851317.html)
- [无法加载文件 xxxx，因为在此系统上禁止运行脚本](https://blog.csdn.net/mehnr/article/details/104497019/)

## 4.yarn install 失败

报错：Fetching packages...`Three appears to be trouble with your network connection, Retrying...`
&emsp;&emsp;![yarnInstallError](./imgs/yarnInstallError.png)

解决方法：网络由手机热点改成网线/wifi

## 5.tyarn start 报错

```bash
tyarn start
   $ yarn run v1.22.4
   $ yarn check-env && yarn dev
   $ env-doctor check
   'env-doctor' 不是内部或外部命令，也不是可运行的程序
```

解决方法：先 tyarn 一下就好了

## 6.后端本地联调时 ping 不通

可能是防火墙未关闭

# 实战

## 开发环境搭建-安装指定版本Node
1. 先在`应用与程序`卸载本机直接用安装包安装的`node.js`应用。然后`node_nvm`安装包文件夹，安装nvm，因为同级的`settings`中设置了`root`和`path`，其中`root`是D盘nvm目录下，所以安装路径选择（`安装程序将把NVM for Windows安装到以下文件夹。要继续，请点击“下一步”。如果您想选择其他文件夹，请点击“浏览”。`）要选择`D:\nvm`。
```bash
node_nvm
---- .npmrc
---- .yarnrc
---- nvm-setup
---- settings
```

```bash
# node_nvm/settings  安装前保留最后两行即可，前面的删除


# root: D:\NVM\nvm
# arch: 64
# proxy: none
# originalpath: .
# originalversion: 

# 下面是设置安装node和npm的镜像地址
node_mirror: http://10.10.23.14:6007/node/
npm_mirror: http://10.10.23.14:6007/npm/

```


第二路径选择的是`Node.js`路径，默认是`C:\Program Files\nodejs`，也可以换成`D:\nodejs`。
```bash
# 安装过程第二个路径选择如下

Set Node.js symlink。
  The active version of Node.js will always be available here. 
  
Select the floder in which Setup should create the symlink, then click Next. The directory will automatically be added to your system path

# 设置Node.js符号链接。活动版本的Node.js将始终在此处可用。选择应在其中创建符号链接的文件夹，然后点击“下一步”。该目录将自动添加到您的系统路径中。
```

2. 将`192.168.22.24`机器C盘用户文件夹下的`.npmrc`和`.yarnrc`复制到`1.26`机器的C盘用户文件夹下。

3. 全局安装`yarn`

```bash
npm i yarn@1.22.18 -g
```

### 全局安装`yarn`成功，但是没法使用yarn相关命令

1. 安装指定版本的yarn，且是指定版本安装。
```bash
> npm install yarn@1.22.18 -g

> yarn@1.22.18 preinstall D:\node_global\node_modules\yarn
> :; (node ./preinstall.js > /dev/null 2>&1 || true)

D:\node_global\yarn -> D:\node_global\node_modules\yarn\bin\yarn.js
D:\node_global\yarnpkg -> D:\node_global\node_modules\yarn\bin\yarn.js
+ yarn@1.22.18
added 1 package in 0.528s
```

2. 安装完成后查询yarn版本提示如下，是没有正确设置系统环境变量导致的。
   解决方法：`控制面板\系统和安全\系统-更改设置\高级-环境变量-系统变量`。选中`Path`编辑，添加`D:\node_global`。（通过与`22.24`机器的系统变量比较发现少了`D:\node_global`）。
```bash
> yarn -v 

yarn : 无法将“yarn”项识别为 cmdlet、函数、脚本文件或可运行程序的名称。请检查名称的拼写，如果包括路径，请确保路径正确，然后再试一次。
所在位置 行:1 字符: 1
```

3. 添加系统环境变量后，再次查询yarn版本提示如下，老问题了，是`执行策略`的问题，照着之前解决即可。
```bash
> yarn -v 
yarn : 无法加载文件 D:\node_global\yarn.ps1，因为在此系统上禁止运行脚本
# 再次查询版本，提示在系统上禁止运行脚本，这个问题之前遇到过。
```

4.  再次查询yarn版本，成功。

```bash
> yarn -v 
1.22.18
```
# 依赖

## Single-spa

**【ask chatGpt】**

【Q：前端中的 Single-Spa 是什么】

A：

Single-spa 是一个用于构建前端微服务应用程序的 JavaScript 框架。**它允许开发者将不同的前端应用程序（如 React、Angular、Vue 等）集成到一个单独的页面中，实现多个应用程序之间的无缝切换和通信**。

Single-spa 的核心思想是利用浏览器自带的路由机制来实现前端微服务的跨应用共享状态、组件复用和协同开发。Single-spa 支持使用不同的框架编写应用程序，并提供了统一的生命周期、通信和错误处理机制，使得开发者可以更轻松地创建可扩展、易维护的微服务应用程序。

Single-spa 还提供了丰富的插件和工具库，用于简化前端应用程序的打包、部署和测试等工作。它能够很好地支持现代化的前端开发流程，并在多个行业和领域广泛应用。

【Q：react 项目中的 Single-Spa 是什么意思】

A：

Single-Spa 是一个 JavaScript 微前端框架，可以让你在同一个页面中集成多个子应用程序（如 React、Angular、Vue 等），并实现它们之间的协调和通信。使用 Single-Spa，你可以将各个子应用独立开发、独立部署，并且可以在不重新加载整个页面的情况下动态地添加、卸载或切换它们。Single-Spa 通过路由匹配和生命周期钩子等机制，能够自动管理子应用之间的依赖关系、初始化顺序、状态共享等问题，大大简化了微前端的开发和维护工作。Single-Spa 可以与各种主流框架和构建工具集成，包括 React、Angular、Vue、Webpack、Rollup 等。

# 参考链接

- [nodejs 官网](https://nodejs.cn/)
- [包管理 NPM 官网链接-查询依赖说明/用法/仓库地址/介绍主页](https://www.npmjs.com/package/typescript)
- [七天学会NodeJS是阿里巴巴国际站前端技术部编写的开源文档，用于学习 Node.js。](https://www.w3cschool.cn/nodejsguide/3c8i1nfw.html)
