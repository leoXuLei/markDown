import React, { ReactNode, useCallback } from "react";
import styled from "@emotion/styled";
import { Checkbox as OriginCheckbox } from "@com/sun";
import { trackingRender } from "client/utils/wdyr";
import { judgeViewTypeIsDirectory } from "client/blocks/works/utils";
import { ConditionComponent } from "client/components/conditions";

const Checkbox = styled(OriginCheckbox)`
  margin-right: 16px;
  .ant-checkbox-inner {
    width: 20px;
    height: 20px;
    border-width: 2px;
    border-radius: 3px;
    box-sizing: border-box;
  }
`;

const ItemWrapper = styled.li`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 20px;
  font-size: 14px;
  transition: all 0.3s ease-in-out;
`;

const ItemContent = styled.div`
  display: grid;
  align-items: center;
  align-content: center;
  grid-template-columns: ${(props: any) =>
    judgeViewTypeIsDirectory(props?.viewType)
      ? "50% 200px auto"
      : "150px 120px 150px 1fr 150px 150px;"};
  grid-gap: 16px;
  width: 100%;
  padding: 12px 0;
`;

const ItemHandler = styled.div`
  position: absolute;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 12px;
  align-items: center;
  top: 0;
  right: 20px;
  height: 100%;
  padding-left: 8px;
  transition: all 0.3s ease-in-out;
`;
interface IBaseItemProps {
  [key: string]: unknown;
  children: ReactNode;
  checked: boolean;
  viewType?: IViewRadioType;
  onChecked: (checked: boolean) => void;
  onClick?: () => void;
  handler?: ReactNode;
}

export const BaseItem = React.memo(
  ({
    className,
    children,
    checked,
    handler,
    viewType,
    onChecked,
    onClick,
    ...restProps
  }: IBaseItemProps) => {
    const handleChecked = useCallback(() => {
      onChecked?.(!checked);
    }, [checked, onChecked]);

    return (
      <ItemWrapper className={`list-item__wrapper ${className}`} {...restProps}>
        <ConditionComponent isShow={judgeViewTypeIsDirectory(viewType)}>
          <Checkbox checked={checked} onChange={handleChecked} />
        </ConditionComponent>
        <ItemContent
          className="list-item__content"
          onClick={onClick}
          viewType={viewType}
        >
          {children}
        </ItemContent>
        <ConditionComponent isShow={judgeViewTypeIsDirectory(viewType)}>
          <ItemHandler className="list-item__handler">{handler}</ItemHandler>
        </ConditionComponent>
      </ItemWrapper>
    );
  }
);

trackingRender(BaseItem, "BaseItem");
