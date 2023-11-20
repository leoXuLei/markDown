# SSPA 集成模式趋势中`supcond2`组件库中的组件国际化异常

## 问题描述

- 一：监控基座 web 端，

  - 刷新页面后打开趋势页，
    - 打开位号选择弹窗，弹窗中 Table 的暂无数据显示的是英文`No Data`，弹窗确认按钮文本显示的是中文（`取消` `确认`）；趋势表格底部的 `Pagination`的文本是英文。
  - 后续只要把趋势标签页 x 掉，再重新打开趋势任意弹窗，

    - 弹窗中的 Table 的暂无数据依然显示的是英文`No Data`，而弹窗确认按钮文本也变成了英文（`Cancel` `Ok`）；趋势表格底部的 `Pagination` 的文本依然是英文。趋势中的其它弹窗现象同位号选择弹窗。

  - 已知基座中打开的趋势是以`SSPA子应用（集成）模式`被打包，文件是`trend`文件夹，打包`external`掉了 `@supcon/supcond2`组件库。

- 二：经验证，趋势以独立应用模式，在`趋势弹窗`、`AI面板弹窗Tab`、`流程图`中被使用，其下各弹窗、趋势表格 `Pagination`、`DatePicker` 等的国际化都是正常的。
  - 已知趋势以`Control独立应用模式`被打包，文件是`control-shapes-trend`文件夹，打包没有 `external` 掉 `@supcon/supcond2`组件库。

## 排查思路

### 思路一

- 描述：给位号选择弹窗包裹国际化高阶组件。

  - `export default addLocale(SelectTag);`

- 结果：失败，92 中打开趋势后，打开位号选择弹窗会奔溃，页面报错。

### 思路二

- 描述：`<Modal />`组件改为`modal.confirm`并使用`contextHolder`

- 背景：`supcond2`组件库文档`Modal-FAQ`中提到：**`为什么 Modal 方法不能获取 context、redux、的内容和 ConfigProvider locale/prefixCls/theme 等配置？`**
  - 直接调用 Modal 方法，antd 会通过 ReactDOM.render 动态创建新的 React 实体。其 context 与当前代码所在 context 并不相同，因而无法获取 context 信息。
  - 当你需要 context 信息（例如 `ConfigProvider` 配置的内容）时，可以通过 `Modal.useModal` 方法会返回 modal 实体以及 `contextHolder` 节点。将其插入到你需要获取 context 位置即可：
- 结果：失败，92 中打开趋势后，打开位号选择弹窗，确认按钮文本是英文。

- 改动代码如下：

```tsx
import { Modal } from "@supcon/supcond2";

const SelectTag: React.FC<Props> = (props) => {
  const [modal, contextHolder] = Modal.useModal();

  const showModal = () => {
    modal.confirm({
      width: 960,
      icon: null,
      title: <div>{t("trend.basic.tagSetting")}</div>,
      onOk: onConfirm,
      onCancel: onCancel,
      okButtonProps: { disabled: fetchHisLoading },
      content: <TagSelectList onRef={childRef} />,
    });
  };

  React.useEffect(() => {
    if (show) {
      showModal();
    }
  }, [show]);

  return <div className={`${prefixCls}`}>{contextHolder}</div>;
};
export default SelectTag;
```

### 思路三 @

- 描述：尝试暂时注释掉 0823`趋势在集成模式下剥离supcond`功能加的`external: @supcon/supcond2`。

- 结果：**成功**，92 中打开趋势后，打开位号选择弹窗，弹窗中的 `Table` 的暂无数据显示的是中文，弹窗确认按钮文本是中文，趋势表格底部的 `Pagination` 是中文。后续把趋势标签页 x 掉，再重新打开趋势，上述的各组件文本依然是中文。

- 结论：**这个 bug 就是做 0823`趋势在集成模式下剥离supcond`功能加的`external: @supcon/supcond2`导致的**。（ps：当时做完之后只注意到 SSPA 集成模式趋势的弹窗中的暂无数据变成了英文`No Data`，感觉影响不大就没有在意。）

