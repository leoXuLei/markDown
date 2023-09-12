# Umi Api

## dynamic

动态加载组件（umi3）。

**常见使用场景**：**组件体积太大，不适合直接计入 bundle 中，以免影响首屏加载速度**。例如：某组件 HugeA 包含巨大的实现 / 依赖了巨大的三方库，且该组件 HugeA 的使用不在首屏显示范围内，可被单独拆出。这时候，dynamic 就该上场了。

**为什么使用 dynamic**：封装了使用一个异步组件需要做的状态维护工作，开发者可以更专注于自己的业务组件开发，而不必关心 code spliting、async module loading 等等技术细节。

通常搭配 [动态 import 语法](https://github.com/tc39/proposal-dynamic-import) 使用。


**【使用示例】**


封装一个异步组件

```tsx
import { dynamic } from 'umi';

export default dynamic({
  loader: async function () {
    // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
    const { default: HugeA } = await import(
      /* webpackChunkName: "external_A" */ './HugeA'
    );
    return HugeA;
  },
});
```

使用异步组件

```tsx
import React from 'react';
import AsyncHugeA from './AsyncHugeA';

// 像使用普通组件一样即可
// dynamic 为你做:
// 1. 异步加载该模块的 bundle
// 2. 加载期间 显示 loading（可定制）
// 3. 异步组件加载完毕后，显示异步组件
export default () => {
  return <AsyncHugeA />;
};
```
# Umi 配置

## `Hash`

配置是否让生成的文件包含 hash 后缀，通常用于增量发布和避免浏览器加载缓存。

启用 hash 后，产物通常是这样，ps: html 文件始终没有 hash。

```bash
+ dist
  - logo.sw892d.png
  - umi.df723s.js
  - umi.8sd8fw.css
  - index.html
```

# 如何引入全局的静态依赖

```js
// src\pages\document.ejs
<script src="<%= context.config.publicPath %>xlsx.full.min.js"></script>
// 并将静态文件放至public\xlsx.full.min.js
```

# **Umi 配置使用 dva**

## 配置开启

umi 内置 umi，配置开启即可使用。（umi3）

```ts
// config\config.ts
export default defineConfig({
  // ...
  dva: {
    hmr: true,
    // 表示是否启用immer以方便修改reducer
    immer: true,
  },
  // ...
  alias: {
    "@page": resolve("src/pages"),
    "@layout": resolve("src/layout"),
    "@components": resolve("src/components"),
    "@utils": resolve("src/utils"),
    "@xhr": resolve("src/xhr"),
    "@theme": resolve("src/theme"),
    "@assets": resolve("src/assets"),
  },
  routes,
  proxy,
});
```

## 新建 model

```ts
// src\models\user.ts

interface IUserState {
  name?: string;
  friends?: string[];
}

interface IUserAction<T> {
  type: string;
  payload: T;
}

interface IUserModel {
  namespace: "user";
  state: IUserState;
  reducers: {
    // 启用immer之后
    setUserData: ImmerReducer<IUserState, IUserAction<IUserState>>;
  };
  subscriptions: { setup: Subscription };
}

const UserModel: IUserModel = {
  namespace: "user",
  state: {
    name: "xl",
    friends: ["a", "b", "c", "d"],
  },
  reducers: {
    setUserData(state: IUserState, action: IUserAction<IUserState>) {
      const { payload } = action;
      console.log("setUserData payload", payload);
      // 启用immer之前更新state写法：必须返回一个新的
      // return { ...state, ...payload };

      // 启用immer之后更新state写法: immer写法
      state.friends.push(...payload.friends);
      state.name = state.name + payload.name;
    },
  },
  effects: {
    // 认证用户身份
    // eslint-disable-next-line complexity
    *authUser(
      { payload }: IUserAction<UserAuthState>,
      { put, call, select }: any
    ): any {
      // @ts-ignore
      const user: Object = yield select((_) => _.user);
    },
    // 获取storage中的用户信息（userinfo & permission）
    *getUserInfo({ payload }: any, { put, call }: any): any {
      const storageUserInfo: any = window.localStorage.getItem("info") || 0;
      const storagePermission: any =
        window.localStorage.getItem("permission") || 0;
      if (storageUserInfo !== 0 && storagePermission !== 0) {
        try {
          let storageUserObj = JSON.parse(storageUserInfo);
          let permissionObj = JSON.parse(storagePermission);
          yield put({
            type: "setUserInfo",
            payload: {
              ...storageUserObj,
              permission: permissionObj,
            },
          });
          return Object.keys(storageUserObj).length;
        } catch (error) {
          console.error(error);
          return 0;
        }
      }
      return 0;
    },
    *tryLogin({ payload }: any, { put, call }: any): any {
      // console.log(payload);
      let resp: IBasicApi = yield call(userLogin, payload);
      if (resp.Code !== 0) return Promise.reject(resp.Message || "登录失败");
      let userInfo = resp.Data;
      return yield put({
        type: "getPermission",
        payload: {
          ...userInfo,
        },
      });
    },
  },
  subscriptions: {
    setup(arg: setUpArg) {
      let { history, dispatch } = arg;
      return history.listen(({ pathname }) => {
        dispatch({
          type: "authUser",
          payload: {
            pathname,
            history,
          },
        });
      });
    },
  },
};

export default UserModel;
```

## 组件使用 model 中的 state、派发 action

观察 React 开发者工具，`useEffect`打印正常，点击更新`state`后也能发现`state`正常更新。

```tsx
import React, { useEffect } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import { connect } from "umi";
import { useMemoizedFn } from "ahooks";

const Login = (props) => {
  const { user } = props;

  const changeUserState = useMemoizedFn(() => {
    // 第一种修改方法
    // props?.dispatch?.({
    //   type: 'user/setUserData',
    //   payload: {
    //     name: 'yongnian',
    //     friends: ['1', '4'],
    //   },
    // });

    props?.changeUserData?.({
      name: "yongnian",
      friends: ["A", "c"],
    });
  });

  useEffect(() => {
    console.log("user :>> ", JSON.parse(JSON.stringify(user)));
  }, [user]);

  return (
    <div>
      <Button onClick={changeUserState}>修改model中的user数据</Button>
    </div>
  );
};

function mapStateProps(state: any) {
  return {
    user: state.user,
    loading: state.loading?.models?.user,
  };
}

function mapActionProps(dispatch: any) {
  return {
    changeUserData: (payload: any) => {
      return dispatch({
        type: "user/setUserData",
        payload,
      });
    },
  };
}

// export default Login;
export default connect(mapStateProps, mapActionProps)(Login);
```

## Umi Dva 相关 api

```ts
// useSelector：以hooks 的方式获取部分数据
// 类似于model中的effects中的 const dogServState: IDogState = yield select((_: any) => _.dogServ);
// 不需要connect高阶组件连接Model即可获取到Model中的state
const dogServState = useSelector((_: any) => _.dogServ);

// dispatch同样也能通过useDispatch以hooks的方式获取使用dispatch
```

## 问题

### `effects` 中使用 `yield call/put` 当请求 Promise 报错后，后续不会再走了

**【问题描述】**

如下，循环调用获取狗状态接口。但是只要获取狗状态接口返回 403 之后，就不会再循环调用了。

**【问题原因】**

原因是如果 yield call 调用的是一个 Promise 对象，那只有在 Promise 返回的是 resolve 情况下，下面跟着的 yield put 及后面的代码才会执行，若返回了 reject 则后面的代码不会执行。并且再次 dispatch 也无效。

**【解决方法】**

用 `try catch` 包裹 `yield` 语句即可解决。

```tsx
const fetchRecipeEditorDogRight = useMemoizedFn(() => {
  props?.fetchRecipeEditorDogRight?.();
  dogRightTimerRef.current = setTimeout(() => {
    fetchRecipeEditorDogRight();
  }, 1000 * 5);
});

function mapActionProps(dispatch: any) {
  return {
    fetchRecipeEditorDogRight: () => {
      dispatch({
        type: 'dogServ/fetchRecipeEditorDogRight',
      });
    },

  };
}

*fetchRecipeEditorDogRight({ payload }: any, { call, put }: any): any {
  try {
    const recipeEditorDogRightRes = yield call(getRecipeEditorDogRight, {
      ...payload,
    });
    yield put({
      type: 'setDogRightInfo',
      payload: {
        dogRightInfo: recipeEditorDogRightRes,
      },
    });
  } catch (error) {
    console.log('error', error);
  }
}


```

# **国际化功能**

**【umi 配置】**
（umi3）

```jsx
export default defineConfig({
  locale: {
    default: "zh-CN", // 默认语言，当检测不到具体语言时，展示`default`中指定的语言
    antd: true, // 开启后，支持antd国际化
    title: true, // 标题国际化。在项目中配置的title及路由中的title可直接使用国际化key，自动被转成对应语言的文案
    baseNavigator: true, // 开启浏览器语言检测。默认情况下，当前语言环境的
    // 识别按照：`localStorage`中`umi_locale`值 > 浏览器检测 > default设置的默认语言 > 中文
    baseSeparator: "-", // 国家（lang）与 语言（language）之间的分隔符，默认为'-'
  },
});
```

**【API】**

- getLocale: 获取当前选择的语言
- useIntl: 获得`formatMessage`等 api 来进行具体的值的绑定
- setLocale: 设置切换语言，默认会刷新页面，可以通过设置第二个参数为`false`，来实现无刷新动态切换。

**【使用实例】**

- 多语言文件的内容规范：键-值对组成的字面量

```ts
// src\locales\en-US\menu.ts

export default {
  "actions.exit": "Exit",
};

// src\locales\en-US\common.ts
export default {
  "common.deleteConfirm": 'Are you sure you want to delete the "{name}"?',
};
```

```ts
// src\locales\zh-CN\menu.ts

export default {
  "actions.exit": "退出",
};

// src\locales\zh-CN\common.ts
export default {
  "common.deleteConfirm": '确定要把 "{name}" 删除吗？',
};
```

```ts
// src\locales\en-US.ts
import menu from "./en-US/menu";
import common from "./en-US/common";
export default {
  ...menu,
  ...common,
};
```

```ts
// src\locales\zh-CN.ts
import menu from "./zh-CN/menu";
import common from "./zh-CN/common";
export default {
  ...menu,
  ...common,
};
```

```tsx
import { getLocale, setLocale, useIntl } from "umi";

const Account = (props: any) => {
  const { user = "" } = props.user;
  const history = useHistory();
  const { formatMessage } = useIntl();

  const [language, setLanguage] = useState(getLocale() === "zh-CN");

  const handleChangeLan = useMemoizedFn(() => {
    setLocale(language ? "en-US" : "zh-CN", false);
    setLanguage((prev) => !prev);
  });

  const modalContent = formatMessage(
    {
      id: "common.deleteConfirm",
    },
    {
      name: "名称", // 配置的语言文本支持传参
    }
  );

  return (
    <div className="Account">
      <span
        onClick={handleChangeLan}
        style={{ cursor: "pointer", marginRight: 15 }}
      >
        {language ? "English" : "中文"}
      </span>
      <span className="exit">
        {formatMessage({
          id: "actions.exit",
        })}
      </span>
    </div>
  );
};
```

**【参考链接】**

- [umi3 插件 国际化](https://v3.umijs.org/zh-CN/plugins/plugin-locale)

# `【问题】`

## umi 设置国际化`locales`后引入`useIntl` Ts 报错没有导出

webClient 项目 umi 3.3 版本，在`defineConfig`配置中设置国际化`locales`后，页面引入`useIntl`等 api，Ts 报错没有导出成员。

**【报错如下：】**

```tsx
import { getLocale, useIntl } from "umi";

// 悬浮报错信息：模块“"umi"”没有导出的成员“useIntl”。ts(2305)
```

**【分析过程：】**

### 思路一: 依赖版本问题：分析`yarn.lock`文件

```bash
# webClient项目 package.json文件
{
  "dependencies": {
        "react": "^17.x", # 之前一直都是初始化项目时的版本 16.13.1，上个月刚升级到^17.x
        "react-dom": "^17.x", # 同上
        "react-intl": "^2.9.0", # 同初始化项目时一样，未变化过
        "react-intl-universal": "2.1.4", # 同上
        "umi": "3.3.0", # 之前一直都是初始化项目时的版本3.2.6，上个月刚升级到3.3.0
    },
}
```

如上，umi 版本和 react 版本最近刚刚升级过，但是`react-intl`的版本没有变化过。

```bash
# webRecipeEditor项目 package.json文件
{
  "dependencies": {
    "antd": "^4.23.0", # 之前一直都是初始化项目时的版本^4.19.5，我升级过一次
    "react": "17.x", # 初始化项目时的版本
    "react-dom": "17.x", # 初始化项目时的版本
    "umi": "^3.5.21", # 初始化项目时的版本
  }
}
```

如上，webRecipeEditor 项目我从 0 到 1 搞过国际化，没有问题，所以去`yanr.lock`文件看下国际化插件`@umijs/plugin-locale`的依赖情况。如下`@umijs/plugin-locale@0.15.1`的依赖`react-intl`的期望版本为`3.12.1`，然后去`node_modules`中看实际安装的`react-intl`的版本，发现是`{ "name": "react-intl", "version": "3.12.1"`, 就是期望的版本`3.12.1`，所以 webRecipeEditor 项目的国际化配置后正常。

```bash
# webRecipeEditor项目 yanr.lock文件
{
"@umijs/plugin-locale@0.15.1":
  version "0.15.1"
  resolved "http://192.168.1.xx:xx/@umijs%2fplugin-locale/-/plugin-locale-0.15.1.tgz#xxx"
  integrity xxxxx
  dependencies:
    "@ant-design/icons" "^4.1.0"
    "@formatjs/intl-pluralrules" "^1.5.0"
    "@formatjs/intl-relativetimeformat" "^4.5.7"
    intl "1.2.5"
    moment "^2.29.1"
    react-intl "3.12.1" # !!!
    warning "^4.0.3"


react-intl@3.12.1:
  version "3.12.1"
  resolved "http://192.168.1.xx:xx/@umijs%2fplugin-locale/-/plugin-locale-0.15.1.tgz#xxx"
  integrity xxxxx
  dependencies:
    "@formatjs/intl-displaynames" "^1.2.0"
    "@formatjs/intl-listformat" "^1.4.1"
    "@formatjs/intl-relativetimeformat" "^4.5.9"
    "@formatjs/intl-unified-numberformat" "^3.2.0"
    "@formatjs/intl-utils" "^2.2.0"
    "@types/hoist-non-react-statics" "^3.3.1"
    "@types/invariant" "^2.2.31"
    hoist-non-react-statics "^3.3.2"
    intl-format-cache "^4.2.21"
    intl-messageformat "^7.8.4"
    intl-messageformat-parser "^3.6.4"
    shallow-equal "^1.2.1"
}
```

再去看 webClient 项目的`yanr.lock`文件看下国际化插件`@umijs/plugin-locale`的依赖情况。如下，`"@umijs/plugin-locale@0.9.0"`的依赖`react-intl`的期望版本为`3.12.0`。

```bash
# webClient项目 yanr.lock文件
{
"@umijs/plugin-locale@0.9.0":
  version "0.9.0"
  resolved "http://192.168.1.xx:xx/@umijs/plugin-locale/-/plugin-locale-0.9.0.tgz#xxxx"
  integrity xxx
  dependencies:
    "@ant-design/icons" "^4.1.0"
    "@formatjs/intl-pluralrules" "^1.5.0"
    "@formatjs/intl-relativetimeformat" "^4.5.7"
    intl "1.2.5"
    moment "2.x"
    react-intl "3.12.0" # !!!
    warning "^4.0.3"
}
```

但是在`yanr.lock`文件中的`react-intl`却有两个版本信息，如下代码。

```bash
react-intl@3.12.0:
  version "3.12.0"
  resolved "http://192.168.1.xx:xx/@umijs/plugin-locale/-/plugin-locale-0.9.0.tgz#xxxx"
  integrity xxx
  dependencies:
    "@formatjs/intl-displaynames" "^1.2.0"
    "@formatjs/intl-listformat" "^1.3.7"
    "@formatjs/intl-relativetimeformat" "^4.5.7"
    "@formatjs/intl-unified-numberformat" "^3.0.4"
    "@formatjs/intl-utils" "^2.0.4"
    "@formatjs/macro" "^0.2.6"
    "@types/hoist-non-react-statics" "^3.3.1"
    "@types/invariant" "^2.2.31"
    hoist-non-react-statics "^3.3.1"
    intl-format-cache "^4.2.19"
    intl-locales-supported "^1.8.4"
    intl-messageformat "^7.8.2"
    intl-messageformat-parser "^3.6.2"
    shallow-equal "^1.2.1"

react-intl@^2.9.0:
  version "2.9.0"
  resolved "http://192.168.1.xx:xx/@umijs/plugin-locale/-/plugin-locale-0.9.0.tgz#xxxx"
  integrity xxx
  integrity sha1-yXxdF9RxjxV1/b1adp+WAYo7GEM=
  dependencies:
    hoist-non-react-statics "^3.3.0"
    intl-format-cache "^2.0.5"
    intl-messageformat "^2.1.0"
    intl-relativeformat "^2.1.0"
    invariant "^2.1.1"
```

实际安装的到底是哪个版本呢，去`node_modules`中看实际安装的`react-intl`的版本，发现是`{ "name": "react-intl", "version": "2.9.0"`, 不是期望的版本`3.12.0`，所以 webRecipeEditor 项目的国际化配置后引入 api 都会报错。

因此在 webClient 项目升级`react-intl`到目标版本，命令：`yarn upgrade react-intl@3.12.0`。

升级后发现更新了`package.json`和`yarn.lock`文件，`yarn.lock`文件中之前的`react-intl@^2.9.0:`这条信息删除了，只留下了目标版本`react-intl@3.12.0:`的信息。

```bash
react-intl@3.12.0:
  version "3.12.0"
  resolved "http://192.168.1.xx:xx/@umijs/plugin-locale/-/plugin-locale-0.9.0.tgz#xxxx"
  integrity xxx
  dependencies:
    "@formatjs/intl-displaynames" "^1.2.0"
    "@formatjs/intl-listformat" "^1.3.7"
    "@formatjs/intl-relativetimeformat" "^4.5.7"
    "@formatjs/intl-unified-numberformat" "^3.0.4"
    "@formatjs/intl-utils" "^2.0.4"
    "@formatjs/macro" "^0.2.6"
    "@types/hoist-non-react-statics" "^3.3.1"
    "@types/invariant" "^2.2.31"
    hoist-non-react-statics "^3.3.1"
    intl-format-cache "^4.2.19"
    intl-locales-supported "^1.8.4"
    intl-messageformat "^7.8.2"
    intl-messageformat-parser "^3.6.2"
    shallow-equal "^1.2.1"
```

去 webClient 项目中，`node_modules`中实际安装的`react-intl`的版本是`{ "name": "react-intl", "version": "3.12.0"`。

测试如下

- 1. 如下，引入`useIntl`等 Api 依然报错，TS 提示未导出成员，但是打印`useIntl`又是有函数打印出来的，继续测试切换中英文效果如何，点击 sfc 的正常按钮测试发现，切换语言后再打开步节点编辑弹窗语言没有变化但是刷新界面是能够发现语言切换了的，所以推测只是 umi 国际化插件的 api 没有暴露声明，api 是暴露了的，所以 TS 引入报错，但是使用还是正常的。

  ```tsx
  import { getLocale, useIntl, setLocale } from "umi";

  console.log("useIntl", useIntl);

  const [language, setLanguage] = useState(getLocale() === "zh-CN");

  // 正常
  const _zoomNormal = useMemoizedFn(() => {
    setLocale(language ? "en-US" : "zh-CN", false);
    _controllerRef?.current?.zoom(1, { absolute: true });
  });
  ```

- 2. 如下，可以发两个项目的`.umi/plugin-locale/localeExports.ts`文件中导出`xx/node_modules/react-intl`依赖的相关 api 方式不同。一个是`export * from`，另一个是`export { [具体api] } from`。点击 webClient 项目下面代码里面`react-intl`的导出 Api，能找到`useIntl`这个 api，且跟 webRecipeEditor 项目里面代码及结构都一样。

```ts
//  webClient项目 ./src/.umi/plugin-locale/localeExports.ts

export * from "D:/Users/gitlabProjects/vxbatch-web-client/node_modules/react-intl";
```

```ts
//  webRecipeEditor项目 ./src/.umi/plugin-locale/localeExports.ts

export {
  // xxxx
  IntlContext,
  IntlProvider,
  RawIntlProvider,
  createIntlCache,
  defineMessages,
  injectIntl,
  useIntl,
} from "D:/Users/gitlabProjects/vxbatch_recipeeditor/node_modules/react-intl";
```

### 思路二，Ts 报错 umi 没有导出的成员

- 1. 搜索`umi 没有导出的成员xx`问题，发现有提到`tsconfig.json`文件引入的 umi 路径配置。跟项目中的配置比对，发现`{ compilerOptions: { paths: { "@@/*": ["src/.umi/*"] } } }`配置的不一样。修改后 vscode 快捷键`Ctrl + Shift + P`，输入`restart TS server`重启 TS 服务器，发现引入`useIntl`等 api 的 TS 报错消失了。

```diff
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "importHelpers": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "sourceMap": true,
    "baseUrl": ".",
    "strict": true,
    "paths": {
        "@/*": ["src/*"],
        "@components": ["src/components"],
        "@generated": ["generated"],
        "@config": ["config"],
        "@common": ["src/common"],
++    "@@/*": ["src/.umi/*"]
--    "@tmp/*": ["src/.umi/*"]
    },
    "allowSyntheticDefaultImports": true
  },
  "exclude": ["**/node_modules/**"]
}
```

- 2. 修改内容如上 diff 内容，特地全局搜索（包含 node_modules）`@tmp/`，没有找到内容。但是全局搜索（包含 node_modules）`@@/`，能搜索到较多内容，如下所示。

```ts
// vxbatch-web-client\node_modules\@umijs\plugin-layout\src\index.ts
api.addRuntimePlugin(() => ["@@/plugin-layout/runtime.tsx"]);

//vxbatch-web-client\node_modules\@umijs\plugin-layout\src\layout\index.tsx
const _routes = require("@@/core/routes").routes;

// vxbatch-web-client\node_modules\umi\types.d.ts
export * from "@@/core/umiExports";

// node_modules\umi\dist\src\defineConfig.d.ts
import { IConfigFromPlugins } from "@@/core/pluginConfig";

// vxbatch-web-client\node_modules\umi\dist\src\index.d.ts
export * from "@@/core/umiExports";

// vxbatch-web-client\node_modules\umi\lib\defineConfig.d.ts
import { IConfigFromPlugins } from "@@/core/pluginConfig";

// vxbatch-web-client\node_modules\umi\lib\index.d.ts
export * from "@@/core/umiExports";

// vxbatch-web-client\src\.umi\umi.ts
import "@@/core/devScripts";
```

```ts
// 尤其是   vxbatch-web-client\node_modules\umi\types.d.ts
// 中的export * from '@@/core/umiExports';
// 如下，plugin-locale的api导出也是在这里

// vxbatch-web-client\src\.umi\core\umiExports.ts
// @ts-nocheck
export { history } from "./history";
export { plugin } from "./plugin";
export * from "../plugin-dva/exports";
export * from "../plugin-dva/connect";
export * from "../plugin-initial-state/exports";
export * from "../plugin-locale/localeExports";
export * from "../plugin-locale/SelectLang";
export * from "../plugin-model/useModel";
export * from "../plugin-request/request";
export * from "../plugin-helmet/exports";
```

- 3. 查看`tsconfig.json`文件的 File History，发现`"@tmp/*"`是初始化项目时添加的。目前项目编译启动正常，报错问题消失，页面功能正常，`yarn build`打包测试也正常。问题解决。

### 解决总结

先试了思路一的方法，升级了`react-intl`到期望版本，但是报错没有解决。继续尝试思路二，修改`tsconfig.json`文件中的`.umi`文件映射：`"@@/*": ["src/.umi/*"]`，发现报错解决。

**【那么思路一升级`react-intl`到期望版本，对问题的解决是有用的吗？】**

开始测试，降级`react-intl`到之前版本`"2.9.0"`，重启 Ts 服务器并重新编译项目，发现报错问题消失。

发现`yarn.lock`文件中恢复成之前的样子，即两个版本的`react-intl`，`react-intl@2.9.0:`和`react-intl@3.12.0:`。

```ts
import { getLocale, useIntl } from "umi";
```

点击 `useIntl`，发现跳转到`.\node_modules\@umijs\plugin-locale\node_modules\react-intl\lib\react-intl.d.ts`，即使用的`useIntl`是`node_modules`下的`@umijs\plugin-locale`的`node_modules`下的 api，即使用的是依赖`@umijs\plugin-locale`的子依赖`react-intl`中的 api。并不是直接的依赖`./node_modules/react-intl`。

继续测试，升级`react-intl`到期望版本，`yarn.lock`文件中只有一个版本了，`react-intl@3.12.0:`。

点击 `useIntl`，发现跳转到`vxbatch-web-client\node_modules\react-intl\lib\react-intl.d.ts`，即直接使用的`./node_modules/react-intl`。重启 Ts 服务器并重新编译项目，发现报错问题消失。

> **【总结】**

思路一的修改的作用是：从使用的是依赖`@umijs\plugin-locale`的子依赖`react-intl`中的 api 变成 使用的是依赖`react-intl`中的 api，对问题的解决没有影响。思路二才是解决 Ts 报错 `umi 没有导出的成员`的关键所在。

> **【依赖问题】**

`package.json`中的有两个依赖 A 和 B，其中依赖 A 的子依赖中有依赖 B 且期望的依赖 B 版本较高，而`package.json`中依赖 B 的版本较低，此时`yarn`之后`yarn.lock`文件中会出现这两种版本的依赖 B 的信息，较低版本的依赖 B 安装在`./node_modules/B`文件夹，较高版本的依赖 B 安装在【`./node_modules/A/xxx/node_modules/B`文件夹】(FloderA)，即依赖 A 的子依赖中。使用的依赖 A 中的与依赖 B 相关的 api 自然来自于 FloderA。
