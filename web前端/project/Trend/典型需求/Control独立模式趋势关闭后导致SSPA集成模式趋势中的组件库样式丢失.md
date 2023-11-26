# Control 独立模式趋势关闭后导致 SSPA 集成模式趋势中的`supcond2`各组件的样式丢失

## 问题描述

在监控中打开多个趋势，关闭`Control`趋势弹窗会导致 SSPA 趋势样式丢失。

- 一：监控 web 端，先从菜单打开趋势页（记为 A），再点击位号名打开 AI 面板弹窗，点击弹窗中的趋势 Tab（记为 B），再关闭 AI 面板弹窗，发现 A 中表单控件、表格单元格样式等都没有了，变成了 JS 原生的表单控件、表格单元格样式，即少了 `supcond` 的样式。
- 二：且发现，如果 B 中点开了 a 模块的组件，关闭 AI 面板弹窗后，A 中的 a 模块的组件样式会消失。如果 B 中的 b 模块没有点开，b 模块下组件不会加载，关闭 AI 面板弹窗，则 A 中的 b 模块的组件样式不会消失。

  - 结论：**趋势 B 中的`supcond`组件库中的组件样式是按需加载的，组件被渲染了才会去加载对应的组件样式，同理，组件被卸载了就会去卸载对应的组件样式**。

## 已知

- 一：基座中打开的趋势（上面的 A）是以`SSPA子应用（集成）模式`被打包，文件是`trend`文件夹，打包`external`掉了 `@supcon/supcond2`组件库。
- 二：趋势（上面的 B）以`Control独立应用模式`被打包，文件是`control-shapes-trend`文件夹，打包没有 `external` 掉 `@supcon/supcond2`组件库。
- 三：74 环境：BYD 本机环境
- 四：目标`select`：趋势顶部时间窗口`select`控件
- 五：92 测试结果：打包文件替换到 92 环境之后的测试结果

## 测试记录一

- 记录一：92: 目标`select` 的 css 类 hash 是 `css-1vvfk0s`，消失的`<style />`标签的`data-css-hash`是`12na8bi`。

  - `<style />`标签详细：`<style data-rc-order="prependQueue" data-css-hash="12na8bi" data-token-hash="1o0db83">`

- 记录二：无论是本地开发环境，还是本地打包后放到 74 环境上，不管打包多少次，目标`select` 始终有`css-1vvfk0s`这个类。
  - **结论：css 哈希类的哈希值不是打包时随机生成的，而是打包时根据某种规则生成的**。

### 1016-1020 74 环境

通过基座菜单打开趋势 A，找到目标`select`，发现其`css-1vvfk0s`类的样式来源：`/html/head/style[4]`。如下：

```css
:where(.css-1vvfk0s).supcon2-select { }

<style data-rc-order="prependQueue" data-css-hash="12na8bi" data-token-hash="1o0db83">
```

- `head` 下的不同 `style` 中

  - `stlye` 的 `data-token-hash` 是一致的`data-token-hash="1o0db83"`
  - `stlye` 的 data-css-hash 是不一样的
  - `stlye` 下的具体组件的样式类的`css-hash值`是一致的`.css-1vvfk0s {}`

- `源代码`中搜索

  - `12na8bi`：未搜到
  - `1o0db83`：未搜到
  - `1vvfk0s`：未搜到
  - `"supcon2-select"`：七个文件找到 10 个
  - **结论：源代码中搜索 css 哈希类的哈希值没有搜到，说明哈希值不是打包时候就生成好的，而是运行时候生成的**。

- 其它
  - 1016-1017，有尝试过本机修改 webpack 配置，然后打包替换 74 环境的两个趋势文件夹，但是都没有效果
    - 当时本机是没有拉取这个提交的：1013 下午 `CIauto update package.json ，supcond2 从"2.1.8"变为"2.1.9"`。即打包出来的趋势包，用的 `supcond2` 还是`"2.1.8"`版本。

### 1023 92 环境

- 74 是能复现的，1016-1020 期间都是能复现的

  - 跟 BYD 确认：74 环境是 1006 安装的 0926 的包

- 结果 92 没法复现如问题描述的 bug 了。 1016-1017 是能复现的，1018 早上换了包之后，就复现不了了

  - 1023 早上能够发现
    - 【趋势 A 中目标`select`】
      - 组件类 hash 是`css-1vvfk0s`
      - 通过点击 style，发现样式来源是`<style data-rc-order="prependQueue" data-css-hash="12na8bi" data-token-hash="1o0db83"> :where(.css-1vvfk0s)[class^="supcon2-select"] </style>`
    - 【趋势 B 中目标`select`】，B 中目标`select` 的 css 哈希类从`css-1vvfk0s`变为`css-hkx2gf`。
      - 组件类 hash 是`css-hkx2gf`
      - 通过点击 style，发现样式来源是`<style data-rc-order="prependQueue" data-css-hash="1r7v9ve" data-token-hash="vnmfuw> :where(.css-hkx2gf)[class^="supcon2-select"] </style>`
  - `Sources-Page-[:ip]-root-config`中能够发现，框架中的`supcond2`是 2.1.8 版本。来源：`[webpack://trend-web/external system "@ecsnext/supcond"](http://xxx.xxx.x.92/root-config/supcond2@2.1.8/supcond2/dist/@supcon/supcond2.min.js)`
  - `Sources-Page`下的`trend-web`文件夹就是`sspa`打包出的文件，因为看到了`external system 'dayjs'`，而这个是在`webpack.config.sspa.js`中加的
  - 查看趋势项目提交记录能够发现，`"@supcon/supcond2": "2.1.9",` 是 1013 下午 `CIauto update package.json ，supcond2 从"2.1.8"变为"2.1.9"`
    - （猜测一）难道说，**1018 早上换包后突然好了，是因为最新包的`supcond2` 版本（`"2.1.9"`）比`SSPA`趋势 A 使用的框架中 supcond2 版本（`"2.1.8"`）高了，导致`css-${hash值}`不一样了，所以 92 环境没法复现了**。

