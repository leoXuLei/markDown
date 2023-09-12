import React from "react";
import { ChromePicker } from "react-color";
import { createPortal } from "react-dom";
import { usePersistFn } from "ahooks";
import * as Utils from "@R/utils/util";
import { useDebounce } from "@R/hooks";
import "./index.less";

type Props = {
  color?: string;
  onChange?: (color: string) => void;
  onBlur?: (color: string) => void;
  className?: string;
  style?: React.CSSProperties;
};
interface IPos {
  left: number;
  top: number;
}

const prefixCls = "trend-color-picker";

const ColorPicker: React.FC<Props> = (props) => {
  const { style, className, color } = props;
  const [iColor, setIColor] = React.useState<string>(color || "#ddd");
  const [show, setShow] = React.useState<boolean>(false);
  const colorContentRef = React.useRef<any>(null);
  const popupRef = React.useRef<any>(null);
  const pos = React.useRef<IPos>({
    left: 0,
    top: 0,
  });

  React.useEffect(() => {
    if (color) setIColor(color);
  }, [color]);


  // 点击颜色组件外的地方，都要关闭颜色组件，包括点击颜色列（有）
  const handleClickOutside = (event: MouseEvent) => {
    // colorContentRef也要排除，因为会与showColorPicker中的setShow冲突
    if (
      popupRef.current &&
      !popupRef.current?.contains?.(event.target) &&
      !colorContentRef?.current?.contains(event.target)
    ) {
      setShow(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showColorPicker = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault?.();
    e.stopPropagation?.();
    pos.current = {
      left: e.clientX + 30,
      top: e.clientY - 240,
    };
    setShow((prevState) => !prevState);
  };

  // 不用usePersistFn包裹，防抖无法生效。
  const handleColorChange = usePersistFn((handledHexa: string) => {
    props?.onChange?.(handledHexa);
  });

  const debounceChange = useDebounce(handleColorChange, 500);

  return (
    <div className={prefixCls}>
      <div
        ref={colorContentRef}
        className={`${prefixCls}-content ${className}`}
        style={{ backgroundColor: iColor, ...style }}
        onClick={showColorPicker}
      />
      {show
        ? createPortal(
            <div
              className={`${prefixCls}-chrome-picker`}
              style={pos.current}
              ref={popupRef}
            >
              <ChromePicker
                color={iColor}
                onChange={(colorResult) => {
                  const handledHexa = Utils.rgba2hexa(
                    colorResult.rgb as Utils.IRgbaColorObj
                  );
                  setIColor(handledHexa);
                  debounceChange(handledHexa);
                }}
              />
            </div>,
            document.body
          )
        : null}
    </div>
  );
};

export default ColorPicker;
