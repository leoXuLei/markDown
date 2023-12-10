# 趋势 SSPA 集成模式下剥离`supcond`

## 需求描述

趋势 SSPA 集成模式（即在基座中通过子菜单打开的趋势）使用的`supcond`依赖库，从之前使用的通过`package.json`安装的`@supcon/supcond2`依赖库，改成使用基座父应用中的`@ecsnext/supcond`，即：`'@supcon/supcond2': '@ecsnext/supcond'` 。也就是说希望趋势 SSPA 集成模式打包时不把`@supcon/supcond2`组件库打包进`index.js`。

如何验证需求是否完成：查看`yarn build:runtime-sspa`打包后的源码，看是否包含 `supcond` 下的组件的样式，不包含就对了。

- 815 开始做，0823 提交代码

## 已知

- 一：`@ecsnext/utils`其返回的是各种对象 Api，在趋势项目中使用如下。趋势`SSPA集成模式`和`Control独立应用模式`两种打包方式的配置中，`externals `中始终包含了`@ecsnext/utils`，也就是说真正执行时，如果是`SSPA集成模式`即作为子应用，能获取到基座父应用中的`@ecsnext/utils`，能调用其下 Api，这样就不会去从`storage`中取数据了；如果是`Control独立应用模式`，获取不到`@ecsnext/utils`，转而使用`storage`中的数据去兜底。

```ts
// @ts-ignore
import * as basic from "@ecsnext/utils";

export const GLOBAL_CONFIG = {
  locale: () => {
    return (
      basic?.api?.i18n?.getLocale?.() ||
      getStorageItem("basic_locale") ||
      "zh-CN"
    );
  },

  loginTime: () => {
    return (
      basic?.utils?.getLocalLoginTime?.() ||
      getStorageItem("basic_login_time") ||
      Date.now()
    );
  },
};
```

- 二：而`supcond2` 是个类似 `Antd` 的库，需要用到其中的组件。

- 三：如果 DQ 不将基座父应用中的`@supcon/supcond2`改成别名`@ecsnext/supcond`，直接在趋势 SSPA 集成模式的 webpack 打包配置文件`webpack.config.sspa.js`中改动即可：`externals`中添加`@supcon/supcond2`。

- 四：但是现在 DQ 已经改别名了，该如何处理呢？

  - 通过 alias 别名来给`@supcon/supcond2`命名为`@ecsnext/supcond`？

## 参考资料

**【 Webpack `外部扩展Externals` 配置】**

`externals`配置选项提供了[**从输出的 bundle 中排除依赖**]的方法。**相反，所创建的 bundle 依赖于那些存在于用户环境中的依赖**。**此功能通常对 library 开发人员来说是最有用的**，然后也会有各种各样的应用程序用到它。

**防止将某些`import`的包（package）打包到 bundle 中，而是在运行时（runtime）再去从外部获取这些扩展依赖（external dependencies）**

**使用`externals`来提取这些依赖包，其实应该说用`externals`来防止这些依赖被打包**。

`externals`的值是个对象。其中 key 是第三方依赖的名称，同`package.json`文件中的`dependencies`对象的 key 一样。其中 value 值可以是字符串、数组、对象。

> 按我的理解 value 值应该是`第三方依赖编辑打包后生成的js文件，然后js文件执行后赋值给window的全局变量名称`。

## `【0823 SSPA 集成模式打包剥离supcond改动记录】`

### `初始状态：5990K`

**【SSPA 打包后的文件信息】**

- SSPA 集成模式打包文件中`trend\index.js` 大小为 5990K，`index.js.map` 大小为 19011K。
  - 这是做剥离`supcond`之前，107/92 机器上下一代 trend 目录中的文件大小，包是 0815 之前的包
  - `22.24`上的下一代是 0626 的包，打包文件中`trend\index.js` 大小为 5549K，`index.js.map` 大小为 17876K。
  - **可以发现到不到两个月，打包文件`trend\index.js` 大小新增了 441K，`index.js.map` 大小新增了 1135K。`trend\index.js` 大小越来越大达到了 5.85M，猜测这也是为什么 SSPA 集成模式需要剥离`supcond`和资源选择器的原因**。