- （猜测一）验证
  - 1020 周五下班本机拉取了最新趋势代码，然后打了包，现在用这个包替换到 74 环境，看什么效果。
  - 发现 bug 依然能否复现。（验证失败 ）
    - 趋势 A 中目标`select`的 css 哈希类还是`css-1vvfk0s`
    - 趋势 B 中目标`select`的 css 哈希类还是`css-1vvfk0s`
  - 随即发现趋势项目`are-trend-web\node_modules\@supcon\supcond2\package.json` 中的本地安装版本还是`2.1.8`，因为没有 yarn，所以即使拉取了最新的`package.json`和`yarn.lock`文件，也没有改变打包文件中的`supcond2`的版本。
  - 重新 yarn 后，再次测试
    - 本地启动，发现时间窗口 select 的类了。变为`css-dev-only-do-not-override-hkx2gf`
    - 打包后，替换到 92 环境，发现趋势 B 中目标`select`的 css 哈希类是`css-hkx2gf`
    - **结论：`css-hkx2gf`就是 2.1.9 版本`supcond2`打包文件根据某种规则生成的 css 哈希类的值**。
  - 打包后，替换到 74 环境
    - 趋势 A 中目标`select`的 css 哈希类还是`css-1vvfk0s`
    - 趋势 B 中目标`select`的 css 哈希类变成`css-hkx2gf`
- 其它
  - 查看下框架中的`mare-basic-web`中的`supcond2`的版本是什么时候改动的
    - 也是 1013 下午`CI auto update package.json, upgrade supcon component version!`
    - 但是没用，基座中`root-config`下的版本还是 2.1.8。`http://xxx.xxx.x.92/root-config/supcond2@2.1.8`

## `【排查思路一：1023】 怀疑是Control独立模式的按需加载导致，尝试改动config.cra.js`

**如何确定趋势 A 中样式丢失是趋势 B 所在弹窗关闭导致的呢？**

**【描述】**

通过目标`select`的 css 哈希类，找到目标`<style>`标签，右键`发生中断的条件-移除节点`（作用就是监测这个 style 节点，如果该节点要被删了，会在`源代码-执行的地方`打个断点，即可以知道是什么地方的什么代码导致的该节点被删除。）。

**【测试】**

然后进行操作，从面板弹窗中打开趋势 B，然后关闭弹窗，发现断点在`源代码-http://xxx.xxx.1.74/common/node_modules/@ant-design/cssinjs/es/hooks/useCacheToken.js(第24行)`。该文件源码如下：

```js
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import hash from "@emotion/hash";
import * as React from "react";
import { useContext } from "react";
import StyleContext, { ATTR_TOKEN, CSS_IN_JS_INSTANCE } from "../StyleContext";
import { flattenToken, token2key } from "../util";
import useGlobalCache from "./useGlobalCache";
var EMPTY_OVERRIDE = {};

// Generate different prefix to make user selector break in production env.
// This helps developer not to do style override directly on the hash id.
var hashPrefix =
  process.env.NODE_ENV !== "production"
    ? "css-dev-only-do-not-override"
    : "css";
var tokenKeys = new Map();
function recordCleanToken(tokenKey) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1);
}
function removeStyleTags(key, instanceId) {
  if (typeof document !== "undefined") {
    var styles = document.querySelectorAll(
      "style[".concat(ATTR_TOKEN, '="').concat(key, '"]')
    );
    styles.forEach(function (style) {
      if (style[CSS_IN_JS_INSTANCE] === instanceId) {
        var _style$parentNode;
        (_style$parentNode = style.parentNode) === null ||
        _style$parentNode === void 0
          ? void 0
          : _style$parentNode.removeChild(style);
      }
    });
  }
}

// Remove will check current keys first
function cleanTokenStyle(tokenKey, instanceId) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1);
  var tokenKeyList = Array.from(tokenKeys.keys());
  var cleanableKeyList = tokenKeyList.filter(function (key) {
    var count = tokenKeys.get(key) || 0;
    return count <= 0;
  });
  if (cleanableKeyList.length < tokenKeyList.length) {
    cleanableKeyList.forEach(function (key) {
      removeStyleTags(key, instanceId);
      tokenKeys.delete(key);
    });
  }
}

/**
 * Cache theme derivative token as global shared one
 * @param theme Theme entity
 * @param tokens List of tokens, used for cache. Please do not dynamic generate object directly
 * @param option Additional config
 * @returns Call Theme.getDerivativeToken(tokenObject) to get token
 */
export default function useCacheToken(theme, tokens) {
  var option =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _useContext = useContext(StyleContext),
    instanceId = _useContext.cache.instanceId;
  var _option$salt = option.salt,
    salt = _option$salt === void 0 ? "" : _option$salt,
    _option$override = option.override,
    override = _option$override === void 0 ? EMPTY_OVERRIDE : _option$override,
    formatToken = option.formatToken;

  // Basic - We do basic cache here
  var mergedToken = React.useMemo(
    function () {
      return Object.assign.apply(
        Object,
        [{}].concat(_toConsumableArray(tokens))
      );
    },
    [tokens]
  );
  var tokenStr = React.useMemo(
    function () {
      return flattenToken(mergedToken);
    },
    [mergedToken]
  );
  var overrideTokenStr = React.useMemo(
    function () {
      return flattenToken(override);
    },
    [override]
  );
  var cachedToken = useGlobalCache(
    "token",
    [salt, theme.id, tokenStr, overrideTokenStr],
    function () {
      var derivativeToken = theme.getDerivativeToken(mergedToken);

      // Merge with override
      var mergedDerivativeToken = _objectSpread(
        _objectSpread({}, derivativeToken),
        override
      );

      // Format if needed
      if (formatToken) {
        mergedDerivativeToken = formatToken(mergedDerivativeToken);
      }

      // Optimize for `useStyleRegister` performance
      var tokenKey = token2key(mergedDerivativeToken, salt);
      mergedDerivativeToken._tokenKey = tokenKey;
      recordCleanToken(tokenKey);

      var hashId = "".concat(hashPrefix, "-").concat(hash(tokenKey));

      mergedDerivativeToken._hashId = hashId; // Not used

      return [mergedDerivativeToken, hashId];
    },
    function (cache) {
      // Remove token will remove all related style
      cleanTokenStyle(cache[0]._tokenKey, instanceId);
    }
  );
  return cachedToken;
}
```

