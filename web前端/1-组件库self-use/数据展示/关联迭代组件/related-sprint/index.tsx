/** @jsx jsx */
import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import { Button, Spin, Modal, Input, Empty } from "@com/sun";
import { Icon } from "@com/omps-ui";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import {
  getProjectBasicListByList,
  getStarProject,
  getProjectBasicInfoList,
} from "client/upark/services/project";
import {
  getSprintList,
  getCanBeRelatedSprintList,
  linkSprint,
  unLinkSprint,
} from "client/upark/services/sprint";
import useDebounce from "client/upark/hooks/use-debounce";
import { ConditionComponent } from "client/upark/components/conditions";
import { sprintStatusMap } from "client/upark/utils";
import { ProjectGroup, RelatedSprintCard } from "./utils";
import * as styles from "./styles";

export type IValueItem = Pick<
  LinkedSprintVO,
  "id" | "name" | "projectId" | "projectName"
>;

interface IRelatedSprintProps {
  sprintDesc: string;
  value?: IValueItem[];
  mode?: "create" | "edit"; // 新建迭代 | 迭代概览页面
  staffId: string;
  visible?: boolean;
  sprint?: ISprintListItem;
  onChange?: (v: IValueItem[]) => void;
  onRefresh?(): void;
}

interface ISprintTypeItem {
  id: string;
  label: string;
  children: Array<{ id: string; name: string }>;
}

type IHandledLinkedSprintVO = Pick<LinkedSprintVO, "id" | "name">;

interface IRelatedSprintItem {
  projectName: string;
  projectId: string;
  sprintList: IHandledLinkedSprintVO[];
}

const RelatedSprintWrapper = styled.div`
  .ant-btn {
    padding-left: 0;
    font-size: 16px;
    /* border-radius: 4px; */
    /* border: 1px solid #e5e5e5; */
    font-weight: 500;
  }
  .ant-modal-footer {
    border-top-color: rgba(0, 0, 0, 0.12);
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    .title {
      color: #595959;
    }
    .input-search {
      margin-right: 20px;
    }
  }
`;