**【SSPA 打包后的文件源码分析】**

- 搜索 `Radio`（匹配大小写）能搜索到 23 处，如下：

```js
genComponentStyleHook)("Radio", (e=>{

var Vf = Xo("Radio", (e=>{
  const {lineWidth: t
  t.default = t.RadioGroupContextProvider = void 0;

f.default)(!("optionType"in e), "Radio", "`optionType` is only support in Radio.Group.")
displayName = "Radio",
  g.defaultProps = {
      type: "radio"
  };
  var v = g;
  t.default = v

```

- 搜索 `DatePicker`（匹配大小写），能搜索到 73 处，且有`supcond2` 下各组件的语言配置，如下：

```js
$(
  d.createElement(x.default, {
    componetName: "DatePicker",
    defaultLocal: y.default,
  })
);
```

```js
s = {
  locale: "zh-cn",
  Pagination: o.default,
  DatePicker: a.default,
  TimePicker: i.default,
  Calendar: l.default,
  global: {
    placeholder: "请选择",
  },
  Table: {
    filterTitle: "筛选",
    filterConfirm: "确定",
    filterReset: "重置",
    selectAll: "全选当页",
    selectInvert: "反选当页",
    selectNone: "清空所有",
    selectionAll: "全选所有",
    // xxx
  },
  Popconfirm: {
    cancelText: "取消",
    okText: "确定",
  },
};
```

- 搜索 `locale:`（匹配大小写），能搜索到 246 处，且发现了 `supcond2` 的语言包（`locale: "zh_CN"、"locale: "ja_JP"、locale: "en_US"` 等）。如下：

```js
{
  87388: function(e, t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }),
    t.default = void 0;
    t.default = {
        locale: "zh_CN",
        today: "今天",
        now: "此刻",
        backToToday: "返回今天",
        ok: "确定",
        timeSelect: "选择时间",
        dateSelect: "选择日期",
        clear: "清除",
        month: "月",
        year: "年",
        // xxx
    }
},

8163: function(e, t) {
      "use strict";
      Object.defineProperty(t, "__esModule", {
          value: !0
      }),
      t.default = void 0;
      t.default = {
          locale: "en_US",
          today: "Today",
          now: "Now",
          backToToday: "Back to today",
          ok: "Ok",
          timeSelect: "select time",
          dateSelect: "select date",
      }
  },
}
```

### 改动一：改用正则 + `alias` 别名 + 去掉按需加载：2566K

**【before】**

- 改用正则之前，`external`中一直测试用的是`externals: ["@supcon/supcond2"]`，即使用的是字符串，但是打包出的文件大小始终没有减小且源文件中依然能搜索到组件 api。
  - 为此耽误好几天。直到我在 webpack 官网`externals`的文档中看到有正则的写法，且 打印了`SSPA.config.js`文件中的`defaultConfig.externals`。其值如下：`externals: ["single-spa", /^@ecsnext\//, "react", "react-dom"];`。才想到要用正则的写法试试看。一试果然是正确的。

**【描述】**

- `webpack.config.sspa`中的按需加载`@supcon/supcond2` 去掉，不然 external 的是`@supcon/supcond2/lib/modal` 等 20 个组件。

**【改动】**

- 代码改动参考`0823提交时的版本`。

**【SSPA 打包后的文件信息】**

- SSPA 集成模式打包文件中`trend\index.js` 大小为 2566K，`index.js.map` 大小为 7009K。

**【SSPA 打包后的文件源码分析】**

- `yarn start:runtime-sspa`打包文件：搜索`'@supcon/supcond2'`  共 114 处，搜索`@ecsnext/supcond`  共 2 处。

