# `Effect`

## useUpdateEffect

用法等同于 useEffect，但是会忽略首次执行，只在依赖更新时执行。

# `Function`

## `useMemoizedFn`

开始用`ahooks`的`useMemoizedFn`来替换 useCallback，不需要再纠结各种依赖的问题了。提高不少效率。

## `useDebounceFn`

```tsx
import { useDebounceFn } from "ahooks";

const { run: testDebounceFn } = useDebounceFn(
  () => {
    setNumValue((prev) => prev + 1);
  },
  {
    wait: 500,
    // leading: 是否在延迟开始前调用函数（即先触发一次，wait时间之内触发不成功，之外就会成功）， 默认为false。
    leading: true,
    // trailing: 是否在延迟开始后调用函数， 默认为true。如果为false，无论怎么点击，始终不会触发了
    trailing: true,
  }
);
```

# `Dom`

## `useKeyPress`

**【描述】**

监听键盘按键，支持组合键，支持按键别名。

# 参考链接

- [aHook 官网-useMemoizedFn](https://ahooks.js.org/zh-CN/hooks/use-memoized-fn)
