import React, { useCallback, useMemo, useState, useEffect } from "react";
import produce from "immer";
import styled from "@emotion/styled";
import { Modal, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  createFolder,
  removeBatchResources,
  updateResource,
  setMainVersion,
  createBatchResources,
  moveResource,
  copyResource,
  ICopyOrMoveResourceProps,
} from "@/service/works";
import { selectFiles } from "@/utils/selectFiles";
import { useResourceList } from "./hooks";
import {
  Header,
  ResourceList,
  SprintResourceList,
  ResourceDetail,
  UploadPreviewer,
} from "./components";
import { useProjectId } from "./hooks/use-project-id";
import Uploady, { CreateOptions, useUploadyContext } from "@rpldy/uploady";
import {
  IResourceActionContext,
  ResourceActionContext,
  IMoveCopyResourceType,
  moveCopyResourceTypeMap,
} from "./contexts/resource-action-context";
import {
  judgeViewTypeIsDirectory,
  handledSelectedFilesInfo,
} from "client/blocks/works/utils";
import IfElseComponent from "client/components/conditions";
import { getSprintList } from "client/ekko/services/sprint";
import ResourceMoveCopyModal, {
  IResourceMoveCopyModalProps,
} from "./components/resource-move-copy-modal";
import { IFolderColumnItem } from "./components/resource-move-copy-modal/folder-column-item";
import {
  formatServerResponse as resolveUpload,
  getDestination,
  fileUploadWithKong,
} from "./upload-helper";

const { confirm } = Modal;

export const Container = styled.div`
  width: 1300px;
  max-height: 95%;
  margin: 20px auto 0;
  overflow: scroll;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.0470588);

  @media screen and (max-width: 1199px) {
    width: 944px;
  }
`;

export interface IUploadArgs {
  parentId?: string;
  resourceId?: string;
  cloudKey: string;
  file: File;
}

