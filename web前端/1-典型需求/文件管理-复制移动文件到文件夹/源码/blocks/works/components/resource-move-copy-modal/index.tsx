import React, {
  useCallback,
  useEffect,
  useState,
  useMemo,
  useContext,
} from "react";
import { Button, Tooltip } from "@com/sun";
import { trackingRender } from "client/utils/wdyr";
import { handledSelectedFilesInfo } from "client/blocks/works/utils";
import ProjectList, { ISelectProject } from "./project-list";
import FolderColumnItem, {
  IFolderColumnItemProps,
  IFolderColumnItem,
} from "./folder-column-item";
import { MainProjectContext } from "client/blocks/common/main-project-context";
import { StyledModal, TitleWrapper, Body } from "./styles";
import { ConditionComponent } from "client/components/conditions";
import { useProjectId } from "../../hooks/use-project-id";
import {
  IMoveCopyResourceType,
  moveCopyResourceTypeMap,
} from "../../contexts/resource-action-context";

export interface IResourceMoveCopyModalProps {
  visible: boolean;
  onClose: () => void;
  handleOK: (
    projectId: string,
    item: IFolderColumnItem,
    destProjectId?: string
  ) => Promise<void>;
  moveCopyResourceType: IMoveCopyResourceType; // 类型: 移动/复制
  moveCopyResources: IResource[]; // 移动/复制的资源
}

const projectDefaultFolder = {
  id: "root",
};

const ResourceMoveCopyModal = React.memo(
  ({
    visible,
    moveCopyResources,
    moveCopyResourceType,
    onClose,
    handleOK,
  }: IResourceMoveCopyModalProps) => {
    const context = useContext(MainProjectContext)!;
    const projectId = useProjectId(); // 默认空间

    const [selectProject, setSelectProject] = useState<ISelectProject>(); // 当前被选中的空间

    const [folderColumnList, setFolderColumnList] = useState<
      IFolderColumnItem[]
    >([]);
    const [activeFolderItems, setActiveFolderItems] = useState<
      IFolderColumnItem[]
    >([]);
    const [selectedFolderItem, setSelectedFolderItem] =
      useState<IFolderColumnItem>(projectDefaultFolder);

    // 重置右侧文件夹的各种状态
    const resetFolderState = useCallback(() => {
      setActiveFolderItems([]);
      setSelectedFolderItem(projectDefaultFolder);
      // setFolderColumnList只能在这里，若在监听selectProject的useEffect中写，
      // 上个选择的空间下展开了几列文件夹，最新选择的空间下就会请求这几列文件夹的详情数据，
      // 但是显然刚切换空间，只希望请求第一列root根文件夹
      setFolderColumnList([projectDefaultFolder]);
    }, []);

    const onSelectProject = useCallback(
      (project) => {
        setSelectProject((prev) => {
          // 切换不同空间、重置状态
          if (project.id && project.id !== prev?.id) {
            resetFolderState();
          }
          return project;
        });
      },
      [resetFolderState]
    );

    const retSelectProject = useCallback(() => {
      if (visible && context.project) {
        onSelectProject(context.project);
      }
    }, [visible, context.project, onSelectProject]);

    useEffect(() => {
      retSelectProject();
      resetFolderState();
    }, [retSelectProject, resetFolderState]);

    const handleClose = useCallback(() => {
      onClose?.();
      retSelectProject();
    }, [onClose, retSelectProject]);

    const onHandleOK = useCallback(() => {
      handleOK?.(projectId, selectedFolderItem, selectProject?.id);
      onClose?.();
      retSelectProject();
    }, [
      projectId,
      selectProject,
      selectedFolderItem,
      onClose,
      handleOK,
      retSelectProject,
    ]);

    // 点击某列下的某个文件夹
    const onSelectFolderItem = useCallback(
      (item: IFolderColumnItem, index: number) => {
        if (!item) {
          return;
        }
        setSelectedFolderItem(item);
        setActiveFolderItems((prev) => {
          const latest = prev?.slice(0, index)?.concat(item);
          return latest || [];
        });
        setFolderColumnList((prev) => {
          const latest = prev?.slice(0, index + 1)?.concat(item);
          return latest || [];
        });
      },
      []
    );

    const fileInfoList = useMemo<string[]>(() => {
      return handledSelectedFilesInfo(moveCopyResources);
    }, [moveCopyResources]);

    // 要被移动/复制的文件夹资源
    const folderResources = useMemo<IResource[]>(() => {
      return moveCopyResources?.filter((v) => !!v.directory) || [];
    }, [moveCopyResources]);

    return (
      <StyledModal
        title={
          <TitleWrapper>
            {moveCopyResourceTypeMap[moveCopyResourceType] || ""}{" "}
            {fileInfoList.join(" 和 ")} 至
          </TitleWrapper>
        }
        centered
        destroyOnClose
        visible={visible}
        width={800}
        // onOk={handleClose}
        onCancel={handleClose}
        footer={
          <div className="modal-footer">
            <p>跨项目移动时，部分参与者信息不会被保留。</p>
            <div className="buttons">
              <Button type="link" onClick={onClose}>
                取消
              </Button>
              <Button
                type="primary"
                onClick={onHandleOK}
                disabled={!selectedFolderItem}
              >
                确定
              </Button>
            </div>
          </div>
        }
      >
        <Body>
          <ConditionComponent isShow={moveCopyResourceType === "copy"}>
            <div className="projects-column">
              <ProjectList
                selectProject={selectProject!}
                onSelectProject={onSelectProject}
              />
            </div>
          </ConditionComponent>
          <div className="folder-picker-container">
            <div className="folder-picker-view">
              <div id="folder-picker" className="folder-picker">
                {folderColumnList?.map((v, index, arr) => {
                  return (
                    <FolderColumnItem
                      item={v}
                      index={index}
                      isLastItem={arr.length - 1 === index}
                      projectId={selectProject?.id!}
                      selectedFolderItem={selectedFolderItem}
                      activeFolderItems={activeFolderItems}
                      folderResources={folderResources}
                      onSelectFolderItem={onSelectFolderItem}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </Body>
      </StyledModal>
    );
  }
);

ResourceMoveCopyModal.displayName = "ResourceMoveCopyModal";
trackingRender(ResourceMoveCopyModal);

export default ResourceMoveCopyModal;