- `yarn build:runtime-sspa`打包文件：

  - 搜索`'@supcon/supcond2'`  共 0 处，
  - 搜索`@ecsnext/supcond`  共 1 处，
  - 搜索`supcon`共 37 处（其中`.supcon2-` 14 个，正则`supcon(?!2)`搜索到 23 个）。其中包含项目中覆盖的 supcon 代码（`.supcon2-input-group-addon {}`）

- 搜索 `Radio`（匹配大小写）能搜索到 18 处，如下：

```js
case "radioSelect":
    return d.createElement(Zt.Radio.Group, ao({
        disabled: o,
        onBlur: a
    }, i), r.map((function(e) {
        return d.createElement(Zt.Radio, {
            key: e.value,
            value: e.value,
            disabled: e.disabled
        }, e.name)
    }
    )));
```

- 搜索 `DatePicker`（匹配大小写），能搜索到 4 处。且没搜到 `supcond2` 下各组件的语言配置。如下：

```js
 case "DatePicker":
    return d.createElement(Io, ao({
        disabled: o,
        onBlur: a
    }, i));
```

- 搜索 `locale:`（匹配大小写），能搜索到 6 处，且发现了 `table` 相关 API。如下：

```js
(Zt.ConfigProvider, Object.assign({
      theme: {
          algorithm: Zt.theme.compactAlgorithm
      },
      locale: Zt.default
  }

var t = e.resType
  , r = e.selection
  , n = e.pagination
  , o = e.radio
  , a = e.manager
  , i = e.currentPropName
  , l = e.hasCommonProp
  , s = e.onShowSizeChange
  , c = e.isSearchMode
  , p = e.loading
  , u = e.onSelectionChange
  , d = e.onPaginationChange
  , h = e.externalTableProps
  , g = {
    indentSize: 16,
    pagination: T(T({}, n), {
        showSizeChanger: !0,
        locale: {
            items_per_page: "每页行数",
            prev_page: "上一页",
            next_page: "下一页",
            prev_5: "向前5页",
            next_5: "向后5页"
        },
        onShowSizeChange: s,
        size: "small"
    }),
    locale: {
        filterConfirm: "确定",
        filterReset: "重置",
        emptyText: c ? "无匹配数据" : "无内容"
    },
    loading: p,
    rowKey: "id",
    rowClassName: function(e) {
        var t, n = !l(i, null === (t = a.resEntityMap[e.id]) || void 0 === t ? void 0 : t.propType);
        return (o ? r.includes(e.id) ? "show-checkbox" : "" : "show-checkbox") + " " + (n ? "row-disabled" : "")
    },
```

**【92 测试结果】**

- 结果：能正常运行。加载趋势没有报错，趋势运行也没有报错。

### 改动二：再注释导出的组件 `openResExplorer`：1720K

**【描述】**

- `src\control\runtime\components\index.tsx`中导出的`./ResExplorer` 给注释掉，因为是老版的资源选择器，很久都没用过了，且目前只在`components`中导出，没有被引用。

**【改动】**

- 代码改动参考`0823提交时的版本`。如下：

```diff
// src\control\runtime\components\index.tsx

- import openResExplorer from './ResExplorer';

export {
# xxx
-  openResExplorer,
# xxx
}
```

