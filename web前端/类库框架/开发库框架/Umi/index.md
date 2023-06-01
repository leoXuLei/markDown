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

umi 内置 umi，配置开启即可使用。

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
