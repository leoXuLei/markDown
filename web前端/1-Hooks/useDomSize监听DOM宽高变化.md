# useDomSize

```tsx
import React from "react";
import * as Utils from "@R/utils/util";

/**
 * @des 监听div的size（宽、高）变化
 */
const useDomSize = () => {
  const [width, setWidth] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>(0);
  const domRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    if (domRef.current) {
      resizeObserver.observe(domRef.current);
    }
    return () => {
      if (domRef.current) resizeObserver.unobserve(domRef.current);
    };
  }, []);

  const handleResize = Utils.debounce((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;
      setHeight(height);
      setWidth(width);
    }
  }, 150);

  return { width, height, domRef };
};

export default useDomSize;
```

# 使用实例

使用实例如下：

```tsx
import React from "react";
import { Tooltip, TooltipProps } from "@supcon/supcond2";
import * as Utils from "@R/utils/util";
import useDomSize from "@R/hooks/useDomSize";

interface XToopTiplProps {
  title: string;
  key?: string | number;
  placement?: TooltipProps["placement"];
  children?: React.ReactChild | undefined;
  style?: React.CSSProperties;
}

/**
 * 自动判断是否溢出，并添加省略和tooltip
 */
const AutoTooltip = (props: XToopTiplProps) => {
  const { title, key, placement, children, style } = props;
  const [tooltip, setTooltip] = React.useState(false);
  const { width, domRef } = useDomSize();

  const debouncedHandleShowTooltip = Utils.debounce(() => {
    if (domRef.current) {
      const { scrollHeight, clientHeight, scrollWidth, clientWidth } =
        domRef.current;
      if (scrollHeight > clientHeight) {
        // 上下溢出
        setTooltip(true);
      } else if (scrollWidth > clientWidth) {
        // 左右溢出
        setTooltip(true);
      } else {
        setTooltip(false);
      }
    }
  }, 500);

  React.useEffect(() => {
    if (!width) return;
    debouncedHandleShowTooltip();
  }, [width]);

  return (
    <Tooltip
      destroyTooltipOnHide
      key={key}
      placement={placement}
      title={tooltip ? title : ""}
    >
      <div
        ref={domRef}
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          ...style,
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
};

export default AutoTooltip;
```