```tsx
// src\control\runtime\components\ResExplorer\index.tsx

import { message } from "@supcon/supcond2";
// ！引入了依赖"@fusionsite/res-explorer"下的Api
import { ResExplorer, ModelServiceProvider } from "@fusionsite/res-explorer";
// ！引入了依赖"@fusionsite/res-explorer" 下的接口
import { IDataProvider } from "@fusionsite/res-explorer/lib/interface";
import { ADDRESS, GLOBAL_CONFIG } from "@/common/constant";
import { tagIsString } from "@R/utils/util";

interface IResExplorerParams {
  radio?: boolean;
  dataProvider?: IDataProvider;
  basePath?: string;
  isAppDev?: boolean;
}

const modelService = new ModelServiceProvider();
const openResExplorer = async (args: IResExplorerParams, t?: any) => {
  const { dataProvider, radio, basePath } = args;
  modelService.baseAgentURL = ADDRESS.modelServer();
  modelService.baseModelURL = ADDRESS.modelServer();
  modelService.fetchOptions = {
    headers: {
      token: GLOBAL_CONFIG.token() || "",
    },
  };
  const modelBasePath = basePath || "";
  const res = await ResExplorer.open({
    dataProvider: dataProvider || modelService,
    value: { resType: "var", res: [], isRelative: false },
    radio,
    useDefault: true,
    options: { var: true },
    basePath: modelBasePath,
  });
  if (res?.res?.length) {
    return res.res.reduce((pre, item) => {
      const {
        propType,
        resType,
        resName,
        displayItem,
        raw: { desc, modelId, extProperty, decimal },
      } = item;
      // 过滤字符串位号
      if (tagIsString(propType)) return pre;
      const urv = extProperty?.urv || 100;
      const lrv = extProperty?.lrv || 0;
      pre.push({
        desc,
        type: propType,
        tagName: `${resType}://${displayItem}`,
        unit: extProperty?.unit || "",
        urv,
        lrv,
        decimal: decimal || 2,
      });
      return pre;
    }, []);
  }
  message.warning(t?.("至少选择一个位号"));
  return null;
};

