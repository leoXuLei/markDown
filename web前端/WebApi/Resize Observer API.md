# 介绍

`Resize Observer API` 提供了一种高性能的机制，通过该机制，代码可以监视元素的大小更改，并且每次大小更改时都会向观察者传递通知。

# 使用实例

## 实例一

具体使用如下，根据需求可配合`useDebounce`使用。

```tsx
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useMemoizedFn } from "ahooks";
import { useDebounce } from "../hooks";
import { SingleObj } from "../utils/types";

// 动态获取dom元素变化

type _scrollAttr = Pick<
  HTMLElement,
  "scrollTop" | "scrollHeight" | "scrollLeft" | "scrollWidth"
>;
type _styleAttr = Pick<HTMLElement, "style">;

type _offsetAttr = Pick<
  HTMLElement,
  "offsetHeight" | "offsetLeft" | "offsetTop" | "offsetWidth"
>;

type _htmlAttr = Partial<_scrollAttr & _styleAttr & _offsetAttr>;

type TObserverAttrType = keyof _htmlAttr;

type _setObserverNodeFunc = (target: Element) => void;

/**
 * 当监听元素宽高时变化时,如果子元素内容也是变化的,需要防止循环刷新
 * @param observerAttrs
 * @returns [_htmlAttr | null, _setObserverNodeFunc]
 */

console.log("useNode :>> _attr :>> 重新计算");

export default function useNodeResizeObserver(
  observerAttrs: TObserverAttrType[]
): [_htmlAttr | null, Function] {
  const _refElemnt = useRef<_htmlAttr | null>(null as any);
  const [_v, _setV] = useState<any>(null);

  const observerAttrsRef = useRef<TObserverAttrType[]>(observerAttrs);

  const resizeObserverCb = useMemoizedFn((entries: ResizeObserverEntry[]) => {
    let domEle = entries[0].target as HTMLElement;
    let _obj = observerAttrsRef.current.reduce(
      (pre: SingleObj<any>, next: TObserverAttrType) => {
        if (next in pre) {
          return pre;
        }
        pre[next] = domEle[next];
        return pre;
      },
      {}
    );
    _refElemnt.current = _obj;
    _setV(Date.now());
  });

  const resizeObserverCbDebounce = useDebounce(resizeObserverCb, 300);

  const resizeObserver = useMemo(() => {
    return new ResizeObserver(resizeObserverCbDebounce);
  }, []);

  const handleObserverNode: _setObserverNodeFunc = (node) => {
    if (node !== null) {
      resizeObserver.observe(node);
    }
  };

  useEffect(() => {
    return () => {
      resizeObserver.disconnect();
      _refElemnt.current = null;
    };
  }, [resizeObserver]);

  const latestObserverAttrs: _htmlAttr | null = useMemo(() => {
    if (_refElemnt.current) {
      return JSON.parse(JSON.stringify(_refElemnt.current));
    }
    return {};
  }, [_refElemnt.current]);

  return [latestObserverAttrs, handleObserverNode];
}
```

```tsx
const ProcessProcedure: FC<IProcessProcedureProps> = () => {
  const _sizeRef = useRef<HTMLElement>(null);

  const [observerAttrs, handleObserverNode] = useNode([
    "offsetWidth",
    "offsetHeight",
  ]);

  useEffect(() => {
    if (_sizeRef?.current) {
      _ref(_sizeRef.current);
    }
  }, []);

  // 设置画布尺寸
  const _size = useMemo(() => {
    return {
      width: ~~Math.max(observerAttrs?.offsetWidth || 0, 800),
      // 因为配方详情高度固定，所以直接用右侧Tab区域高度减去Tab头高度
      height: ~~Math.max((observerAttrs?.offsetHeight || 0) - 56, 100),
    };
  }, [_observerAttrsel]);

  return (
    <Layout.Content id="procedureRightContent" ref={_sizeRef}>
      <TabsController>
        <SFCEditor />
      </TabsController>
    </Layout.Content>
  );
};
```

# 参考链接

- [JavaScript API ResizeObserver 使用示例](https://www.jb51.net/article/255896.htm)
- [一个较新的 JavaScript API——ResizeObserver 的使用](https://juejin.cn/post/6862321554686214158)