- 改动代码如下：

```jsx
// config\webpack.config.sspa.js

{
  resolve: {
    alias: {
      'src': paths.appSrc,
      '@': paths.appSrc,
      '@R': paths.runtime,
      '@C':paths.config,
      // '@supcon/supcond2': isSSPA ? '@ecsnext/supcond' : '@supcon/supcond2',
    }
  },
  externals: [
    'dayjs',
    // /^@supcon\/supcond2/,
    // function(ctx, callback) {
    //   if(/^@supcon\/supcond2/.test(ctx?.request)) {
    //     return callback(null, '@ecsnext/supcond');
    //   }
    //   callback();
    // }
  ]
}
```

### 思路四

- 描述：`webpack.config.sspa.js` 中恢复 0823 功能中删除的按需加载 `'@supcon/supcond2'`。

- 结果：失败，基座中打开趋势页失败，控制台报错如下：

```bash
react-dom.production.min.js:2 Error: Minified React error #130; visit https://reactjs.org/docs/error-decoder.html?invariant=130&args[]=object&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
  at Zr (react-dom.production.min.js:2)
```

### 思路五

- 描述：降级趋势的 `supcond2` 版本跟基座中的公共 `supcond2` 版本一致

- 结果：失败，同 bug 现象一样。

### 思路六 @

- 描述：查看趋势的国际化配置，查看`集成模式SSPA`能否获取到基座应用的国际化资源。
- 结果：153 通过打断点发现：**`addLocale`高阶组件（处理国际化配置）中初始化读取到的`localeCode`是`zh-CN`，第一次加载趋势和 x 掉后的后续加载，读取到的`localeCode`都是`zh-CN`**，查看代码发现`are-trend-web\src\control\runtime\indexSpa.tsx`构造函数中设置的兜底默认值就是`zh-CN`。
- 结论：**`localeCode`初始值始终是`zh-CN`，即如果有国际化资源就默认使用中文**。

```tsx
import React, { ComponentType } from "react";

function addLocale<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return function AddLocale(props: P) {
    const localeCode = useAppSelector((state) => state.basic.localeCode);

    const i18n = React.useRef<I18n>(i18nConfig());

    React.useEffect(() => {
      i18n.current.changeLanguage(localeCode);
    }, [localeCode, i18n]);

    return (
      <ConfigProvider
        theme={{
          token: handledThemeToken,
          algorithm: theme.compactAlgorithm,
        }}
        locale={localeCode === "zh-CN" ? zh_CN : en_US}
      >
        <I18nextProvider i18n={i18n.current}>
          <Component {...props} />
        </I18nextProvider>
      </ConfigProvider>
    );
  };
}
```

### 思路 七 @@

- 描述：**接思路六，既然`localeCode`初始值始终是`zh-CN`，即如果有国际化资源就默认使用中文，那现在既然国际化没有生效，那会不会是国际化的资源`en_US`和`zh_CN`根本就没有获取到呢？**

- 结果：

  - **先看本地效果，能够打印出`en_US`和`zh_CN`对象**，都是`supcond2`组件的国际化信息，如 `DatePicker、Modal、Pagination` 等。如`zh_CN`对象部分属性：`{ Modal: {okText: '确定', cancelText: '取消', justOkText: '知道了'}，Pagination: {items_per_page: '条/页', jump_to: '跳至', jump_to_confirm: '确定', page: '页', ...}`
  - 打包放到 153，**发现打印出的`en_US`和`zh_CN`都是个 `Module`**，且两者是一样的，包含 `supcond2` 的所有组件，**即打印的`en_US`和`zh_CN`疑是`supcond2` Module，而不是国际化信息**。猜测：`import zh_CN from "@supcon/supcond2/locale/zh_CN";` 没有找到资源，实际变成了`import zh_CN from "@supcon/supcond2;`

