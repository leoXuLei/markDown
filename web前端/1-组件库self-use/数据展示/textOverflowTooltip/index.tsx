import React, { FC } from "react";
import { Tooltip } from "antd";
import { TooltipPropsWithTitle } from "antd/lib/Tooltip";
import styles from "./index.less";

interface ITextOverflowTooltipProps extends TooltipPropsWithTitle {
  title: string;
}

const TextOverflowTooltip: FC<ITextOverflowTooltipProps> = (props) => {
  const { title, ...restProps } = props;

  return (
    <Tooltip arrowPointAtCenter title={title} {...restProps}>
      <div className={styles.ContentWrapper}>{title}</div>
    </Tooltip>
  );
};

export default TextOverflowTooltip;
