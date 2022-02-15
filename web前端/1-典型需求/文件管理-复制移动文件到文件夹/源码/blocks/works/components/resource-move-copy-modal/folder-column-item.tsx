import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Empty, Tooltip, Spin, Input } from "@com/sun";
import classnames from "classnames";
import styled from "@emotion/styled";
import { FolderAddOutlined, FolderFilled } from "@ant-design/icons";
import { useResource, useResourceLink } from "client/blocks/works/hooks";
import { getModalFolderResource } from "client/ekko/services/works";
import { trackingRender } from "client/utils/wdyr";
import { EMPTY_ARRAY } from "client/utils/emptyArray";
import { ConditionComponent } from "client/components/conditions";
import { FolderColumnItemWrapper } from "./styles";
import { useResourceAction } from "../../contexts/resource-action-context";

const StyledFolderIcon = styled(FolderFilled)`
  margin-right: 4px;

  svg {
    width: 18px;
    height: 18px;
    fill: rgb(27, 154, 238);
  }
`;

const EditInputWrapper = styled.div`
  padding: 8px 16px;
  .input {
    padding: 0 8px;
    height: 36px;
    line-height: 36px;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    color: #262626;
  }
`;

export type IFolderColumnItem = Partial<IResource>;

export interface IFolderColumnItemProps {
  projectId?: string; // 当前选择的空间的id
  index: number;
  item?: IFolderColumnItem;
  isLastItem: boolean; // 是最后一个元素
  selectedFolderItem: IFolderColumnItem | null;
  activeFolderItems: IFolderColumnItem[];
  folderResources: IResource[]; // 要被移动/复制的文件夹资源
  onSelectFolderItem: (item: IFolderColumnItem, index: number) => void;
}

const FolderColumnItem = React.memo(
  ({
    item,
    projectId,
    index,
    activeFolderItems,
    isLastItem,
    folderResources,
    selectedFolderItem,
    onSelectFolderItem,
  }: IFolderColumnItemProps) => {
    const { createFolder } = useResourceAction();

    const [loading, setLoading] = useState<boolean>(false);
    const [list, setList] = useState<IResource[]>();
    const [inputVisible, setInputVisible] = useState(false); // 新增文件夹编辑input

    const feachFolderResource = useCallback(async () => {
      if (!projectId) {
        return;
      }
      const directoryId = item?.id ?? "root";
      setLoading(true);
      const res = await getModalFolderResource(projectId, directoryId).finally(
        () => {
          setLoading(false);
        }
      );
      if (res?.success) {
        setList(res?.result?.subResources ?? EMPTY_ARRAY);
      }
    }, [item, projectId]);

    useEffect(() => {
      feachFolderResource();
    }, [feachFolderResource]);

    // 最后一列滚到视区
    const scrollLastIntoView = useCallback(() => {
      if (isLastItem) {
        const ele = document.getElementById("last-item");
        if (ele) {
          ele?.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    }, [isLastItem]);

    useEffect(() => {
      scrollLastIntoView();
    }, [scrollLastIntoView]);

    const showCreateFolderInput = useCallback(() => {
      setInputVisible(true);
    }, []);

    const handleCreateFolder = useCallback(
      async (event: any) => {
        if (!event.target) {
          return;
        }

        const dirName = (
          (event.target as HTMLInputElement)?.value as string
        )?.trim();
        if (!dirName || !item?.id || !projectId) {
          setInputVisible(false);
          return;
        }
        const res = await createFolder?.({
          isHomePage: false,
          destProjectId: projectId,
          dirName,
          dirParentId: item?.id,
        });
        if (res) {
          feachFolderResource();
        }
        setInputVisible(false);
      },
      [item, projectId, createFolder, feachFolderResource]
    );

    const isActive = useCallback(
      (listItem) => {
        return (
          !!listItem?.id &&
          !!activeFolderItems?.map((v) => v?.id)?.includes(listItem?.id)
        );
      },
      [activeFolderItems]
    );

    const isSelected = useCallback(
      (listItem) => {
        return !!listItem?.id && selectedFolderItem?.id === listItem?.id;
      },
      [selectedFolderItem]
    );

    const isDisabled = useCallback(
      (listItem) => {
        return (
          !!listItem?.id &&
          !!folderResources?.map((v) => v?.id)?.includes(listItem?.id)
        );
      },
      [folderResources]
    );

    return (
      <FolderColumnItemWrapper id={isLastItem ? "last-item" : ""}>
        <div className="folder-picker-handlers">
          <Tooltip title="创建文件夹">
            <FolderAddOutlined
              className="create-icon"
              onClick={showCreateFolderInput}
            />
          </Tooltip>
        </div>
        <header>文件夹</header>

        <ConditionComponent isShow={inputVisible}>
          <EditInputWrapper>
            <Input
              autoFocus
              className="input"
              defaultValue=""
              placeholder="按 Enter 新建文件夹"
              onBlur={handleCreateFolder}
              onPressEnter={handleCreateFolder}
              onClick={(e) => e.stopPropagation()}
            />
          </EditInputWrapper>
        </ConditionComponent>

        <div className="folder-container">
          {!loading && list?.length === 0 && (
            <Empty description={false} style={{ padding: "0 0" }} />
          )}
          <Spin spinning={loading}>
            {list?.map((listItem) => (
              <div
                className={classnames("folder-item", {
                  active: isActive(listItem),
                  selected: isSelected(listItem),
                  disabled: isDisabled(listItem),
                })}
                onClick={() => {
                  if (!isDisabled(listItem)) {
                    onSelectFolderItem?.(listItem, index);
                  }
                }}
              >
                <StyledFolderIcon />
                <span className="folder-item-name">
                  <Tooltip title={listItem?.name}>{listItem?.name}</Tooltip>
                </span>
              </div>
            ))}
          </Spin>
        </div>
      </FolderColumnItemWrapper>
    );
  }
);

FolderColumnItem.displayName = "FolderColumnItem";
trackingRender(FolderColumnItem);

export default FolderColumnItem;