- 结论及期望目标：
  从结果看来，`supcond2`的国际化资源没有打包进去，跟`supcond2`的各种组件一样，被`external`掉了。**如何改动`SSPA`的打包配置才能只`external`掉`supcond2`的各种组件，而不`external`掉`supcond2`的国际化资源`locale`呢**？

```tsx
import zh_CN from "@supcon/supcond2/locale/zh_CN";
import en_US from "@supcon/supcond2/locale/en_US";

React.useEffect(() => {
  console.log("addLocale中获取到的 ::> localeCode", localeCode);
  console.log("addLocale中获取到的 ::> en_US", en_US);
  console.log("addLocale中获取到的 ::> zh_CN", zh_CN);
  i18n.current.changeLanguage(localeCode);
}, [localeCode, i18n]);
```

#### 改动前

**【打包文件依赖模块分析】**

安装`BundleAnalyzerPlugin`后，打包过程打开的依赖模块分析页面中`Stat`中搜索 `locale` 没有发现与 `supcond2` 国际化相关的。

**【SSPA 打包信息】**

终端中输出的`trend` 打包信息如下：

```bash
built modules 4.74 MiB [built]
  modules by path ./node_modules/ 2.38 MiB 450 modules

  modules by path ./src/ 2.36 MiB
    modules by path ./src/control/runtime/ 1.82 MiB 34 modules
    modules by path ./src/assets/ 538 KiB 6 modules
    ./src/common/constant.ts 9.93 KiB [built] [code generated]

  modules by path external "@ecsnext/ 84 bytes
    external "@ecsnext/utils" 42 bytes [built] [code generated]
    external "@ecsnext/supcond" 42 bytes [built] [code generated]
  external "react" 42 bytes [built] [code generated]
  external "react-dom" 42 bytes [built] [code generated]
  external "dayjs" 42 bytes [built] [code generated]
  external "single-spa" 42 bytes [built] [code generated]
```

**【SSPA 打包后的文件信息】**

`trend` 文件夹下的文件信息如下：

```shell
# `trend`

22.index.js               7KB
22.index.js.map           21KB
961.index.js              218KB
961.index.js.map          1334KB
index.js                  1789KB
index.js.map              5035KB
```

**【SSPA 打包后的文件源码分析】**

`trend/index.js` 生产环境代码在浏览器中打开，信息如下（匹配大小写）：

- 搜索到`locale`文本 102 处，
- `Modal`文本 6 处，
- `DatePicker` 文本 2 处，
- `Pagination` 文本 1 处。

#### 尝试改动一

**【代码改动】**

```js
// config\webpack.config.sspa.js
{
  externals: [
    'dayjs',
    // /^@supcon\/supcond2/,
    function(ctx, callback) {
      if(/^@supcon\/supcond2/.test(ctx?.request)) {
        // 若是国际化语言，如"@supcon/supcond2/locale/zh_CN"，则不external掉。
        if (/^@supcon\/supcond2\/locale/.test(ctx?.request)) {
          console.log('ctx?.request', ctx?.request)
          return callback();
        }
        return callback(null, '@ecsnext/supcond');
      }
      callback();
    }
  ],
}
```

**【SSPA 打包】**

- 结果：失败。打包报错如下：

```bash
ctx?.request @supcon/supcond2/locale/zh_CN
ctx?.request @supcon/supcond2/locale/en_US

ERROR in ./src/control/runtime/components/addLocale/index.tsx 7:0-50
Module not found: Error: Can't resolve '@supcon/supcond2/locale/zh_CN' in 'E:\xulei文件\gitlabProjects\fusionsite\are-trend-web\src\control\runtime\components\addLocale'
resolve '@supcon/supcond2/locale/zh_CN' in 'E:\xulei文件\gitlabProjects\fusionsite\are-trend-web\src\control\runtime\components\addLocale'
  Parsed request is a module
  using description file: E:\xulei文件\gitlabProjects\fusionsite\are-trend-web\package.json (relative path: ./src/control/runtime/components/addLocale)
    aliased with mapping '@supcon/supcond2': '@ecsnext/supcond' to '@ecsnext/supcond/locale/zh_CN'
```