若把目标`<style>`标签，右键`发生中断的条件-移除节点 & 子树修改 & 属性修改`三个条件都勾选上，那么在打开趋势 A 后再打开面板弹窗中的 趋势 B 时，也会触发中断，即目标标签的子树修改了或者属性修改了。触发的文件路径是`http://xxx.xxx.1.74/common/node_modules/@ant-design/cssinjs/es/hooks/useStyleRegister/index.js`

通过打断点调试发现：`var hashId = "".concat(hashPrefix, "-").concat(hash(tokenKey));` 这一行，`hashId`的值是`"css-dev-only-do-not-override-1vvfk0s"`，跟 74 上的各个 supcond2 的各个组件上的类名`.css-1vvfk0s`，是一个意思，只不过因为是本地开发环境，所以多了中间的。

- `var tokenKey = token2key(mergedDerivativeToken, salt);`
  - `tokenKey = 1o0db83`
  - `1o0db83` 就是目标 style 标签的`data-token-hash="1o0db83"`
- `var hashPrefix = process.env.NODE_ENV !== 'production' ? 'css-dev-only-do-not-override' : 'css';`

**【猜测】**

- 猜测一：**`css-hash`是在编译工具打包过程中生成的。值由`supcond2`的版本决定，同个版本打包出来的`css-hash`也是一致的**。

  - bug 中的 A 中的 hash 值和 B 中的 hash 值一致，是因为 A 是 sspa，用的是框架中的`2.1.8`版本的`supcond2`，而 B 是 control，用的是趋势自身的`supcond2`依赖，版本也是`2.1.8`版本。所以导致 hash 值一致。

- 猜测二：导致 bug 产生，是因为 B 中的`supcond2`使用了按需加载，弹窗打开，发现有`2.1.8`版本的`supcond2`某些组件的样式（即 A 中的），就不会再加载了，直接用 A 中的，弹窗关闭后，因为是按需加载，所以会回收该组件对应的样式（即删除了 A 中某些组件的 style 标签），导致 A 中样式丢失。
  - B 中打开的 a 在关闭弹窗后 A 中的 a 样式丢失了，而 B 中没有打开的 b 在关闭弹窗后 A 中的 b 样式正常。也能够支持这一猜测。
  - 如何修改该 bug？，应该是修改`config.cra.js`配置。

---

以下尝试改动及本地打包，都是在本机`1.26`进行的，然后都是把打包文件替换到 92 环境进行验证的。

## 改动一：组件库版本`2.1.8`

**【描述】**
1026 下午的代码 + 降级 `2.1.9` 版本 `supcond2` 到 `2.1.8`版本

**【打包文件】**

- `SSPA`集成模式，打包出的`trend`文件如下：

```shell
# `xx\webapps\trend`

22.index.js               7KB
22.index.js.map           21KB
745.index.js              218KB
745.index.js.map          1335KB
index.js                  1787KB
index.js.map              5023KB
```

- `Control`独立模式，打包出的`control-shapes-trend`文件如下：
  - 可以发现 `index.css/js/js.map` 与 `indexSpa.css/js/js.map` 的大小基本一样。（只有`.js.map` 差了 1KB）

```shell
# `xx\webapps\common\control-shapes-trend`


# 从static/js下文件命名及大小可以看出，好像是config.control.js中两种打包模式（umd 和 system）的输出文件。大小一模一样
static/js
   280.0a775fbe.chunk.js  449KB
   280.0a775fbe.chunk.js.map  2157KB
   280.28a0a2fe.chunk.js  449KB
   280.28a0a2fe.chunk.js.map  2157KB

   ResExplor.9977cd8f.chunk.js 6KB
   ResExplor.9977cd8f.chunk.js.map 16KB
   ResExplor.a0a4df14.chunk.js 6KB
   ResExplor.a0a4df14.chunk.js.mpa 16KB

asset-manifest.json       1KB
icon.jpg                  7KB
index.css                 396KB
index.html                1KB
index.js                  3417KB
index.js.LICENSE.txt      3KB
index.js.map              11700KB

indexSpa.css              396KB
indexSpa.js               3417KB
indexSpa.js.LICENSE.txt   3KB
indexSpa.js.map           11699KB

manifest.json             1KB
preview-icon.png          7KB
robots.txt                1KB
```

## 改动二：组件库版本`2.1.8` + 按需加载的 style 设置为 true

**【描述】**

1026 下午的代码 + 降级 `2.1.9` 版本 `supcond2` 到 `2.1.8`版本 + `Control`打包配置`webpack.config.cra.js` 中的按需加载 `supcond2` 中的 style 设置为 true

**【打包结果】**

打包失败，报错如下：

`Module not found: Error: Can't resolve '@supcon/supcond2/lib/theme/style' in 'E:\xxx\are-trend-web\src\control\runtime\components\addLocale'`

## 改动三：组件库版本`2.1.8` + 按需加载注释掉

**【描述】**

1026 下午的代码 + 降级 `2.1.9` 版本 `supcond2` 到 `2.1.8`版本 + `Control`打包配置`webpack.config.cra.js` 中的按需加载 `supcond2`给注释掉

**【打包结果】**

打包成功

**【打包文件】**

- `SSPA`集成模式，打包出的`trend`文件如下：

```shell
# `xx\webapps\trend`

22.index.js               7KB
22.index.js.map           21KB
745.index.js              218KB
745.index.js.map          1335KB
index.js                  1787KB
index.js.map              5023KB
```

- `Control`独立模式，打包出的`control-shapes-trend`文件如下

