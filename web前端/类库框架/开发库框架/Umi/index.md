## 如何引入全局的静态依赖

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

## umi api

```ts
// useSelector：以hooks 的方式获取部分数据
// 类似于model中的effects中的 const dogServState: IDogState = yield select((_: any) => _.dogServ);
// 不需要connect高阶组件连接Model即可获取到Model中的state
const dogServState = useSelector((_: any) => _.dogServ);

// dispatch同样也能通过useDispatch以hooks的方式获取使用dispatch
```