- 分析原因：（推测）因为`resolve.alias`中配置了`'@supcon/supcond2'`的别名为`'@ecsnext/supcond'`，`externals`中配置了不`external`掉`"@supcon/supcond2/locale/zh_CN"`，所以打包时会去找`"@supcon/supcond2/locale/zh_CN"`，但是由于别名生效了，找不到了，只有`"@ecsnext/supcond/locale/zh_CN"`，所以报错`Module not found: Error: Can't resolve '@supcon/supcond2/locale/zh_CN' in xxxx`。

#### 尝试改动二

**【代码改动】**

```js
// config\webpack.config.sspa.js
{
externals: [
    'dayjs',
    // /^@supcon\/supcond2/,
    function(ctx, callback) {
      if(/^@supcon\/supcond2/.test(ctx?.request)) {
        // 若是国际化语言，如"@supcon/supcond2/locale/zh_CN"，则还是external为 '@supcon/supcond2'。
        if (/^@supcon\/supcond2\/locale/.test(ctx?.request)) {
          console.log('ctx?.request', ctx?.request)
          return callback(null, '@supcon/supcond2');
        }
        return callback(null, '@ecsnext/supcond');
      }
      callback();
    }
  ],
}
```

**【打包文件依赖模块分析】**

安装`BundleAnalyzerPlugin`后，打包过程打开的依赖模块分析页面中`Stat`中搜索 `locale` 发现了 `supcond2/locale` 相关的。

```bash
./supcond2/locale/en_US" (42 B)
./supcond2/locale/zh_CN" (42 B)
```

**【SSPA 打包信息】**

终端中输出的`trend` 打包信息如下：

```bash
built modules 4.74 MiB [built]
  modules by path ./node_modules/ 2.38 MiB 450 modules

  modules by path ./src/ 2.36 MiB 41 modules

  modules by path external "@ecsnext/ 84 bytes
    external "@ecsnext/utils" 42 bytes [built] [code generated]
    external "@ecsnext/supcond" 42 bytes [built] [code generated]

  modules by path external "@supcon/supcond2/locale/ 84 bytes
    external "@supcon/supcond2/locale/zh_CN" 42 bytes [built] [code generated]  # 新增的
    external "@supcon/supcond2/locale/en_US" 42 bytes [built] [code generated]  # 新增的
  external "react" 42 bytes [built] [code generated]
  external "react-dom" 42 bytes [built] [code generated]
  external "dayjs" 42 bytes [built] [code generated]
  external "single-spa" 42 bytes [built] [code generated]
```

**【SSPA 打包后的文件信息】**

`trend` 文件夹下的文件信息如下：

```shell
# `trend`

22.index.js               7KB
22.index.js.map           21KB
961.index.js              218KB
961.index.js.map          1334KB
index.js                  1789KB # 比改动前的1789KB一样
index.js.map              5036KB # 比改动前的5036KB增加了 1KB
```

**【SSPA 打包后的文件源码分析】**

`trend/index.js` 生产环境代码在浏览器中打开，信息如下（匹配大小写）：

- 搜索`locale`文本 104 处（新增的两处是`System.register` 中的两个`locale/`），
- `Modal`文本 6 处，
- `DatePicker` 文本 2 处，
- `Pagination` 文本 1 处。

```js
System.register(
  [
    "react",
    "react-dom",
    "@ecsnext/utils",
    "@ecsnext/supcond",
    "@supcon/supcond2/locale/zh_CN",
    "@supcon/supcond2/locale/en_US",
    "dayjs",
    "single-spa",
  ],
  function (t, e) {...}
);
```

**【生产环境测试】**

- 结果：失败。打包没有报错，但是打包文件放到 153 发现有问题，趋势界面没有出来，一直在转圈。

- 分析原因：同`尝试改动一`的分析原因。

#### 尝试改动三@@

**【背景】**

查阅`Webpack`官网，发现`配置-resolve.alias`部分提到了：可以在给定对象的键后的末尾添加`$`，以表示精准匹配。