```shell
# `xx\webapps\common\control-shapes-trend`
static/js
   280.0a775fbe.chunk.js  444KB
   280.0a775fbe.chunk.js.map  2141KB
   280.28a0a2fe.chunk.js  444KB
   280.28a0a2fe.chunk.js.map  2141KB

   ResExplor.9977cd8f.chunk.js 6KB
   ResExplor.9977cd8f.chunk.js.map 16KB
   ResExplor.a0a4df14.chunk.js 6KB
   ResExplor.a0a4df14.chunk.js.mpa 16KB

asset-manifest.json       1KB
icon.jpg                  7KB
index.css                 396KB
index.html                1KB
index.js                  2437KB # 比改动一减少了980K
index.js.LICENSE.txt      3KB
index.js.map              9120KB # 比改动一减少了2580K

indexSpa.css              396KB
indexSpa.js               2437KB # 比改动一减少了980K
indexSpa.js.LICENSE.txt   3KB
indexSpa.js.map           9120KB # 比改动一减少了2580K

manifest.json             1KB
preview-icon.png          7KB
robots.txt                1KB
```

**【92 测试结果】**

- 结果：失败，同问题描述的现象一样。

## 改动四：组件库版本`2.1.8` + 样式`modules`处理中的`mode`值改为`local`

**【描述】**

1026 下午的代码 + 降级 `2.1.9` 版本 `supcond2` 到 `2.1.8`版本 + `Control`打包配置`webpack.config.cra.js` 中的样式`modules`处理中的 3 个`modules.mode`的值从`icss`改为`local`

**【打包结果】**

打包成功

**【92 测试结果】**

- 结果：失败，同问题描述的现象一样。

## 改动五：组件库版本`2.1.8` + 样式`modules`处理中新增`localIdentName`

**【描述】**

1026 下午的代码 + 降级 `2.1.9` 版本 `supcond2` 到 `2.1.8`版本 + `Control`打包配置`webpack.config.cra.js` 中的样式`modules`处理中的 3 个`modules.mode`属性后面新增`localIdentName: "[path][name]__local--[hash:base64:5]"`

**【打包结果】**

打包成功

**【92 测试结果】**

- 结果：失败，同问题描述的现象一样。

## 改动六：组件库版本`2.1.8` + 改动如下

**【描述】**

1026 下午的代码 + 降级 `2.1.9` 版本 `supcond2` 到 `2.1.8`版本 + `Control`打包配置`webpack.config.cra.js` 中改动如下

```js
{
  test: cssRegex,
  exclude: cssModuleRegex,
  use: getStyleLoaders({
    importLoaders: 1,
    sourceMap: isEnvProduction
      ? shouldUseSourceMap
      : isEnvDevelopment,
    modules: {
      mode: 'icss',
      localIdentHashSalt: 'trendHash', // 新增的
      localIdentName: "[path][name]__local--[hash:base64:5]"  // 新增的
    },
  }),
  sideEffects: true,
  },

  {
    test: cssModuleRegex,
    use: getStyleLoaders({
      importLoaders: 1,
      sourceMap: isEnvProduction
        ? shouldUseSourceMap
        : isEnvDevelopment,
      modules: {
        mode: 'local',
        localIdentHashSalt: 'trendHash', // 新增的
        getLocalIdent: getCSSModuleLocalIdent,
      },
    }),
  },
```

**【打包结果】**

打包成功

**【92 测试结果】**

- 结果：失败，同问题描述的现象一样。

## `【排查思路二：1026】` `Token + Version => Hash`

**【最新进展】**

- 一：发现趋势自己的样式代码都在`control-shapes-trend`根目录下。如`index.css`和`indexSpa.css`。其中也能搜索到`supcon2-`，但是是跟趋势自己业务代码中的样式组合使用的。

- 二：`supcond2` 组件自身的样式在`control-shapes-trend\static\js`目录下。
  在`280.0a775fbe.chunk.js`文件中搜索。`supcon2-select`能搜索到一处，搜索`supcon2-`能搜索到 11 处，如`supcon2-table`、`supcon2-checkbox`、`supcon2-input`等。都是趋势中用到的 `supcond2` 组件。

**【最新思路】**

**偶然想到去`Antd`官网查询样式 hash 值相关信息**。结果还真找到了。后续两个测试都是照着这个思路去走的。

> 根据我们从 v4 及之前版本确定下来的样式结构，**每一个组件的样式在相同的主题变量和相同的版本下是不会改变的。反过来说，只有修改了主题变量，或者改变了 antd 的版本，样式才可能会变化**。由此我们得到了一个非常简单的计算 hash 的方法：
>
> **Token + Version => Hash**
>
> 我们会对所有的 antd 组件应用相同的 hash。如此一来，使用 antd 组件时，我**们只会对当前的版本和主题变量进行 hash 计算，而前者可以直接由 package.json 中得到，后者可以直接从 context 中得到**，所以我们并不需要进行繁重的序列化 css 的操作，就可以得到稳定的 hash，从而大幅地减少性能消耗。