const RelatedSprint: React.FC<IRelatedSprintProps> = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [relatedSprintValue, setRelatedSprintValue] = useState<IValueItem[]>(
    []
  );

  // 参与空间列表
  const [myProjects, setMyProjects] = useState<IProjectDetail[]>();
  // 收藏空间列表
  const [starProjects, setStarProjects] = useState<
    Array<{
      projectId: string;
      name: string;
      taskIdPrefix?: string;
      taskTypes?: ITaskType[];
    }>
  >();

  const [searchSprintStr, setSearchSprintStr] = useState(""); // 搜索迭代值
  const projectInputRef = useRef<any>(null); // 保存用户搜索的空间的值
  const [projectLoading, setProjectLoading] = useState(false); // 空间列表loading

  const [searchProjectList, setSearchProjectList] = useState<IProject[]>(); // 搜索结果：空间列表
  const [searchedProjects, setSearchedProjects] = useState<IProject[]>(); // 搜索过的空间列表（并点击过）
  const [searchProjectLoading, setSearchProjectLoading] =
    useState<boolean>(false); // 搜索空间loading
  const [selectProject, setSelectProject] =
    useState<{ id?: string; name?: string }>(); // 当前选择的空间
  const [sprintList, setSprintList] = useState<ISprintTypeItem[]>(); // 当前选择空间下的迭代列表
  const [sprintLoading, setSprintLoading] = useState(false); // 迭代列表loading

  const {
    value = [],
    staffId,
    mode = "create",
    visible,
    sprint,
    sprintDesc,
    onRefresh,
    onChange,
  } = props;

  const modeIsEdit = mode === "edit"; // 迭代概览页面

  const relatedSprint =
    sprint?.linkedContentResponseDTO?.linkedContent?.sprints;

  const sprintId = sprint?.id;

  // 获取空间列表
  const getProjectSprintList = useCallback(async () => {
    if (!staffId) {
      return;
    }
    setProjectLoading(true);

    const [res1, res2] = await Promise.all([
      // 获取业务线下的空间列表
      getProjectBasicListByList({
        staffId,
      }),
      // 我收藏的空间列表
      getStarProject(),
    ]);
    setProjectLoading(false);
    let basicProjectList: any[] = [];
    let starProjectList: any[] = [];
    if ((res1 as any)?.success) {
      const content = (res1 as any)?.result?.content || [];
      setMyProjects(content);
      basicProjectList = content;
    }
    if ((res2 as any)?.success) {
      const result = ((res2 as any)?.result || [])?.map((v) => ({
        ...v,
        id: v?.projectId,
      }));
      setStarProjects(result);
      starProjectList = result;
    }

    if (starProjectList?.[0]) {
      setSelectProject(starProjectList?.[0]);
    }
  }, [staffId]);

  useEffect(() => {
    if ((!modeIsEdit && visible) || modeIsEdit) {
      getProjectSprintList();
    }
  }, [modeIsEdit, visible, getProjectSprintList]);

  useEffect(() => {
    // 编辑页面处理初始值
    if (modeIsEdit) {
      setRelatedSprintValue(relatedSprint || []);
    }
  }, [modeIsEdit, relatedSprint]);

  const onOpenModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const onCloseModal = useCallback(() => {
    // 新建页面关闭modal时初始化value
    if (!modeIsEdit) {
      setRelatedSprintValue(value || []);
    }
    setModalVisible(false);
  }, [value, modeIsEdit]);

  const onButtonSubmit = useCallback(() => {
    setModalVisible(false);
    onChange?.(relatedSprintValue);
  }, [relatedSprintValue, onChange]);

  // 搜索空间
  const searchProject = useCallback(async (searchVal) => {
    const newVal = searchVal?.trim();
    if (!newVal) {
      // 如果搜索值为空就不请求
      setSearchProjectList(undefined);
      return;
    }
    setSearchProjectLoading(true);
    const res = await getProjectBasicInfoList({ fuzzyName: newVal });
    setSearchProjectLoading(false);
    if (res.success) {
      setSearchProjectList(res?.result?.content || []);
    }
  }, []);

  // 防抖来一个
  const handleInputChange = useCallback(
    useDebounce(() => {
      searchProject(projectInputRef.current?.state?.value);
    }, 300),
    [searchProject]
  );

  // 给匹配到的字符染色
  const colorString = useCallback((val) => {
    const searchVal = projectInputRef.current?.state?.value;
    if (!searchVal) return val;
    return val.replace(
      new RegExp(searchVal?.trim(), "gi"),
      (match) => `<span class='matched-text' >${match}</span>`
    );
  }, []);

  // 点击空间查询迭代列表
  const getSprintByProjectId = useCallback(
    async (project) => {
      setSprintLoading(true);

      let sprintsRes;
      if (modeIsEdit) {
        // 当前空间下当前迭代可以去关联的迭代列表
        const canBeRelatedSprintsRess: IBasicApi<CanBeRelatedSprintItemVO[]> =
          await getCanBeRelatedSprintList(project?.id, sprintId!);
        sprintsRes = canBeRelatedSprintsRess;
      } else {
        // 空间列表下的迭代列表
        const allSprintsRess: IBasicApi<IPageApi<ISprintListItem[]>> =
          await getSprintList(project?.id);
        sprintsRes = allSprintsRess;
      }
      setSprintLoading(false);

      const sprintsContent =
        (modeIsEdit ? sprintsRes?.result : sprintsRes?.result?.content) || [];

      const sprintsData = sprintsRes?.success ? sprintsContent : [];

      const sprintTypeMap: Record<string, ISprintTypeItem> = {
        start: {
          id: "start",
          label: sprintStatusMap.start,
          children: [],
        },
        doing: {
          id: "doing",
          label: sprintStatusMap.doing,
          children: [],
        },
        done: {
          id: "done",
          label: sprintStatusMap.done,
          children: [],
        },
      };
      sprintsData?.forEach((item) => {
        const mapItem = sprintTypeMap[item.sprintStatus];
        if (mapItem) {
          mapItem.children.push(item);
        } else {
          sprintTypeMap[item.sprintStatus] = {
            id: item.sprintStatus,
            label: sprintStatusMap[item.sprintStatus],
            children: [item],
          };
        }
      });
      setSprintList(Object.values(sprintTypeMap) || []);
    },
    [modeIsEdit, sprintId]
  );

  useEffect(() => {
    if (selectProject?.id) {
      getSprintByProjectId(selectProject);
    }
  }, [selectProject, getSprintByProjectId]);

  // 关联迭代
  const onLinkSprint = useCallback(
    async ({ id, name }) => {
      // 新建页面更新value
      if (!modeIsEdit) {
        const newSprintItem: IValueItem = {
          id,
          name,
          projectId: selectProject?.id!,
          projectName: selectProject?.name!,
        };
        setRelatedSprintValue((prev) => [newSprintItem, ...prev]);
        return;
      }
      // 编辑页面调接口
      setSprintLoading(true);
      const res = await linkSprint(sprintId!, "sprint", {
        linkedEntityId: id,
        linkedEntityType: "sprint",
      });
      setSprintLoading(false);
      if (res?.success) {
        onRefresh?.();
      }
    },
    [selectProject, modeIsEdit, sprintId, onRefresh]
  );

  // 取消关联迭代
  const onUnLinkSprint = useCallback(
    async ({ id }) => {
      // 新建页面更新value
      if (!modeIsEdit) {
        setRelatedSprintValue(
          (prev) => prev?.filter((v) => v?.id !== id) || []
        );
        return;
      }
      // 编辑页面调接口
      const linkedSprintItem = relatedSprint?.find?.((v) => v.id === id);
      if (linkedSprintItem) {
        setSprintLoading(true);
        const res = await unLinkSprint(linkedSprintItem?.linkedContentId);
        setSprintLoading(false);
        if (res.success) {
          onRefresh?.();
        }
      }
    },
    [modeIsEdit, relatedSprint, onRefresh]
  );

  const handleMenu = useCallback(
    async (val, key) => {
      if (!val?.id) return;
      switch (key) {
        case "unlink": {
          onUnLinkSprint(val);
          break;
        }
        case "link": {
          onLinkSprint(val);
          break;
        }
        default:
      }
    },
    [onUnLinkSprint, onLinkSprint]
  );

  const projectGroupData = useMemo(
    () => [
      {
        isShow: !!searchedProjects?.length,
        title: "我搜索的空间",
        data: searchedProjects,
      },
      {
        isShow: true,
        title: "我收藏的空间",
        data: starProjects,
        style: { marginTop: searchedProjects ? 20 : 0 },
      },
      {
        isShow: true,
        title: "我参与的空间",
        data: myProjects,
        style: { marginTop: 20 },
      },
    ],
    [searchedProjects, starProjects, myProjects]
  );

  // 按空间分组显示已关联迭代列表
  const handledRelatedSprints: IRelatedSprintItem[] = useMemo(() => {
    const projectMap = (relatedSprintValue || [])?.reduce(
      (t, v: IValueItem) => {
        if (!t?.[v?.projectId]) {
          t[v?.projectId] = {
            projectName: "",
            sprintList: [],
          };
        }
        t[v?.projectId].projectName = v?.projectName;
        t[v?.projectId].projectId = v?.projectId;
        t[v?.projectId].sprintList?.push?.({
          id: v?.id,
          name: v?.name,
        });
        return t;
      },
      {}
    );
    return Object.values(projectMap) || [];
  }, [relatedSprintValue]);

  const relatedSprintIds = useMemo(
    () => relatedSprintValue?.map((v) => v.id),
    [relatedSprintValue]
  );

  // console.log(
  //   '【新关联迭代】-render-relatedSprintValue',
  //   relatedSprintValue?.map((v) => ({
  //     id: v?.id,
  //     name: v?.name,
  //     projectId: v?.projectId,
  //     projectName: v?.projectName,
  //   })),
  // )

  const relatedSprintLengthText = useMemo(() => {
    const sprintData = modeIsEdit ? relatedSprint : relatedSprintValue;
    return sprintData?.length ? `(${sprintData?.length})` : "";
  }, [modeIsEdit, relatedSprint, relatedSprintValue]);

  return (
    <RelatedSprintWrapper>
      <Button onClick={onOpenModal} type="link" icon={<PlusOutlined />}>
        关联{sprintDesc}
        {relatedSprintLengthText}
      </Button>

      <Modal
        css={styles.modalWrapperCss}
        title={
          <div className="modal-header">
            <div className="title">关联{sprintDesc}</div>
            <div className="input-search">
              <Input
                placeholder={`请搜索${sprintDesc}`}
                prefix={<SearchOutlined />}
                value={searchSprintStr}
                allowClear
                onChange={(e) => setSearchSprintStr(e.target.value)}
              />
            </div>
          </div>
        }
        visible={modalVisible}
        onCancel={onCloseModal}
        width={800}
        maskClosable={false}
        footer={
          modeIsEdit ? null : (
            <div>
              <Button onClick={() => setRelatedSprintValue([])}>
                清空关联
              </Button>
              <Button type="primary" onClick={onButtonSubmit}>
                保存关联
              </Button>
            </div>
          )
        }
      >
        <div className="modal-content">
          <div className="container related-sprints-container">
            <div className="container-title">
              已关联的{sprintDesc}
              {relatedSprintLengthText}
            </div>
            <div className="task-group scroll-part">
              <ConditionComponent
                isShow={
                  !handledRelatedSprints?.reduce(
                    (t, c) => t + (c?.sprintList?.length || 0),
                    0
                  )
                }
              >
                <div className="empty-text">目前还没有已关联的{sprintDesc}</div>
              </ConditionComponent>
              {handledRelatedSprints?.map((projectItem) => {
                const { projectName, projectId, sprintList } =
                  projectItem || {};
                return (
                  <div key={projectId}>
                    <div className="task-title">{projectName}</div>
                    {sprintList?.map((sprintItem) => (
                      <RelatedSprintCard
                        showLink={false}
                        sprintItem={sprintItem}
                        handleMenu={handleMenu}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="container projects-container">
            <div className="search-project">
              <i className="search-icon">
                <Icon type={"search-bar"} />
              </i>
              <Input
                autoFocus
                ref={projectInputRef}
                bordered={false}
                allowClear
                placeholder="请搜索空间"
                onChange={handleInputChange}
                onPressEnter={handleInputChange}
              />

              <div className="project-list">
                <Spin spinning={searchProjectLoading} size="small">
                  <ConditionComponent isShow={!!searchProjectList?.length}>
                    {searchProjectList?.map?.((v) => (
                      <div
                        className="project-item"
                        key={v?.id}
                        title={v?.name}
                        onClick={() => {
                          setSearchedProjects((prev) => {
                            return (v ? [v] : [])
                              .concat(
                                (prev || [])?.filter(
                                  (item) => item?.id !== v.id
                                )
                              )
                              ?.slice(0, 5);
                          });
                          setSelectProject(v);
                          setSearchProjectList(undefined);
                        }}
                      >
                        <span
                          className="item-name"
                          dangerouslySetInnerHTML={{
                            __html: colorString(v.name),
                          }}
                        />
                      </div>
                    ))}
                  </ConditionComponent>
                  <ConditionComponent
                    isShow={!!searchProjectList && !searchProjectList?.length}
                  >
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      style={{ margin: "5px 0" }}
                    />
                  </ConditionComponent>
                </Spin>
              </div>
            </div>

            <div className="scroll-part">
              <Spin spinning={projectLoading}>
                {projectGroupData?.map((v) => (
                  <ProjectGroup
                    {...v}
                    selectProject={selectProject}
                    updateSelectProject={(v) => setSelectProject(v)}
                  />
                ))}
              </Spin>
            </div>
          </div>

          <div className="container sprints-container">
            <Spin spinning={sprintLoading}>
              <ConditionComponent isShow={!selectProject?.id}>
                <div className="empty-text">请先选择空间</div>
              </ConditionComponent>
              <ConditionComponent
                isShow={
                  !!selectProject?.id &&
                  !sprintList?.reduce(
                    (t, c) => t + (c?.children?.length || 0),
                    0
                  )
                }
              >
                <div className="empty-text">该空间目前还没{sprintDesc}</div>
              </ConditionComponent>
              {sprintList?.map((v) => {
                if (!v?.children?.length) {
                  return null;
                }
                return (
                  <div className="task-group" key={v.id}>
                    <div className="task-title">{v.label}</div>
                    {v.children
                      ?.filter((item) =>
                        item?.name?.includes(searchSprintStr || "")
                      )
                      ?.map((t) => {
                        const currentSprintIsRelated =
                          relatedSprintIds?.includes(t?.id);
                        return (
                          <RelatedSprintCard
                            showLink={!currentSprintIsRelated}
                            currentSprintIsLinked={currentSprintIsRelated}
                            sprintItem={t}
                            handleMenu={handleMenu}
                          />
                        );
                      })}
                  </div>
                );
              })}
            </Spin>
          </div>
        </div>
      </Modal>
    </RelatedSprintWrapper>
  );
};

export default React.memo(RelatedSprint);