```js
const path = require("path");

module.exports = {
  //...
  resolve: {
    alias: {
      xyz$: path.resolve(__dirname, "path/to/file.js"),
    },
  },
};
```

这将产生以下结果：

```js
import Test1 from "xyz"; // 精确匹配，所以 path/to/file.js 被解析和导入
import Test2 from "xyz/file.js"; // 非精确匹配，触发普通解析
```

**【代码改动】**

所以尝试修改如下：

```js
// config\webpack.config.sspa.js
{
resolve: {
  alias: {
    'src': paths.appSrc,
    '@': paths.appSrc,
    '@R': paths.runtime,
    '@C':paths.config,
    // 末尾添加$，以表示精准匹配。
    '@supcon/supcond2$': isSSPA ? '@ecsnext/supcond' : '@supcon/supcond2',
  }
},
externals: [
    'dayjs',
    // /^@supcon\/supcond2/,
    function(ctx, callback) {
      if(/^@supcon\/supcond2/.test(ctx?.request)) {
        // 若是国际化语言，如"@supcon/supcond2/locale/zh_CN"，则不external掉。
        if (/^@supcon\/supcond2\/locale/.test(ctx?.request)) {
            console.log('ctx?.request', ctx?.request)
            return callback();
        }
        return callback(null, '@ecsnext/supcond');
      }
      callback();
    }
  ],
}
```

**【打包文件依赖模块分析】**

安装`BundleAnalyzerPlugin`后，打包过程打开的依赖模块分析页面中`Stat`中`Search modules` 搜索 `/locale` 发现了许多与 `supcond2/locale` 相关的。

- `Search modules:` 中输入 `/locale`，搜索到`Count: 161 Total size: 1.06 MB`。
- `Search modules:` 中输入 `(?<!moment)/locale`（因为许多是`../moment/locale/`，与目标`supcond2/locale`无关，所以使用了反向否定预查），搜索到`Count: 23 Total size: 65.18 KB`。搜索结果树如下：
- `Search modules:` 中输入`(?<!(moment|src))/locale`（同时排除`../moment/locale/`和`../src/locale/`），搜索到`Count: 18 Total size: 28.73 KB`。

```bash
# `Search modules:` 中输入 `(?<!moment)/locale`

index.js
./node_modules/@supcon/supcond2/lib/date-picker/locale (2.33 KB)
./node_modules/rc-picker/lib/locale (1.86 KB)
./node_modules/rc-pagination/lib/locale (939 B)
./node_modules/@supcon/supcond2/lib/calendar/locale (676 B)
./node_modules/@supcon/supcond2/lib/time-picker/locale (516 B)
# 5处 `../src/locale/` 其中的2处
./entry modules (concatenated)/src/control/runtime/indexSpa.tsx + 650 modules (concatenated)/src/locales/i18n/en-US.json (6.53 KB)
./entry modules (concatenated)/src/control/runtime/indexSpa.tsx + 650 modules (concatenated)/src/locales/i18n/zh-CN.json (5.16 KB)
./node_modules/@supcon/supcond2/lib/locale/en_US.js (4.11 KB)
./node_modules/@supcon/supcond2/lib/locale/zh_CN.js (3.99 KB)
./node_modules/@supcon/supcond2/lib/date-picker/locale/zh_CN.js (1.22 KB)
./node_modules/@supcon/supcond2/lib/date-picker/locale/en_US.js (1.11 KB)
./node_modules/rc-picker/lib/locale/zh_CN.js (963 B)
./node_modules/rc-picker/lib/locale/en_US.js (937 B)
# 5处 `../src/locale/` 其中的1处
./entry modules (concatenated)/src/control/runtime/indexSpa.tsx + 650 modules (concatenated)/src/locales/index.ts (700 B)
./node_modules/rc-pagination/lib/locale/en_US.js (477 B)
./node_modules/rc-pagination/lib/locale/zh_CN.js (462 B)
./node_modules/@supcon/supcond2/lib/calendar/locale/en_US.js (338 B)
./node_modules/@supcon/supcond2/lib/calendar/locale/zh_CN.js (338 B)
./node_modules/@supcon/supcond2/lib/time-picker/locale/zh_CN.js (263 B)
./node_modules/@supcon/supcond2/lib/time-picker/locale/en_US.js (253 B)
# 5处 `../src/locale/` 其中的2处
./entry modules (concatenated)/src/control/runtime/indexSpa.tsx + 650 modules (concatenated)/src/locales (12.38 KB)
./entry modules (concatenated)/src/control/runtime/indexSpa.tsx + 650 modules (concatenated)/src/locales/i18n (11.69 KB)
./node_modules/@supcon/supcond2/lib/locale (8.1 KB)
```