- `Antd`官网参考链接
  - [组件级别的 CSS-in-JS](https://ant-design.antgroup.com/docs/blog/css-in-js-cn)
  - [动态样式去哪儿了？](https://ant-design.antgroup.com/docs/blog/hydrate-cssinjs-cn)
  - [定制主题](https://ant-design.antgroup.com/docs/react/customize-theme-cn)

## 改动七：组件库版本`2.1.8` + 修改主题变量中的一个基础变量

**【描述】**

1026 下午的代码 + 降级 `2.1.9` 版本 `supcond2` 到 `2.1.8`版本 + 修改主题变量中的一个基础变量（如下）。

```ts
// addLocale.tsx
import { ConfigProvider, theme } from "@supcon/supcond2";

return (
  <ConfigProvider
    theme={{
      token: {
        colorError: "d12a2b",
      },
      algorithm: theme.compactAlgorithm,
    }}
    locale={localeCode === "zh-CN" ? zh_CN : en_US}
  />
);
```

**【打包结果】**

打包成功

**【92 测试结果】**

- 结果：趋势 A 和趋势 B 中的 CSS 类的哈希值成功变化。

  - 通过在`useCacheToken.js`中打断点，能够发现生成的 hash 是`.css-1up75t3`。
  - 随即发现，趋势 A 和趋势 B 中的 CSS 类的哈希值都是`.css-1up75t3`。

- **结论：通过修改主题变量来改变 CSS 类的哈希值确实是可以的**。
  - 由于 hash 是由`主题变量 + antd版本`生成的。即只有修改了主题变量或者改变了 `antd` 的版本，哈希值才会变化。
  - `hash = theme token + version`
  - 这两个变量，对于目前趋势的`SSPA`和`Control`两种打包方式来说，是一样的，所以二者生成的哈希值也会相同。
- 期望目标：
  - **只要在业务代码`addLocale`组件中获取到当前的打包方式，一种处理主题变量，另一种不处理，就可以让两种打包方式生成的哈希值不一样**。

## 改动八：组件库版本`2.1.8` + `SSPA`模式修改主题变量中的一个基础变量

**【描述】**

1026 下午的代码 + 降级 `2.1.9` 版本 `supcond2` 到 `2.1.8`版本 + 如下：

业务代码中，国际化高阶组件中，根据不同打包方式来决定业务代码中是否修改`theme.token`某个属性（这个属性不重要，且值仅仅修改最后一个字母，从"d12a21"修改成"d12a2b"，但是可以达到生成 hash 值变化的目的。）。`SSPA`集成模式才修改，`Control`独立模式不修改。

**【改动】**

```ts
// are-trend-web\config\webpack.config.sspa.js
new DefinePlugin({
  "process.env.API_ASSETS": JSON.stringify(process.env.API_ASSETS),
  // sspa模式注入个变量，给addLocale组件使用
  "process.env.is_SSPA": JSON.stringify(true),
});
```

```ts
// are-trend-web\src\control\runtime\components\addLocale\index.tsx
const isSSPA = process.env.is_SSPA;

return (
  <ConfigProvider
    theme={{
      ...(isSSPA
        ? {
            token: {
              colorError: "d12a2b",
            },
          }
        : {}),
      algorithm: theme.compactAlgorithm,
    }}
    locale={localeCode === "zh-CN" ? zh_CN : en_US}
  />
);
```

**【打包结果】**

打包成功

**【打包文件大小】**

- `SSPA`集成模式，打包出的`trend`文件如下：

```shell
# `xx\webapps\trend`

22.index.js               7KB
22.index.js.map           21KB
745.index.js              218KB
745.index.js.map          1335KB
index.js                  1788KB
index.js.map              5024KB
```

- `Control`独立模式，打包出的`control-shapes-trend`文件如下：

```shell
# `xx\webapps\common\control-shapes-trend`

# 从static/js下文件命名及大小可以看出，好像是config.control.js中两种打包模式（umd 和 system）的输出文件。大小一模一样
static/js
   280.0a775fbe.chunk.js  449KB
   280.0a775fbe.chunk.js.map  2157KB
   280.28a0a2fe.chunk.js  449KB
   280.28a0a2fe.chunk.js.map  2157KB

   ResExplor.9977cd8f.chunk.js 6KB
   ResExplor.9977cd8f.chunk.js.map 16KB
   ResExplor.a0a4df14.chunk.js 6KB
   ResExplor.a0a4df14.chunk.js.mpa 16KB

asset-manifest.json       1KB
icon.jpg                  7KB
index.css                 396KB
index.html                1KB
index.js                  3418KB
index.js.LICENSE.txt      3KB
index.js.map              11701KB

indexSpa.css              396KB
indexSpa.js               3418KB
indexSpa.js.LICENSE.txt   3KB
indexSpa.js.map           11700KB

manifest.json             1KB
preview-icon.png          7KB
robots.txt                1KB
```

**【92 测试结果】**

- 结果：趋势 A 中的 CSS 类的哈希值成功变化。

  - 【趋势 A 中目标`select`】

    - css 哈希类是`css-1up75t3`。
    - 通过点击 style，发现样式来源是：`<style data-rc-order="prependQueue" data-css-hash="1o4uke1" data-token-hash="143o3p7">:where(.css-1up75t3)[class^="supcon2-select"] ...... </>`

  - 【趋势 B 中目标`select`】

    - css 哈希类是`css-1vvfk0s`。
    - 通过点击 style，发现样式来源是：`<style data-rc-order="prependQueue" data-css-hash="12na8bi" data-token-hash="1o0db83">:where(.css-1vvfk0s)[class^="supcon2-select"] ...... </style>`

  - **关闭趋势 B 后，趋势 A 中样式依然正常。即这种思路（根据不同打包方式来决定业务代码中是否修改修改主题变量中的一个基础变量）是对的**。

**【92 测试又发现新问题】**

- 描述：**但是又发现了个问题，基座应用中的`左侧-工作区-请搜索`的 `Select`（`.left-wrap-search`）的样式丢失了**，从`元素`查看，其 css 类 hash 值是`css-1vvfk0s`。即跟趋势 B 中的 css 类 hash 值一样了。所以 B 关闭后销毁了 `<style />` 后，框架中的`supcond2`组件的样式会丢失。

- 疑问：为什么`基座中的组件的 CSS 类的哈希值` 跟趋势 B 中组件的 CSS 类的哈希值一样，还是因为`hash = theme token + version`
  - 虽然基座`package.json`是`"@supcon/supcond2": "2.1.9"`，但估计用的还是`root-config/`下的 2.1.8 版本。`(http://xxx.xxx.x.92/root-config/supcond2@2.1.8/supcond2/dist/@supcon/supcond2.min.js)`
  - 基座的`theme token`配置如下，跟目前趋势中`Control`独立模式打包时的`theme token`配置一样。

```ts
// mare-basic-web\src\root.component.tsx
<ConfigProvider
  theme={{
    algorithm: theme.compactAlgorithm,
  }}
  locale={lang !== "zh-CN" ? enUS : zhCN}
/>
```

- **如何解决这个问题？**
  - 目前是`SSPA`集成模式修改了主题变量中的一个基础变量，其 hash 值会变得跟`2.1.8`版本的默认 hash 值不一样。
  - 所以应该改成`SSPA`集成模式用默认的主题变量，而`Control`独立模式去修改`theme.token`某个属性，这样就能保证趋势 B 中的 hash 值跟趋势 A 中的 hash 值不一样，趋势 B 中的 hash 值跟基座中的组件的 hash 值也不一样了。
    - 方法一：在`config.control.js`中注入变量，给 addLocale 组件使用
      - 结果：在`config.control.js`中注入变量不行，好像是被`config.cra.js`中的`DefinePlugin`配置给覆盖了，还要涉及到`getClientEnvironment()?.stringified`，太麻烦了，不用这种了
    - 方法二：当前的`config.sspa.js`中注入变量逻辑不变，业务代码改成`process.env.is_SSPA`为 true，则使用默认主题，为 false 则修改主题变量中的一个基础变量即可
      - **改动九最终使用这种，最简单省事**。

## 改动九：组件库版本`2.1.8` + `Control`模式修改主题变量中的一个基础变量

**【描述】**

1026 下午的代码 + 降级 `2.1.9` 版本 `supcond2` 到 `2.1.8`版本 + 如下改动

**【改动】**

```js
// are-trend-web\config\webpack.config.sspa.js
{
      plugins: [
      new ProvidePlugin({
        process: 'process/browser'
      }),
      new DefinePlugin({
        'process.env.API_ASSETS': JSON.stringify(process.env.API_ASSETS),
        // sspa模式注入个变量，给addLocale组件使用
        'process.env.IS_SSPA': JSON.stringify(true)
      })
    ],
}
```

```tsx
// are-trend-web\src\control\runtime\components\addLocale\index.tsx

import { ConfigProvider, theme } from "@supcon/supcond2";

console.log("theme.defaultSeed", theme.defaultSeed);

const modeIsSSPA = process.env.IS_SSPA;

console.log("process.env.IS_SSPA", modeIsSSPA);

// antd 5.0后采用cssinjs，组件有样式类：`css-hash值`。hash值是在应用加载时，根据 antd版本 + 主题变量 计算得到。即 只有修改了主题变量或者改变了antd版本，hash值才会变化。
// sspa模式下默认主题。control模式下 修改一个主题变量（且变化很小，colorError从默认值'd12a2a'修改成'd12a2b'）
// 使得control模式打包后的supcond组件的hash值 跟sspa模式打包的不一样，从而解决基座中AI面板弹窗中趋势tab关闭后，因为hash值一样而引起的基座中的趋势组件样式丢失的问题。

const handledThemeToken = modeIsSSPA
  ? {}
  : {
      colorError: "d12a2b",
    };

function addLocale(Component: ComponentType<P>) {
  return (
    <ConfigProvider
      theme={{
        token: handledThemeToken,
        algorithm: theme.compactAlgorithm,
      }}
      locale={localeCode === "zh-CN" ? zh_CN : en_US}
    />
  );
}
```

**【打包结果】**

打包成功

**【打包文件大小】**

- `SSPA`集成模式，打包出的`trend`文件如下：

```shell
# `xx\webapps\trend`

22.index.js               7KB
22.index.js.map           21KB
745.index.js              218KB
745.index.js.map          1335KB
index.js                  1787KB
index.js.map              5024KB
```

- `Control`独立模式，打包出的`control-shapes-trend`文件如下：

```shell
# `xx\webapps\common\control-shapes-trend`

# 从static/js下文件命名及大小可以看出，好像是config.control.js中两种打包模式（umd 和 system）的输出文件。大小一模一样

static/js
   280.0a775fbe.chunk.js  449KB
   280.0a775fbe.chunk.js.map  2157KB
   280.28a0a2fe.chunk.js  449KB
   280.28a0a2fe.chunk.js.map  2157KB

   ResExplor.9977cd8f.chunk.js 6KB
   ResExplor.9977cd8f.chunk.js.map 16KB
   ResExplor.a0a4df14.chunk.js 6KB
   ResExplor.a0a4df14.chunk.js.mpa 16KB

asset-manifest.json       1KB
icon.jpg                  7KB
index.css                 396KB
index.html                1KB
index.js                  3418KB
index.js.LICENSE.txt      3KB
index.js.map              11701KB

indexSpa.css              396KB
indexSpa.js               3418KB
indexSpa.js.LICENSE.txt   3KB
indexSpa.js.map           11700KB

manifest.json             1KB
preview-icon.png          7KB
robots.txt                1KB
```

**【74 测试结果】** （因为 92 在重装 omc）

- 结果：趋势 A 中的 CSS 类的哈希值成功变化。

  - 【趋势 A 中目标`select`】

    - css 哈希类是`css-1vvfk0s`。
    - 通过点击 style，发现样式来源是：`<style data-rc-order="prependQueue" data-css-hash="12na8bi" data-token-hash="1o0db83">:where(.css-1vvfk0s)[class^="supcon2-select"] ...... </style>`

  - 【趋势 B 中目标`select`】

    - css 哈希类是`css-1up75t3`。
    - 通过点击 style，发现样式来源是：`<style data-rc-order="prependQueue" data-css-hash="1o4uke1" data-token-hash="143o3p7">:where(.css-1up75t3)[class^="supcon2-select"] ...... </>`

  - **关闭趋势 B 后，趋势 A 中样式依然正常。基座中的组件样式也正常，问题成功解决**。

**【92 测试结果】**

同 74 测试结果。

## 改动十：组件库版本`2.1.9` + `Control`模式修改主题变量中的一个基础变量

**【描述】**

1026 下午的代码 + 恢复`supcond2`版本到`2.1.9` + 如改动九的改动

**【打包结果】**

打包成功

**【打包文件大小】**

- `SSPA`集成模式，打包出的`trend`文件如下：

```shell
# `xx\webapps\trend`

22.index.js               7KB
22.index.js.map           21KB
745.index.js              218KB
745.index.js.map          1335KB
index.js                  1787KB
index.js.map              5024KB
```

- `Control`独立模式，打包出的`control-shapes-trend`文件如下：

```shell
# `xx\webapps\common\control-shapes-trend`

# 从static/js下文件命名及大小可以看出，好像是config.control.js中两种打包模式（umd 和 system）的输出文件。大小一模一样

static/js
   280.0a775fbe.chunk.js  449KB
   280.0a775fbe.chunk.js.map  2157KB
   280.28a0a2fe.chunk.js  449KB
   280.28a0a2fe.chunk.js.map  2157KB

   ResExplor.9977cd8f.chunk.js 6KB
   ResExplor.9977cd8f.chunk.js.map 16KB
   ResExplor.a0a4df14.chunk.js 6KB
   ResExplor.a0a4df14.chunk.js.mpa 16KB

asset-manifest.json       1KB
icon.jpg                  7KB
index.css                 396KB
index.html                1KB
index.js                  3420KB
index.js.LICENSE.txt      3KB
index.js.map              11706KB

indexSpa.css              396KB
indexSpa.js               3420KB
indexSpa.js.LICENSE.txt   3KB
indexSpa.js.map           11705KB

manifest.json             1KB
preview-icon.png          7KB
robots.txt                1KB
```

**【92 测试结果】**

同改动九的 74、92 测试结果。只是趋势 B 的哈希类的哈希值变成了`css-mnz3mt`。

## 测试记录二

- **浏览器新标签页打开基座主应用，还没有登录，更没有打开趋势 A，就已经加载`trend`和
  `control-shapes-trend`了。因为能发现国际化高阶组件`addLocale`组件外页面顶部的打印**。（1027 日 1120 发现）
  - 且因为在`webpack.config.sspa.js`中的`DefinePlugin`插件中注入的变量`process.env.is_SSPA`。所以在趋势业务代码中的国际化高阶组件`addLocale`中打印`process.env.is_SSPA`变量，由于两种不同打包方式，`SSPA`集成模式能读取到`process.env.is_SSPA`变量，`Control`独立模式则不能。如下面的打印。
  - 疑是趋势还没有去渲染，业务代码没有执行，但是代码已经准备好了，其依赖的常量环境也准备好了。

```bash
# 基座主应用刚刷新完，还没有打开趋势 A，控制台打印如下：


# 是`SSPA`集成模式`trend`中打印的，文件路径 `webpack://trend-web/./src/control/runtime/components/addLocale/index.tsx`
theme.defaultSeed
> { blue: '#2A54D1', purple: '#722ED1'， cyan: '#13C2C2', green: '#52C41A', ...}
process.env.IS_SSPA > true


# 是`Control`独立模式`control-shapes-trend`中打印的，文件路径 `http://xxx.xxx.x.92/common/control-shapes-trend/control/runtime/components/addLocale/index.tsx
sdf `
theme.defaultSeed
> { blue: '#2A54D1', purple: '#722ED1'， cyan: '#13C2C2', green: '#52C41A', ...}
process.env.IS_SSPA > undefined

```

```tsx
import { ConfigProvider, theme } from "@supcon/supcond2";

console.log("theme.defaultSeed", theme.defaultSeed);
console.log("process.env.IS_SSPA", process.env.IS_SSPA);

function addLocale(Component: ComponentType<P>): ComponentType<P> {
  return function AddLocale(props: P) {
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

## **【关键路径信息】**

- 一：从`问题描述二`及其结论，让我推测出是`Control`独立模式的按需加载导致的 bug。即【排查思路一：1023】，所以才有后续的改动一到改动六的测试验证。

  - 虽然现在看，这条思路是走错了，但是在当时情况下是个值得去尝试的思路。

- 二：从`测试记录一-记录二`的现象，让我得出结论。

  - **结论：css 哈希类的哈希值不是打包时随机生成的，而是打包时根据某种规则生成的**
  - 现在看，这个结论对了一半，确实是根据某种规则生成的，但是不是在打包时候生成的。

- 三：从`测试记录一-1016-1020 74 环境`的现象，让我得出结论。

  - **结论：源代码中搜索 css 哈希类的哈希值没有搜到，说明哈希值不是打包时候就生成好的，而是运行时候生成的**。
  - 现在看，这个结论是正确的。但是当时没有跟`关键路径信息二的结论`结合起来，否则就能得出正确结论了：`css 哈希类的哈希值是运行时根据某种规则生成的`

- 四：从`测试记录一1023 92 环境`现象，让我把注意力从按需加载转移到了 css 哈希类的哈希值上面。

  - **结论：`supcond2`升级版本后会生成新的哈希值，同样每次打包的哈希值也一样**。
  - 现在看，这个结论是正确的。

- 五：一筹莫展之际，**偶然想到去`Antd`官网查询样式 hash 值相关信息**。结果还真找到了。`【排查思路二：1026】`

  - 这种毫无思路之时偶然想到的，只能说误打误撞。
  - 合理的分析应该是：此 bug 是`supcond2`样式导致的，且跟哈希值有关，而`supcond2`又是封装的`Antd`，那么应该早早就去`Antd`官网查询样式 hash 值相关信息。
  - 2022 年 1118 发布 `Antd` 5.0 版本后， `Antd`的 CSS 就采用了`CSS-in-JS`方案
    - **每一个组件的样式在相同的主题变量和相同的版本下是不会改变的。反过来说，只有修改了主题变量，或者改变了 antd 的版本，样式才可能会变化**
    - **Token + Version => Hash**

- 六：从`改动七`现象
  - **结论：通过修改主题变量来改变 CSS 类的哈希值确实是可以的**。

## **收获**

- 一：**如何监听`<style>`标签是怎么移除的？**

  - 通过目标`select`的 css 哈希类，找到目标`<style>`标签，右键`发生中断的条件-移除节点`（作用就是监测这个 style 节点，如果该节点要被删了，会在`源代码-执行的地方`打个断点，即可以知道是什么地方的什么代码导致的该节点被删除。）。

- 二：**拉取代码中若包含了`package.json`中依赖或者依赖版本的变化。需要重新`Yarn`**，不然会跟最新代码的依赖或依赖版本不一致，导致意想不到的问题。

- 三：**如何在业务代码中读取到代码要执行的环境，即环境是`SSPA`集成模式还是`Control`独立模式？**
  - `Webpack`提供的`DefinePlugin`插件，可以注入变量，即打包处理业务代码之前注入变量，给业务代码使用。

## DQ 提供的方案

**【描述】**

询问 DQ 后，他给了个方案：手写个插件，将源码中的`css-hash` 替换为自定义的字符串（如下面的`css-supcon2-${type}`）。但是 trend 每次 hash 值变化后，都需要通过这个插件手动修改下面文件中的 hash 值。

**【结果】**

尝试过这种方案，没有用。**原因是`css-hash`不是在源码中的（在`control-shapes-trend`中搜不到，只能搜到`useCacheToken`等 api），而是根据`hash = theme token + version`在应用加载时候生成的**，通过对`http://xxx.xxx.x.92/common/node_modules/@ant-design/cssinjs/es/hooks/useCacheToken.js`文件中的生成 hash 处打断点发现的。

还有`http://xxx.xxx.x.92/common/node_modules/@supcon/supcond2/lib/theme/internal.js`中的` hashId = _ref2[1];`

**【方案改动】**

```js
// are-trend-web\config\modifyCssStyleSelectors.js

// const manifest = require('../src/public/manifest.json');
// const type = manifest.shapeType;
const type = "Trend";

class ModifyCssStyleSelectors {
  apply(compiler) {
    console.log("修改样式选择器名");
    compiler.hooks.emit.tap("ModifyCssStyleSelectors", (compilation) => {
      for (const name in compilation.assets) {
        if (name === "index.js") {
          console.log("enter");
          const content = compilation.assets[name].source();
          // const changeSelectorName = content.replace(/supcon2/g, `supcon2-${type}`);
          // console.log('content', content) 打印出来好像都是源码
          const changeSelectorName = content.replace(
            /css-1vvfk0s/g,
            `css-supcon2-${type}`
          );
          compilation.assets[name] = {
            source: () => changeSelectorName,
            size: () => changeSelectorName.length,
          };
          // console.log(changeSelectorName)
        }
      }
    });
  }
}

module.exports = {
  ModifyCssStyleSelectors,
};
```

```tsx
// are-trend-web\config\webpack.config.control.js

const {
  ModifyCssStyleSelectors
} = require('./modifyCssStyleSelectors');

{
  plugins: [
    isEnvProduction &&
    new MiniCssExtractPlugin({
      filename: 'indexSpa.css',
      chunkFilename: 'indexSpa.chunk.css',
    }),
    // isEnvProduction && new ModifyCssStyleSelectors(),
  ].filter(Boolean),
}

```

## 询问 GPT

**【询问 ChatGpt：一】**

> Q：React 项目，组件库用的是公司自己基于 antd 封装的一个组件库 A，web 端 chrome 元素中查看组件库 A 中的组件，发现 select 组件等都有个 `css-hash值` 的类，这个`css-hash值`是怎么生成的，哪里生成的，可以更改嘛

A：

在 React 项目中，CSS 模块化是一种常见的做法。当你使用组件库 A 时，它可能会使用 CSS 模块化来生成唯一的类名，以避免样式冲突。

css-hash 值 是由 CSS 模块化系统自动生成的散列值。这个散列值是根据 CSS 文件的内容计算得出的，**通常使用工具或构建过程在编译时生成。每次重新构建项目时，生成的散列值都会发生变化，这样可以确保每个类名都是唯一的**。

如果你希望更改这些 css-hash 值 类名的生成方式，你**需要查看组件库 A 的源代码，找到相关的构建配置或工具，并进行相应的修改。然而，请注意，更改生成的类名可能会导致样式冲突或其他问题**。所以在进行任何更改之前，最好先评估潜在的影响并进行充分的测试。

**【询问 ChatGpt：二】**

> Q：style: true：启用了样式导入功能。这意味着在导入库时，将同时导入相关的样式文件。 这句话什么意思，如果设置 style 为 false，有什么区别？

A：当将 style 设置为 true 时，Webpack 将在导入库时同时导入相关的样式文件。这意味着，如果库包含了与之关联的样式文件，那么这些样式文件也会被自动加载和应用到项目中。

如果将 style 设置为 false，则不会自动导入和应用与库关联的样式文件。这意味着你需要手动处理这些样式文件的导入和应用，例如通过在项目中显式地引入样式文件或使用其他方式进行样式加载和管理。

因此，**设置 style 为 true 表示自动处理库的样式导入和应用，而设置为 false 则需要手动处理样式文件的导入和应用**。

> Q：style 还能设置成什么值

A：style 可以设置为以下几种值：

- `true`：启用样式导入功能，即在导入库时同时导入相关的样式文件。
- `false`：禁用样式导入功能，不会自动导入和应用与库关联的样式文件。
- `"css"`：仅导入与库关联的 CSS 样式文件，而不包括其他类型的样式文件（如 Sass、Less 等）。
- `"less"`：仅导入与库关联的 Less 样式文件，而不包括其他类型的样式文件。
- `"sass"`：仅导入与库关联的 Sass 样式文件，而不包括其他类型的样式文件。
- `"stylus"`：仅导入与库关联的 Stylus 样式文件，而不包括其他类型的样式文件。

根据需要，可以选择适当的值来配置样式导入功能。

## 备注

**【代码中备注如下】**

antd 5.0 后采用 cssinjs，组件有样式类：`css-hash值`。hash 值是在应用加载时，根据 antd 版本 + 主题变量 计算得到。即 只有修改了主题变量或者改变了 antd 版本，hash 值才会变化。

sspa 模式下默认主题变量。control 模式下 修改一个主题变量（且变化很小，colorError 从默认值'#d12a2a'修改成'#d12a2b'）。

使得 control 模式打包后的 supcond 组件的 hash 值 跟 sspa 模式打包的不一样，从而解决基座中 AI 面板弹窗中趋势 tab 关闭后，因为 hash 值一样而引起的基座中的趋势组件样式丢失的问题。

## 总结

- 原因：趋势 B，在关闭 AI 面板弹窗时，由于样式的按需加载，会把 B 中已经加载的组件对应的样式给清除，而 趋势 A 和 趋势 B 中组件的哈希类的 hash 值又一样，这就会导致关闭 AI 面板弹窗后，趋势 A 中的组件的样式丢失。

- 修改思路：修复后，`SSPA`集成模式 和 `Control`独立模式设置不同的主题变量，即 趋势 B 中样式的 hash 值跟 趋势 A 中的样式 hash 值不一致了。这样即使 AI 面板弹窗关闭，也不会对趋势 A 中样式产生影响。

- 测试结果：修复后在 1.92（1027 安装的新包）上和 1.74（1006 安装的 0926 的包）上都测试过了。样式丢失问题没再出现过。
