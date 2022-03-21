import React, {
  memo,
  useState,
  useRef,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { Empty, Spin, Input, Tooltip } from "antd";
import classnames from "classnames";
import { Icon } from "@com/omps-ui";
import useDebounce from "@/hooks/use-debounce";
import {
  getProjectBasicInfoList,
  getStarProjects,
} from "client/ekko/services/project";
import { ConditionComponent } from "client/components/conditions";
import { MainProjectContext } from "client/blocks/common/main-project-context";
import { ProjectListWrapper } from "./styles";

export type ISelectProject = { id: string; name?: string };

interface IProjectListProps {
  selectProject: ISelectProject;
  onSelectProject: (project: ISelectProject) => void;
}

const ProjectList = memo<IProjectListProps>((props) => {
  const { selectProject, onSelectProject } = props;
  const context = useContext(MainProjectContext)!;

  const [defaultProject, setDefaultProject] = useState<IProjectDetail | null>(); // 默认空间

  // 收藏空间列表
  const [starProjects, setStarProjects] =
    useState<Array<{ projectId: string; name: string }>>();

  // 参与空间列表
  const [myProjects, setMyProjects] = useState<IProjectDetail[]>();

  // 用来取用户输入的值
  const inputRef = useRef<any>(null);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchProjectList, setSearchProjectList] = useState<
    IProjectDetail[] | null
  >(null); // 搜索结果：空间列表
  const [searchedProjects, setSearchedProjects] = useState<IProjectDetail[]>(); // 搜索过的空间列表（并点击过）

  useEffect(() => {
    if (context.project) {
      setDefaultProject(context.project);
    }
  }, [context.project]);

  const getProjects = useCallback(async () => {
    const [res1, res2] = await Promise.all([
      getStarProjects(),
      getProjectBasicInfoList({
        staffId: (context.user as IompsUser)?.staffId,
      }),
    ]);
    if (res1.success) {
      setStarProjects(res1.result);
    }
    if (res2.success) {
      setMyProjects(res2.result?.content);
    }
    if (context.project) {
      onSelectProject(context.project);
    } else {
      const firstStarProject = res1.result?.[0]
        ? {
            id: res1.result?.[0]?.projectId,
            name: res1.result?.[0]?.name,
          }
        : undefined;
      const handledProject = res2.result?.content?.[0] || firstStarProject;
      if (handledProject) {
        onSelectProject(handledProject);
      }
    }
  }, [context.user, context.project, onSelectProject]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  // 搜索空间
  const searchProject = useCallback(async (searchVal) => {
    // 如果搜索值为空就不请求
    const newVal = searchVal?.trim();
    if (!newVal) {
      setSearchProjectList(null);
      return;
    }
    setSearchLoading(true);
    const res = await getProjectBasicInfoList({ fuzzyName: newVal });
    setSearchLoading(false);
    if (res.success) {
      setSearchProjectList(res?.result?.content || []);
    }
  }, []);

  // 防抖来一个
  const handleInputChange = useCallback(
    useDebounce(() => {
      searchProject(inputRef.current?.state?.value);
    }, 300),
    [searchProject]
  );
  // 给匹配到的字符染色
  const colorString = useCallback((val) => {
    const searchVal = inputRef.current?.state?.value;
    if (!searchVal) return val;
    return val.replace(
      new RegExp(searchVal?.trim(), "gi"),
      (match) => `<span class='matched-text' >${match}</span>`
    );
  }, []);

  return (
    <ProjectListWrapper>
      <div className="search-project">
        <i className="search-icon">
          <Icon type={"search-bar"} />
        </i>
        <Input
          autoFocus
          ref={inputRef}
          bordered={false}
          allowClear
          placeholder="请搜索空间"
          onChange={handleInputChange}
          onPressEnter={handleInputChange}
        />

        <div className="project-list">
          <Spin spinning={searchLoading} size="small">
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
                          (prev || [])?.filter((item) => item?.id !== v.id)
                        )
                        ?.slice(0, 5);
                    });
                    onSelectProject(v);
                    setSearchProjectList(null);
                  }}
                >
                  <span
                    className="item-name"
                    dangerouslySetInnerHTML={{ __html: colorString(v?.name) }}
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
        <ConditionComponent isShow={!!searchedProjects}>
          <div className="project-select-group">
            <div className="project-select-group-title">我搜索的空间</div>
            <div className="project-select-group-list">
              {searchedProjects?.map((c) => {
                return (
                  <div
                    className={classnames(
                      "project-select-group-list-item",
                      c?.id === selectProject?.id &&
                        "project-select-group-list-item-active"
                    )}
                    key={c?.id}
                    onClick={() => onSelectProject(c)}
                  >
                    <Tooltip title={c?.name}>{c?.name}</Tooltip>
                  </div>
                );
              })}
            </div>
          </div>
        </ConditionComponent>

        <div className="project-select-group">
          <div className="project-select-group-title">当前空间</div>
          <div className="project-select-group-list">
            <div
              className={classnames(
                "project-select-group-list-item",
                defaultProject?.id === selectProject?.id &&
                  "project-select-group-list-item-active"
              )}
              key={defaultProject?.id}
              onClick={() => onSelectProject(defaultProject!)}
            >
              <Tooltip title={defaultProject?.name}>
                {defaultProject?.name}
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="project-select-group">
          <div className="project-select-group-title">我收藏的空间</div>
          <div className="project-select-group-list">
            {starProjects?.map((c) => {
              return (
                <div
                  className={classnames(
                    "project-select-group-list-item",
                    c.projectId === selectProject?.id &&
                      "project-select-group-list-item-active"
                  )}
                  key={c.projectId}
                  onClick={() =>
                    onSelectProject({
                      id: c.projectId,
                    })
                  }
                >
                  <Tooltip title={c?.name}>{c?.name}</Tooltip>
                </div>
              );
            })}
          </div>
        </div>

        <div className="project-select-group">
          <div className="project-select-group-title">我参与的空间</div>
          <div className="project-select-group-list">
            {myProjects?.map((c) => {
              return (
                <div
                  className={classnames(
                    "project-select-group-list-item",
                    c.id === selectProject?.id &&
                      "project-select-group-list-item-active"
                  )}
                  key={c.id}
                  onClick={() => onSelectProject(c)}
                >
                  <Tooltip title={c?.name}>{c?.name}</Tooltip>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProjectListWrapper>
  );
});

export default ProjectList;