**【SSPA 打包信息】**

终端中输出的`trend` 打包信息如下：（`./node_modules/`从 比改动前的`2.38 MiB 450 modules ` 变成 `2.4 MiB 463 modules`）

```bash
built modules 4.76 MiB [built]
  modules by path ./node_modules/ 2.4 MiB 463 modules # 大小和modules数量有变化

  modules by path ./src/ 2.36 MiB
    modules by path ./src/control/runtime/ 1.82 MiB 34 modules
    modules by path ./src/assets/ 538 KiB 6 modules
    ./src/common/constant.ts 9.93 KiB [built] [code generated]

  modules by path external "@ecsnext/ 84 bytes
    external "@ecsnext/utils" 42 bytes [built] [code generated]
    external "@ecsnext/supcond" 42 bytes [built] [code generated]
  external "react" 42 bytes [built] [code generated]
  external "react-dom" 42 bytes [built] [code generated]
  external "dayjs" 42 bytes [built] [code generated]
  external "single-spa" 42 bytes [built] [code generated]
```

**【SSPA 打包后的文件信息】**

`trend` 文件夹下的文件信息如下：

```bash
# `trend` trend文件夹在资源管理器中查看是8.34M

22.index.js               7KB
22.index.js.map           21KB
961.index.js              218KB
961.index.js.map          1334KB
index.js                  1800KB # 比改动前的1789KB 增加了 11KB
index.js.map              5061KB # 比改动前的5035KB 增加了 26KB
```

**【SSPA 打包后的文件源码分析】**

浏览器中打开`index.js`，搜索`locale`文本 106 处，`Modal`文本 8 处，DatePicker 文本 4 处，Pagination 文本 3 处。

- `trend/index.js` 生产环境代码在浏览器中打开，信息如下（匹配大小写）：
  - 搜索`locale`文本 106 处（与改动前相比较新增了 4 处，只明显发现了 106 处 的前两处是新增的），
  - `Modal`文本 8 处（与改动前相比较新增了 2 处），
  - `DatePicker` 文本 4 处（与改动前相比较新增了 2 处），
  - `Pagination` 文本 3 处（与改动前相比较新增了 2 处）。
  - 上面`Modal`、`DatePicker`、`Pagination`，与改动前相比较新增 2 处，新增的是后面的`supcond2 组件国际化代码`里的`Modal`、`DatePicker`、`Pagination`的中英文配置，刚好中文配置里 1 处，英文配置里 1 处。

```js
System.register(
  [
    "react",
    "react-dom",
    "@ecsnext/utils",
    "@ecsnext/supcond",
    "dayjs",
    "single-spa",
  ],
  function (e, t) {...}
);
```

`trend/index.js` 生产环境代码在浏览器中打开预览，发现了 `supcond2`组件的国际化信息。说明确实打包进去了。部分`supcond2`组件的国际化信息代码如下：

