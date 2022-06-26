# 问题

## 问题一： dispatch 派发 action 却没有执行 effects

**【问题描述】：**
`RecipeEditorWeb`项目`src\pages\login\index.tsx`组件中点击登录调用`user`model 中的`effect`方法`*tryLogin`，能成功执行，且把登录信息（`info`和`permission`）放到`model`和`localStorage`中。但是`src\layout\Account.tsx`组件中点击退出登录调用同一个 model 中的`effect`方法`*logout`，`*logout`方法中的字符串（记为`Str`）却没有打印，即没有执行到方法里面。

最新发现：`Str`时能打印，时不能打印，

- 未登录时：`localStorage`中也没有`info`和`permission`字段，点击退出登录（去掉了登录页不显示菜单和退出登录的逻辑），`Str`能正常打印。
- 然后点击登录，成功登录并保存登录信息，
  - 此时点击退出登录，没有打印`Str`。
  - 然后手动清除`localStorage`中的登录信息，点击退出登录，没有打印`Str`，（此时`model`中的登录信息还在应该）
  - 刷新页面，此时会走一个从`storage`取登录信息更新`model`登录信息的逻辑，并跳转到登录页，此时点击退出登录，`Str`能正常打印。

**【分析过程思路】：**

- 写法语法问题：`Account`组件`dispatch`调用`effects`语法格式不对、`*logout`写法有问题。但都仔细查过，没有问题，排除。
- `Account`组件没有放到`pages`下：改变路径放到 pages 下面测试，任然不打印，排除。
- **点击登录后的报错引起**：登录页点击登录后走了一个`// 认证用户 let ydRes: any = yield call(authenticate);`的逻辑，但是这个接口`/Authenticate/Debug`不需要调且没有配置代理，所以报错了，报错信息如下所示，**因此我在这块逻辑外面加了一个`try {} catch() {}`，结果`Str`能正常打印了**！！！！，所以这个问题估计是报错后影响了`dispatch`调用`effects`中的`*logout`，但是为啥此时点击登录却能正确调用`*tryLogin`呢？很是奇怪。暂时先不管了，`*logout`能正常调用了就行。

```js
// 调用接口`/Authenticate/Debug`报错信息如下
POST http://localhost:8000/Authenticate/Debug 401 (Unauthorized)

devScripts.js:6523 Error: Request failed with status code 401
    at createError (createError.js:16)
    at settle (settle.js:17)
    at XMLHttpRequest.onloadend (xhr.js:66) 'error'


devScripts.js:6523 uncaught at \_callee3 at \_callee3
at \_callee7
at takeEvery
at \_callee
at \_callee
Error: Error: Request failed with status code 401
```

```js
// 包裹一层try catch后报错信息如下
xhr.js:210 POST http://localhost:8000/Authenticate/Debug 401 (Unauthorized)

Error: Request failed with status code 401    devScripts.js:6523
    at createError (createError.js:16)
    at settle (settle.js:17)
    at XMLHttpRequest.onloadend (xhr.js:66) 'error'

devScripts.js:6523 Error: Request failed with status code 401
    at createError (createError.js:16)
    at settle (settle.js:17)
    at XMLHttpRequest.onloadend (xhr.js:66)
```
