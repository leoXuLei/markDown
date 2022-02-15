# 实例：localStorage 本地数据缓存功能

只能缓存字符串，所以要缓存对象或者数组需要用 JSON.stringify(xx)转为字符串，是取出来用时用 JSON.parse()转为对象或数组。

```js
setItem("key", value); // 存
getItem("key"); // 取
removeItem("key"); // 移除

LocalStorage.setItem("key", value); //value必须是字符串，
LocalStorage.getItem("key");
LocalStorage.removeItem("key");
```

localStorage 封装的工具方法

```js
// xxx/utils/localStorage.js

const Storage = {};

// 获取
Storage.getItem = key => {
  return window.localStorage.getItem(`${STORE_PREFIX}_${key}`);
};

// 设置
Storage.setItem = (key, value) => {
  return window.localStorage.setItem(`${STORE_PREFIX}_${key}`, value);
};

// 删除
Storage.removeItem = key => {
  window.localStorage.removeItem(`${STORE_PREFIX}_${key}`);
};

export Storage;
```