```js
// supcond2 组件国际化代码

{60811: function(e, t, n) {
  "use strict";
  var i = n(64836).default;
  t.Z = void 0;
  var r = i(n(62273))
    , a = i(n(66421))
    , o = i(n(19656))
    , s = i(n(72652));
  const M = "${label} is not a valid ${type}";
  var u = {
      locale: "en",
      Pagination: r.default,
      DatePicker: o.default,
      TimePicker: s.default,
      Calendar: a.default,
      global: {
          placeholder: "Please select"
      },
      Table: {
          filterTitle: "Filter menu",
          filterConfirm: "OK",
          filterReset: "Reset",
          filterEmptyText: "No filters",
          filterCheckall: "Select all items",
          filterSearchPlaceholder: "Search in filters",
          emptyText: "No data",
          selectAll: "Select current page",
          selectInvert: "Invert current page",
          selectNone: "Clear all data",
          selectionAll: "Select all data",
          sortTitle: "Sort",
          expand: "Expand row",
          collapse: "Collapse row",
          triggerDesc: "Click to sort descending",
          triggerAsc: "Click to sort ascending",
          cancelSort: "Click to cancel sorting"
      },
      Modal: {
          okText: "OK",
          cancelText: "Cancel",
          justOkText: "OK"
      },
      Popconfirm: {
          okText: "OK",
          cancelText: "Cancel"
      },
      Empty: {
          description: "No data"
      },
      // ...
  };
  t.Z = u;
},
67955: function(e, t, n) {
  "use strict";
  var i = n(64836).default;
  t.Z = void 0;
  var r = i(n(74219))
    , a = i(n(21162))
    , o = i(n(43276))
    , s = i(n(19526));
  const M = "${label}不是一个有效的${type}";
  var u = {
      locale: "zh-cn",
      Pagination: r.default,
      DatePicker: o.default,
      TimePicker: s.default,
      Calendar: a.default,
      global: {
          placeholder: "请选择"
      },
      Table: {
          filterTitle: "筛选",
          filterConfirm: "确定",
          filterReset: "重置",
          filterEmptyText: "无筛选项",
          filterCheckall: "全选",
          filterSearchPlaceholder: "在筛选项中搜索",
          selectAll: "全选当页",
          selectInvert: "反选当页",
          selectNone: "清空所有",
          selectionAll: "全选所有",
          sortTitle: "排序",
          expand: "展开行",
          collapse: "关闭行",
          triggerDesc: "点击降序",
          triggerAsc: "点击升序",
          cancelSort: "取消排序"
      },
      Modal: {
          okText: "确定",
          cancelText: "取消",
          justOkText: "知道了"
      },
      Popconfirm: {
          cancelText: "取消",
          okText: "确定"
      },
      Empty: {
          description: "暂无数据"
      }
      // ...
  };
  t.Z = u;
}
}
```

**【生产环境测试】**

- 结果：成功。
  - 打包文件放到 153 环境， 发现趋势界面能够正常出来。
  - 控制台查看打印，能够打印出国际化资源`en_US`和`zh_CN`，都是一些需要国际化支持的组件的国际化资源，如 `DatePicker、Modal、Pagination` 等组件，即跟改动前的本地环境打印的一样了。
  - 参照`问题描述一`查看界面效果，不管刷新页面后第一次加载趋势，还是把趋势标签页 x 掉，再重新打开，趋势中各处组件的国际化都是默认中文了。
  - 综上，问题成功解决。

## **【关键路径信息】**

- 一：从`问题描述一、二`及其已知，就应该推断出是 0823`趋势在集成模式下剥离supcond`功能改动的`external`造成的。
- 二：有了`关键路径信息一`，就该直接去测试验证，即思路三，验证成功，`关键路径信息一`的推断变成了肯定。
  - 后续修改代码也能确定要围绕着`SSPA.config.js`打包文件中的`external`配置。
- 三：`思路一`时就已经知道`addLocale`是处理国际化配置的高级组件，就该在该组件中打印`localeCode`及国际化资源` zh_C`、`en_US`，看看本地及生产环境`SSPA趋势`中的打印情况，甚至生产环境`Control趋势`也能打印，看看到底有何区别。
  - 不过`思路六`也确实是我突然想到的思路，但是只想到了打印`localeCode`。