export default openResExplorer;
```

**【SSPA 打包后的文件信息】**

- SSPA 集成模式打包文件中`trend\index.js` 大小为 1720K，`index.js.map` 大小为 5653K。

**【SSPA 打包后的文件源码分析】**

- `yarn build:runtime-sspa`打包文件：
  - 搜索 `Radio`（匹配大小写）能搜索到 16 处，如下：
  - 搜索 `DatePicker`（匹配大小写），能搜索到 6 处。
  - 搜索 `locale:`（匹配大小写），能搜索到 4 处，没搜到 zh_CN 和 en_US
  - 搜索`'@fusionsite/res-explorer'`的 api：`ModelServiceProvider` 和 `ResExplorer`。
    - 搜索 `ModelServiceProvider`  共 0 处，搜索 `ResExplorer` 共 6 处（6 处是因为字符串 includes）

**【92 测试结果】**

- 结果：能正常运行。加载趋势没有报错，趋势运行也没有报错。

### 改动三：再 `external` 中加上 `dayjs`：1700K

**【描述】**

- 改动原因：为了解决资源选择器中选完位号后，打开底部时间轴上的`datePicker` 报错的问题。
  - 报错如下：

```bash
ERROR
e.weekday is not a function
TypeError: e.weekday is not a function
    at Object.getWeekDay (http://xxx.xxx.1.92/root-config/supcond2@2.1.6/supcond2/dist/@supcon/supcond2.min.js:2:811230)
    at Yd (http://xxx.xxx.1.92/root-config/supcond2@2.1.6/supcond2/dist/@supcon/supcond2.min.js:2:830540)
    at ct (http://xxx.xxx.1.92/root-config/react-dom@17.0.2/umd/react-dom.production.min.js:2:43415)
    at http://xxx.xxx.1.92/root-config/react-dom@17.0.2/umd/react-dom.production.min.js:2:30158
```

**【解决】**

- 思路一：尝试 `externals`数组加上 `'moment'`，
  - 结果：没有效果，依然报同样错误。
- 思路二：尝试 `externals`数组加上 `'dayjs'`
  - 结果：底部时间轴上的`datePicker` 不再报错，问题解决。

### 改动四：再删除依赖`@fusionsite/res-explorer`，再安装`react-sortable-hoc` 1704K

**【描述】**

- 改动原因：
  - 改动二中只是注释，还没有删除依赖。
  - `react-sortable-hoc`是依赖`@fusionsite/res-explorer`需要的依赖，删除依赖`@fusionsite/res-explorer`后，`react-sortable-hoc`也跟着删除了，但是`趋势分屏`页面的`表格行拖动供功能`使用到了`react-sortable-hoc`，所以需要重新安装下（`dependencies`）。

**【SSPA 打包后的文件信息】**

- SSPA 集成模式打包文件中`trend\index.js` 大小为 1704K，`index.js.map` 大小为 5601K。

### 期间报错

```bash
// 92 报错 : e Error: Cannot find module '@supcon/supcond2/lib/message'

// 92 报错 : e Error: Unable to resolve bare specifier '@supcon/supcond2'，
# 表示在你的代码中，存在一个裸露的模块规范（bare specifier）'@supcon/supcond2'，而 webpack 无法解析它
```

## `【0823 提交时的版本】`

- 下面是 webpack 配置中的`defaultConfig.externals`，值如下：

  ```js
  externals: ["single-spa", /^@ecsnext\//, "react", "react-dom"];
  ```

- 上述提交版本，`yarn build-runtime -sspa`打包后的文件，模块替换到 92 环境，是可以正常运行的，但是`yarn start-runtime -sspa`配合直接修改 92 环境的`import.json` 的`"@ecsnext/trend-web": "http://xxx.xxx.1.26:8080/index.js",`，此时 92 上打开趋势，会报错如下：
  - 即趋势应用没法像基座应用一样，直接本地起一个服务，供 92 环境`直连本地最新编译后代码`来预览调试。

```bash
92 上打开趋势，报错：parcel 'parcel-2' died in status SKIP_BECAUSE_BROKEN: Cannot read properties of undefined (reading 'setExtraStackFrame')
```

```diff
// config\webpack.config.sspa.js

module.exports = (webpackConfigEnv, argv) => {
  return merge(defaultConfig, {
    resolve: {
      alias: {
        // xxx
+       "@supcon/supcond2": isExternalSupcond
+         ? "@ecsnext/supcond"
+         : "@supcon/supcond2",
      },
    },
+    externals: [
+      "dayjs",
+      // /^@supcon\/supcond2/,
+      function (ctx, callback) {
+        if (/^@supcon\/supcond2/.test(ctx?.request)) {
+          console.log("ctx?.request", ctx?.request);
+          if (ctx?.request !== "@supcon/supcond2") {
+            console.log("ctx", ctx);
+          }
+
+          // 方式1：采用这种
+          return callback(null, "@ecsnext/supcond");
+
+          // 方式2：
+          // return callback(null, '@ecsnext/supcond' + ctx?.request?.substring?.(16));
+
+          // 方式3：跟方式1是一个意思，yarn build的包加载后在92效果跟方式1也一样
+          // return callback(null, {
+          //     commonjs: '@ecsnext/supcond',
+          //     commonjs2: '@ecsnext/supcond',
+          //     amd: '@ecsnext/supcond',
+          //     root: '@ecsnext/supcond',
+          //     system: '@ecsnext/supcond',
+          // });
+        }
+        callback();
+      },
+    ],
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          use: [
            {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
+                // 按需加载@supcon/supcond2去掉，不然external的是@supcon/supcond2/lib/modal等20个组件
+                // getCustomTransformers: () => ({
+                //   before: [
+                //     tsImportPluginFactory({
+                //       libraryName: '@supcon/supcond2',
+                //       libraryDirectory: 'lib',
+                //       style: false
+                //     })
+                //   ]
+                // }),
                compilerOptions: {
                  module: "es2015",
                  target: "es2015",
                },
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
  });
};
```

**【SSPA 打包后的文件源码分析】**

- ps：下面的搜索是 20231206 晚上，在 152 环境`chrome-sources`加载的 `trend/index.js`中搜索的。此时的包是测试 1030 安装的包，也就是说还没有做`fix: 335259 sspa打包只external掉supcond2的组件，而过滤掉国际化信息`功能。

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
  function (t, e) {...}
);
```

---

- 搜索 `Radio`（匹配大小写）能搜索到 8 处，其中一处如下：

```js
{
  children: (0, o.jsx)(
    "div",
    Object.assign(
      {
        className: "".concat(Ap, "-body"),
      },
      {
        children: (0, o.jsx)(
          ki.Radio.Group,
          Object.assign(
            {
              size: "large",
              onChange: function (t) {
                d(t.target.value);
              },
              value: l,
            },
            {
              children: Np.map(function (t) {
                return (0, o.jsx)(
                  ki.Radio,
                  Object.assign(
                    {
                      className: "".concat(Ap, "-body-radio"),
                      value: t,
                    },
                    {
                      children: r("trend.reset.".concat(t)),
                    }
                  ),
                  t
                );
              }),
            }
          )
        ),
      }
    )
  );
}
```

- 搜索 `DatePicker`（匹配大小写），能搜索到 2 处，如下：

```js
var LI = ki.DatePicker.RangePicker;
var iI = ki.DatePicker.RangePicker;
```

- 搜索 `locale:`（匹配大小写），能搜索到 2 处。如下：

```js
{
locale: function() {
    var t, e, n;
    return (null === (n = null === (e = null === (t = null == a ? void 0 : a.api) || void 0 === t ? void 0 : t.i18n) || void 0 === e ? void 0 : e.getLocale) || void 0 === n ? void 0 : n.call(e)) || d("basic_locale") || "zh-CN"},
}

Cn.creationData = function() {
    return {
        input: this._i,
        format: this._f,
        locale: this._locale,
        isUTC: this._isUTC,
        strict: this._strict
        }
    }

Object.assign({
    theme: {
        algorithm: ki.theme.compactAlgorithm
    },
    locale: ki.default
}, {})
```

## **【关键路径信息】**

- 一：刚开始接到这个需求，LD 就有跟我提到：趋势`SSPA集成模式`打包时将`supcond2`给`external`掉即可。
  - 如参考资料-官网描述，`配置external`的作用是：子应用打包时把某些依赖过滤掉，转而使用主应用环境中的依赖，甚至可以配置依赖的映射，即依赖不同名也行。本需求就是这样子。
- 二：如`改动一：before`所述，因为使用的是字符串形式：`externals: ["@supcon/supcond2"]`，**但是因为该依赖名称带有反斜杠，字符串形式没法解析，导致效果失败。因此耽误了好几天都在做无用功**。

## **收获**

- 一：**如何实现子应用打包时把某些依赖过滤掉，转而使用主应用环境中的依赖？**

  - 使用 webpack 配置中的`external`。
  - `external`配置，**若依赖名称带有反斜杠，字符串形式没法解析，只能使用正则或者`function`形式**。

- 二：接一，子应用打包时把某些依赖（名称是 A）过滤掉，转而使用主应用环境中的依赖（名称是 B）。A 和 B 依赖虽然是同一个东西，但是名称不一样，如何正确映射上？

  - **使用`resolve.alias`配置别名 + `external`写成`function`形式**

- 三：**没有理论、文档、参考资料的支持时，某个思路一直测试不成功，，几个小时没有进展，就不要再测了，测了也是无用功**。
  - 不如转而再去看文档、参考资料，尝试下其他思路、方向、途径。

## 其它

- 一：总结

  > 一：基座中打开的趋势是以`SSPA子应用（集成）模式`被打包，文件是`trend`文件夹，打包`external`掉了 `@supcon/supcond2`组件库。
  >
  > 二：趋势以`Control独立应用模式`被打包，文件是`control-shapes-trend`文件夹，打包没有 `external` 掉 `@supcon/supcond2`组件库。

- 二：DQ 后面说框架只是临时把依赖名称从`@supcon/supcond2`改为`@ecsnext/supcond`，后续还会再改回来。

  - 如何应对：
    - 所以后续需要将 alias 别名新增的那行去掉，然后`return callback(null, '@ecsnext/supcond');`改为`return callback(null, '@supcon/supcond2');`
    - 或者直接 `externals` 数组新增正则 `/^@supcon\/supcond2/`

# `SSPA剥离supcond和资源选择器`改动前后打包文件信息记录

## 一：`22.24` 做`SSPA剥离supcond`之前 08/15 20:26 提交点的打包文件大小

**【SSPA 打包后的文件信息】**

- SSPA 集成模式打包文件中`trend\index.js` 大小为 5989KB，`index.js.map` 大小为 19014KB。

- `trend` 文件夹（大小为 24.5M）下文件大小如下：

```shell
# webapps\trend

index.js                  5989KB
index.js.map              19014KB
```

- `control-shapes-trend` 文件夹（大小为 49.4M）下文件大小如下：

```shell
# webapps\common\control-shapes-trend

asset-manifest.json       1KB
icon.jpg                  1KB
index.css                 326KB
index.html                1KB
index.js                  5800KB
index.js.LICENSE.txt      3KB
index.js.map              19179KB

indexSpa.css              326KB
indexSpa.js               5800KB
indexSpa.js.LICENSE.txt   3KB
indexSpa.js.map           19173KB

manifest.json             1KB
preview-icon.png          5KB
robots.txt                1KB
```

## 二： `22.24` 做`SSPA剥离supcond`之后的打包文件大小

- 备注：`SSPA剥离supcond`功能只有一次提交（记为 B），即：`0823 提交时的版本`，但是在这次提交之前有一个提交（记为 A）：`feat: 集成模式下使用框架中的资源选择器`。如何跳过 A 的提交，只看提交 B 后的打包文件。
  - 解决：在做`SSPA剥离supcond`之前 08/15 20:26 提交点，新建分支并`git cherry-pick`只把提交 B 拉到当前分支。然后重新`yarn`，再重新打包即可。

**【SSPA 打包后的文件信息】**

- SSPA 集成模式打包文件中`trend\index.js` 大小为 1703KB，`index.js.map` 大小为 5594KB。

- `trend` 文件夹（大小为 7.22M）下文件大小如下：

```shell
# webapps\trend

index.js                  1703KB
index.js.map              5594KB
```

- `control-shapes-trend` 文件夹（大小为 35.7M）下文件大小如下：

```shell
# webapps\common\control-shapes-trend

asset-manifest.json       1KB
icon.jpg                  1KB
index.css                 326KB
index.html                1KB
index.js                  3871KB
index.js.LICENSE.txt      3KB
index.js.map              14095KB

indexSpa.css              326KB
indexSpa.js               3871KB
indexSpa.js.LICENSE.txt   3KB
indexSpa.js.map           14094KB

manifest.json             1KB
preview-icon.png          5KB
robots.txt                1KB
```

## 三： `22.24` 做`SSPA剥离资源选择器`之前的打包文件大小

- 备注：此时刚做完`SSPA剥离supcond`，所以直接看`记录三：做`SSPA 剥离 supcond`之后的打包文件大小`即可

## 四：`22.24` 做`SSPA剥离资源选择器`之后的打包文件大小

**【SSPA 打包后的文件信息】**

- SSPA 集成模式打包文件中`trend\index.js` 大小为 1489KB，`index.js.map` 大小为 4290KB。

- `trend` 文件夹（大小为 7.37M）下文件大小如下：

```shell
# webapps\trend

#（1489KB + 237KB + 7KB）= 1733KB
22.index.js               7KB
22.index.js.map           19KB
148.index.js              237KB
148.index.js.map          1403KB
index.js                  1489KB
index.js.map              4290KB
```

- `control-shapes-trend` 文件夹（大小为 36.4M）下文件大小如下：
  - 可以发现 `index.css/js/js.map` 与 `indexSpa.css/js/js.map` 的大小基本一样。（只有.map 差了 1kb）

```shell
# webapps\common\control-shapes-trend

asset-manifest.json       1KB
icon.jpg                  1KB
index.css                 329KB
index.html                1KB
index.js                  3310KB
index.js.LICENSE.txt      3KB
index.js.map              11463KB

indexSpa.css              329KB
indexSpa.js               3310KB
indexSpa.js.LICENSE.txt   3KB
indexSpa.js.map           11462KB

manifest.json             1KB
preview-icon.png          5KB
robots.txt                1KB
```
