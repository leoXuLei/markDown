import React, {
  FC,
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import classNames from "classnames";
import styles from "./index.less";

interface IContextMenu {
  className?: string;
  contextMenuNode: ReactNode;
  children: ReactNode;
}

interface IContextMenuItem extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
}

interface IPos {
  left: number; // 0;
  top: number; // 0;
}

export const ContextMenuItem: FC<IContextMenuItem> = (props) => {
  const { children, className = "", disabled, ...restProps } = props;
  return (
    <div
      className={classNames(
        styles.ContextMenuItem,
        disabled && styles.disabled,
        className
      )}
      {...restProps}
    >
      {children}
    </div>
  );
};

const ContextMenu = forwardRef<{ show: (e: any) => void }, IContextMenu>(
  ({ children, contextMenuNode, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const pos = useRef<IPos>({
      left: 0,
      top: 0,
    });
    const [isShow, setIsShow] = useState(false);

    const hide = useCallback((e) => {
      setIsShow(false);
    }, []);

    const show = useCallback((e) => {
      e.preventDefault?.();
      e.stopPropagation?.();
      // 记录右键点击位置
      pos.current = {
        left: e.clientX,
        top: e.clientY,
      };
      setIsShow(true);
    }, []);

    // 暴露show和hide方法，给外部父组件使用
    useImperativeHandle(ref, () => ({ show, hide }), [show, hide]);

    useEffect(() => {
      // 右键菜单展示时，若点击、右键等则菜单弹窗关闭
      if (isShow) {
        containerRef.current?.addEventListener("contextmenu", hide);
        document.addEventListener("contextmenu", hide);
        document.addEventListener("resize", hide);
        document.addEventListener("click", hide);
        document.addEventListener("scroll", hide);
      }
      return () => {
        containerRef.current?.removeEventListener("contextmenu", hide);
        document.removeEventListener("contextmenu", hide);
        document.removeEventListener("resize", hide);
        document.removeEventListener("click", hide);
        document.removeEventListener("scroll", hide);
      };
    }, [isShow, hide]);

    return (
      <div
        ref={containerRef}
        className={`${styles.ContextMenuWrapper} ${className}`}
      >
        {isShow
          ? createPortal(
              <div className={styles.ContextMenu} style={pos.current}>
                {contextMenuNode}
              </div>,
              document.body
            )
          : null}
        {children}
      </div>
    );
  }
);

export default ContextMenu;
