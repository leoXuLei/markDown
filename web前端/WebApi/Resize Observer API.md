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

## 实例二：ResizeObserver 选中 Y 轴功能失效

```tsx
componentDidMount() {
  this.resizeObserver = new ResizeObserver(
    debounce(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        console.log('entry.contentRect', entry.contentRect);
        this.handleResize(width, height);
      }
    }, 150)
  );
  if (this.parentElement) {
    this.resizeObserver.observe(this.parentElement);
  }
}
```

ask GPT

Q: entry.contentRect 都有哪些属性

A：

entry.contentRect 是 ResizeObserver 回调函数中的一个参数，它是一个 DOMRectReadOnly 对象，表示被观察元素的内容矩形（即可见区域）的尺寸和位置信息。DOMRectReadOnly 对象具有以下属性：

- x：矩形左边相对于视口左边的距离。
- y：矩形顶部相对于视口顶部的距离。
- width：矩形的宽度。
- height：矩形的高度。
- top：矩形顶部相对于视口顶部的距离，与 y 属性相同。
- right：矩形右边相对于视口左边的距离，计算方式为 x + - width。
- bottom：矩形底部相对于视口顶部的距离，计算方式为 y + height。
- left：矩形左边相对于视口左边的距离，与 x 属性相同。

这些属性提供了关于被观察元素可见区域的位置和尺寸信息。在给定的代码示例中，使用 entry.contentRect 对象提取了 width 和 height 属性的值来处理尺寸变化。

Q：MouseEvent 返回的 layerX，layerY 是什么属性
A：

在过去的旧版浏览器中，MouseEvent 对象确实具有 layerX 和 layerY 属性。这些属性表示鼠标事件相对于触发事件的元素（目标元素）的水平和垂直偏移值。

然而，请注意，layerX 和 layerY 属性已经被废弃，不建议在现代浏览器中使用。它们存在一些兼容性问题，并且不是 W3C 标准的一部分。

相反，在现代浏览器中，通常使用 event.clientX 和 event.clientY 属性来获取鼠标事件相对于视口的坐标。要计算相对于目标元素的坐标，可以结合使用 getBoundingClientRect() 方法和这些坐标值，如之前所示的代码示例中所述。请参考上面的回答以了解更多详细信息。

# 参考链接

- [JavaScript API ResizeObserver 使用示例](https://www.jb51.net/article/255896.htm)
- [一个较新的 JavaScript API——ResizeObserver 的使用](https://juejin.cn/post/6862321554686214158)
