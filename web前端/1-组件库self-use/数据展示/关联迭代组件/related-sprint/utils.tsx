import React from "react";
import { ConditionComponent } from "client/upark/components/conditions";
import classnames from "classnames";
import { Tooltip, Dropdown, Menu, Popconfirm } from "antd";
import { LinkOutlined, DownOutlined } from "@ant-design/icons";

interface IProjectGroupProps {
  isShow: boolean;
  title: string;
  data?: any[];
  style?: React.CSSProperties;
  selectProject?: { id?: string };
  updateSelectProject: (any) => void;
}

export const ProjectGroup: React.FC<IProjectGroupProps> = React.memo(
  (props) => {
    const { isShow, title, data, style, selectProject, updateSelectProject } =
      props;
    return (
      <ConditionComponent isShow={isShow}>
        <div className="task-group" style={style}>
          <div className="task-title">{title}</div>
          <div>
            {data?.map((c) => {
              return (
                <div key={c?.id} onClick={() => updateSelectProject?.(c)}>
                  <Tooltip title={c?.name} mouseEnterDelay={0.3}>
                    <span
                      className={classnames(
                        "task-list-item",
                        c?.id === selectProject?.id && "task-list-item-active"
                      )}
                    >
                      {c?.name}
                    </span>
                  </Tooltip>
                </div>
              );
            })}
          </div>
        </div>
      </ConditionComponent>
    );
  }
);

interface IRelatedSprintItem {
  id?: string;
  name?: string;
}

interface IRelatedSprintCardProps {
  sprintItem: IRelatedSprintItem;
  showLink: boolean;
  currentSprintIsLinked?: boolean;
  handleMenu: (sprintItem: IRelatedSprintItem, type: "link" | "unlink") => void;
}

export const RelatedSprintCard: React.FC<IRelatedSprintCardProps> = React.memo(
  (props) => {
    const { showLink, currentSprintIsLinked, sprintItem, handleMenu } = props;

    const linkText = `${showLink ? "" : "取消"}关联`;
    return (
      <div className="task-list-item" key={sprintItem?.id}>
        <Tooltip title={sprintItem?.name} mouseEnterDelay={0.3}>
          <span
            className={classnames(
              "task-list-item-name",
              currentSprintIsLinked && "task-list-item-name-linked"
            )}
          >
            {sprintItem?.name}
          </span>
        </Tooltip>
        <Dropdown
          placement="bottomCenter"
          overlay={
            <Menu>
              <Menu.Item>
                <Popconfirm
                  title={`确认${linkText}吗`}
                  onConfirm={() =>
                    handleMenu(sprintItem, showLink ? "link" : "unlink")
                  }
                >
                  <span>
                    <LinkOutlined />
                    {linkText}
                  </span>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          }
        >
          <a onClick={(e) => e.preventDefault()}>
            <DownOutlined />
          </a>
        </Dropdown>
      </div>
    );
  }
);