const Index = () => {
  const projectId = useProjectId() as string | null | undefined;

  const { showFileUpload, upload } = useUploadyContext();

  const [newLoading, setNewLoading] = useState(false);

  const [viewType, setViewType] = useState<IViewRadioType>("sprintView");
  const [sprintIds, setSprintIds] = useState<string[]>([]);

  const [modalVisible, setModalVisible] = useState(false); // ????????????????????????
  const [moveCopyResourceType, setMoveCopyResourceType] =
    useState<IMoveCopyResourceType | null>(null); // ??????/???????????? ??????
  const [moveCopyResources, setMoveCopyResources] = useState<
    IResource[] | null
  >(null); // ??????/???????????????

  /** ?????????????????? */
  const {
    resourceList,
    setResourceList,
    currentPath,
    loading,
    refresh,
    ResourceFilterCom,
    showDot,
  } = useResourceList({
    viewType,
    sprintIds,
  });

  const onViewRadioGroupChange = useCallback((e) => {
    const value = e?.target?.value;
    setViewType(value);
  }, []);

  const onSprintSelectChange = useCallback((value?: string[]) => {
    setSprintIds?.(value || []);
  }, []);

  // ??????????????????
  const feachSprintList = useCallback(async (projectId?: string) => {
    if (!projectId) {
      return;
    }
    const res = await getSprintList(projectId);
    if (res?.success) {
      const firstSprintId = res?.result?.content?.[0]?.id;
      if (firstSprintId) {
        setSprintIds([firstSprintId]);
      }
    }
  }, []);

  useEffect(() => {
    feachSprintList(projectId as any);
  }, [feachSprintList, projectId]);

  const parentId =
    currentPath?.length > 0
      ? currentPath[currentPath.length - 1].resourceId
      : undefined;

  const handleUpload = useCallback<IResourceActionContext["upload"]>(
    async ({ resourceId, multiple = false } = {}) => {
      const destination = await getDestination();

      if (!projectId || !destination) return false;

      const options: CreateOptions = {
        destination,
        formatServerResponse: (response) =>
          resolveUpload({ response, projectId, parentId, resourceId }),
      };

      // ????????????
      // ????????????????????????
      if (multiple) {
        // showFileUpload(options)
      } else {
        const files = await selectFiles({ multiple: false });
        if (files?.length === 0) return false;
        setNewLoading(true);
        const bizUrl = await fileUploadWithKong(files[0]);
        // ?????????????????????
        if (bizUrl) {
          const result = await createBatchResources(projectId, [
            {
              parentId,
              resourceId,
              contentType: files[0].type,
              fileId: bizUrl,
              name: files[0].name,
              size: files[0].size.toString(),
            },
          ]).finally(() => setNewLoading(false));
          if (result.success) {
            notification.success({
              message: "????????????",
              placement: "bottomRight",
            });
            await refresh();
          }
        }
      }
      return true;
    },
    [parentId, projectId, refresh]
  );

  /** ???????????? */
  const remove = useCallback<IResourceActionContext["remove"]>(
    async ({ list }) => {
      if (!projectId) return false;

      const notEmptyFolders = list.filter(
        // ????????????????????????????????????????????????????????????subResources?????????hasSubResources??????????????????
        (item) => item.subResources && item.subResources?.length > 0
      );

      if (notEmptyFolders.length > 0) {
        confirm({
          title: "???????????????",
          icon: <ExclamationCircleOutlined />,
          content: `????????????????????????????????????\n${notEmptyFolders
            .map((item) => item.name)
            .join("\n")}`,
          okText: "??????",
          cancelText: "??????",
        });

        return false;
      }

      const fileInfo = handledSelectedFilesInfo(list);

      confirm({
        title: "???????????????",
        icon: <ExclamationCircleOutlined />,
        content: `??????????????? ${fileInfo.join(" ??? ")}?????????????????????`,
        okText: "??????",
        okType: "danger",
        cancelText: "??????",
        async onOk() {
          const keys = list.map((item) => item.id);
          const res = await removeBatchResources(projectId, keys);
          if (!res.success) {
            await refresh();
            return;
          }

          setResourceList((prevList) =>
            (prevList as any).filter((res) => !keys.includes(res.id))
          );
        },
      });
      return true;
    },
    [projectId, refresh, setResourceList]
  );

  /** ??????????????? */
  const handleCreateFolder = useCallback<
    IResourceActionContext["createFolder"]
  >(
    async (params = {}) => {
      const {
        isHomePage = true,
        dirName = "",
        dirParentId = "",
        destProjectId = projectId,
      } = params;
      if (!projectId) return;

      if (isHomePage) {
        const res = await createFolder(projectId, "???????????????", parentId);
        if (!res?.success) return;
        setResourceList((prevList) => [...prevList, res.result] as any);
        return res.result;
      }
      if (dirParentId && destProjectId) {
        const res = await createFolder(destProjectId, dirName, dirParentId);
        if (!res?.success) return;
        // ????????????????????????????????????????????????????????????????????????????????????????????????
        if (destProjectId === projectId && parentId === dirParentId) {
          await refresh();
        }
        notification.success({ message: "?????????????????????" });
        return true;
      }
    },
    [projectId, parentId, refresh, setResourceList]
  );

  /** ??????????????? */
  const rename = useCallback<IResourceActionContext["rename"]>(
    async ({ resourceId, fileName }) => {
      if (!projectId) {
        return false;
      }

      const res = await updateResource({
        projectId,
        resourceId,
        filename: fileName,
      });

      if (!res.success) return false;

      setResourceList((prevList) => {
        return prevList.map((item) => ({
          ...item,
          name: item.id === resourceId ? fileName : item.name,
        }));
      });
      // await refresh()
      notification.success({ message: "???????????????" });

      return true;
    },
    [projectId, setResourceList]
  );

  /** ??????????????????/???????????????????????? */
  const openMoveCopyModal = useCallback<
    IResourceActionContext["openMoveCopyModal"]
  >(async ({ type, resourceList }) => {
    setMoveCopyResourceType(type);
    setMoveCopyResources(resourceList);
    if (resourceList?.length) {
      setModalVisible(true);
    }
    return true;
  }, []);

  const handleMoveCopyOK = useCallback(
    async (
      projectId: string,
      item: IFolderColumnItem,
      destProjectId?: string
    ) => {
      const operateFeachMethodMap = {
        move: moveResource,
        copy: copyResource,
      };
      if (moveCopyResourceType) {
        const operateFeachMethod: (
          projectId: string,
          data: ICopyOrMoveResourceProps
        ) => Promise<IBasicApi<IResource>> =
          operateFeachMethodMap[moveCopyResourceType];
        const res = await operateFeachMethod(projectId, {
          destParentId: item?.id,
          resourceIds: moveCopyResources?.map((v) => v.id) || [],
          ...(moveCopyResourceType === "copy"
            ? {
                destProjectId,
              }
            : {}),
        });
        if (!res.success) return;
        notification.success({
          message: `${moveCopyResourceTypeMap[moveCopyResourceType]}??????`,
        });
        await refresh();
      }
    },
    [moveCopyResources, moveCopyResourceType, refresh]
  );

  const handleSetMainVersion = useCallback(
    async (resourceId: string, versionId: string) => {
      if (!projectId) {
        return;
      }

      const res = await setMainVersion(projectId, resourceId, versionId);
      if (res.success) {
        await refresh();
      }
    },
    [projectId, refresh]
  );

  const handleUploadResult = useCallback(
    (items: IResource[]) => {
      if (!items || items.length === 0) return;

      setResourceList(
        produce((list) => {
          for (const item of items) {
            const existIndex = list.findIndex((v) => v.id === item.id);

            if (existIndex >= 0) {
              list[existIndex] = item;
            } else {
              list.push(item as any);
            }
          }
        })
      );
    },
    [setResourceList]
  );

  // if (loading) {
  //   return <h2>loading.....</h2>
  // }

  const actions = useMemo(
    () => ({
      rename,
      createFolder: handleCreateFolder,
      remove,
      upload: handleUpload,
      openMoveCopyModal,
    }),
    [handleCreateFolder, handleUpload, remove, rename, openMoveCopyModal]
  );

  return (
    <ResourceActionContext.Provider value={actions}>
      <Container>
        <Header
          currentPath={currentPath}
          viewType={viewType}
          sprintIds={sprintIds}
          showDot={showDot}
          resourceFilterCom={ResourceFilterCom}
          onRadioGroupChange={onViewRadioGroupChange}
          onSprintSelectChange={onSprintSelectChange}
        />
        <IfElseComponent
          checked={judgeViewTypeIsDirectory(viewType)}
          if={
            <ResourceList
              loading={newLoading || loading}
              viewType={viewType}
              resources={resourceList as IResource[]}
            />
          }
          else={
            <SprintResourceList
              loading={newLoading || loading}
              viewType={viewType}
              resources={resourceList as ISprintResource[]}
            />
          }
        />

        <ResourceDetail onSetMainVersion={handleSetMainVersion} />
      </Container>
      <UploadPreviewer onUploaded={handleUploadResult} />

      <ResourceMoveCopyModal
        visible={modalVisible}
        handleOK={handleMoveCopyOK}
        onClose={() => setModalVisible(false)}
        moveCopyResourceType={moveCopyResourceType!}
        moveCopyResources={moveCopyResources!}
      />
    </ResourceActionContext.Provider>
  );
};

export default Index;