- 四：有了`思路六`的结果，`思路七`自然就跟着出来了。因为国际化不生效，只可能有两个原因，一是初始没有设置成中文，二是根本就没有国际化资源。

  - `思路六`的验证结果把原因一排除了，
  - `思路七`的验证结果说明就是原因二造成的。
  - 至此，问题产生原因找到了：`supcond2`的国际化资源没有打包进去，跟`supcond2`的各种组件一样，被`external`掉了。
  - 那么怎么解决当然也就知道了，期望目标随即产生：**如何改动`SSPA`的打包配置才能只`external`掉`supcond2`的各种组件，而不`external`掉`supcond2`的国际化资源`locale`呢**？

- 五：有了`尝试改动一`的结果及分析原因，猜测除了要不`external`掉`supcond2`的国际化资源，还需要对`resolve.alias`进行修改。
  - 如何修改，对这个配置不熟悉，自然要查`webpack`官网。
  - 在`webpack`官网看到了`尝试改动一-背景`描述的`$`结尾表示精确匹配，跟`关键路径信息四`中的期望目标好像很有关系，就尝试了一下。
  - 果然，在`【打包文件依赖模块分析】`中就能发现一些与 `supcond2/locale` 相关的模块。
  - 接着，在`【SSPA 打包后的文件源码分析】`中直接看到了 `supcond2`组件的国际化信息。
  - 最后，在`【生产环境测试】`，也成功了。问题彻底解决。

## **收获**

- webpack 解析-别名设置（`resolve.alias`）支持精确匹配 ：`在给定对象的键的末尾添加$，以表示精确匹配`
- webpack 的`externals`配置，可以设置不`external`全部依赖，而过滤掉依赖中部分模块资源。
- 使用`BundleAnalyzerPlugin`插件，可以很好的分析打包文件的各个依赖模块。
  - `modules`依赖图很清晰，支持拖动放大，对于依赖模块的归属、大小、名称、来源清晰明了。
  - 支持正则搜索`modules`，搜索结果树清晰展示，搜索结果树节点支持点击后在依赖图中定位位置；依赖图中搜索结果高亮显示，
  - 依赖图中的`modules`支持右键选择`仅预览当前module`、`预览除当前外的module`。

## 疑问

- 疑问一：不知道为什么`console.log('ctx?.request', ctx?.request)`打印的内容，跟 0823`趋势在集成模式下剥离supcond`功能当时的打印的内容不一样了，除了`/locale/xx`、`/es/xx`，剩下的从之前的`@supcon/supcond2/lib/组件名` 变成了 `@supcon/supcond2`，如下面代码。
  - 猜测：当时`'@supcon/supcond2'`的按需加载还没有删除，所以导致的？
  - 验证：恢复之前删除的`'@supcon/supcond2'`的按需加载，重新打包，结果发现打印中有了各个`@supcon/supcond2/lib/组件名`，`@supcon/supcond2`也有一些，果然同猜测的一样。
  ```bash
  ctx?.request @supcon/supcond2
  ctx?.request @supcon/supcond2
  ctx?.request @supcon/supcond2/es/style/reset.css
  ctx?.request @supcon/supcond2
  ctx?.request @supcon/supcond2/locale/zh_CN
  ctx?.request @supcon/supcond2/locale/en_US
  ctx?.request @supcon/supcond2
  # .....
  ctx?.request @supcon/supcond2/es/checkbox/Checkbox
  ctx?.request @supcon/supcond2
  ctx?.request @supcon/supcond2/es/checkbox/Checkbox
  ctx?.request @supcon/supcond2
  ctx?.request @supcon/supcond2/es/checkbox/Checkbox
  ```

## 其它

**【询问 ChartGpt】**

> Q（gpt）：React 子项目 打包时 external 了 antd，在父应用中使用的是父应用环境中的 antd，但是这样导致了 某些 antd 组件的国际化有了问题

A：
当您在父应用中使用外部（external）的 Ant Design 组件库时，可能会导致国际化出现问题。这**是因为子项目打包时已经将 Ant Design 的相关代码剥离，无法直接访问父应用环境中的语言配置**。
