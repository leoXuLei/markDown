import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Popover, Avatar, Empty, Spin } from "@com/sun";
import useSearch from "@/hooks/use-search";
import { IProjectSimpleItem } from "@/service/team-member";
import { CheckOutlined } from "@ant-design/icons";
import { ConditionComponent } from "@/components/conditions";
import { PopoverContentWrapper, PopoverSelect } from "../styles";

interface IProjectCascaderSelectProps {
  projectList: IProjectSimpleItem[];
  value?: { [key: string]: any };
  className?: string;
  placeholder?: string;
  onChange: (item?: { [key: string]: any }) => void;
  feachRightListService: (data: any) => IBasicApiPromise<any[]>;
  rightListHandleFun: (item: any) => { id: string; title: string };
}

const ProjectCascaderSelect: React.FC<IProjectCascaderSelectProps> = memo(
  (props) => {
    const {
      value,
      projectList = [],
      className,
      placeholder = "请选择",
      onChange,
      feachRightListService,
      rightListHandleFun,
    } = props;
    const [visible, setVisible] = useState(false);

    const [selfValue, setSelfValue] = useState<string | undefined>(
      value?.title
    );
    const [selectedProject, setSelectedProject] =
      useState<IProjectSimpleItem>(); // 当前选中的空间

    const selectedProjectIdRef = useRef<string>(); // 当前选中的空间的id

    const [loading, setLoading] = useState<boolean>(false);
    const [curProjectRightList, setCurProjectRightList] = useState<any[]>(); // 当前选中的空间的右侧xx资源列表
    const [selectedProjectRightItem, setSelectedProjectRightItem] =
      useState<any>(); // 当前选中的xx资源item

    // 搜索空间
    const { ele, searchVal } = useSearch({
      allowClear: true,
      placeholder: "请输入空间",
    });

    // 搜索空间下的测试计划
    const { ele: rightEle, searchVal: rightSearchVal } = useSearch({
      allowClear: true,
      placeholder: "请输入测试计划",
    });

    useEffect(() => {
      setSelectedProject((prev) => {
        if (projectList?.find?.((item) => item?.id === prev?.id)) {
          return prev;
        }
        return undefined;
      });
    }, [projectList]);

    useEffect(() => {
      setSelfValue(value?.title);
      if (!value?.title) {
        setSelectedProjectRightItem(undefined);
      }
    }, [value]);

    // 获取选择空间下的右侧xx资源列表
    const fetchProjectRightList = useCallback(
      async (projectItem) => {
        if (!projectItem?.id) {
          return;
        }
        setLoading(true);
        selectedProjectIdRef.current = projectItem?.id;

        const { success, result } = await feachRightListService({
          projectId: projectItem?.id,
        }).finally(() => setLoading(false));
        if (success && selectedProjectIdRef.current === projectItem?.id) {
          setCurProjectRightList((result || [])?.map(rightListHandleFun));
        }
      },
      [feachRightListService, rightListHandleFun]
    );

    // 当前展示的空间列表
    const filteredProjectList = useMemo(() => {
      return projectList?.filter((item) =>
        item?.name?.includes(searchVal || "")
      );
    }, [searchVal, projectList]);

    // 当前展示的右侧xx资源列表
    const filteredCurProjectRightList = useMemo(() => {
      return curProjectRightList?.filter((item) =>
        item?.title?.includes(rightSearchVal || "")
      );
    }, [rightSearchVal, curProjectRightList]);

    return (
      <Popover
        visible={visible}
        onVisibleChange={(visible) => {
          setVisible(visible);
        }}
        trigger="click"
        overlayClassName="popselect-overlay"
        overlayStyle={{
          width: selectedProject ? "560px" : "280px",
        }}
        placement="bottomLeft"
        content={
          <PopoverContentWrapper>
            <div className="left">
              <div className="header">{ele}</div>
              <div className="project-list">
                <ConditionComponent isShow={!!filteredProjectList?.length}>
                  {filteredProjectList?.map((item) => {
                    const checked = item?.id === selectedProject?.id;
                    return (
                      <div
                        key={item?.id}
                        className="tag-item"
                        onClick={() => {
                          setSelectedProject(item);
                          fetchProjectRightList?.(item);
                        }}
                      >
                        <div className="tag-item-name" title={item?.name}>
                          <Avatar
                            shape="square"
                            size="small"
                            src={item?.icon}
                          />
                          {item?.name}
                        </div>
                        <div className="check-icon">
                          {checked && <CheckOutlined />}
                        </div>
                      </div>
                    );
                  })}
                </ConditionComponent>

                <ConditionComponent isShow={!filteredProjectList?.length}>
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无空间数据"
                  />
                </ConditionComponent>
              </div>
            </div>

            <ConditionComponent isShow={!!selectedProject}>
              <div className="right">
                <Spin spinning={loading}>
                  <div className="header">{rightEle}</div>

                  <div className="resource-list">
                    <ConditionComponent
                      isShow={!!filteredCurProjectRightList?.length}
                    >
                      {filteredCurProjectRightList?.map((item) => {
                        const checked =
                          item?.id === selectedProjectRightItem?.id;
                        return (
                          <div
                            key={item?.id}
                            className="tag-item"
                            onClick={() => {
                              if (checked) {
                                setSelectedProjectRightItem(undefined);
                                onChange?.();
                                return;
                              }
                              setSelectedProjectRightItem(item);
                              onChange?.({
                                ...item,
                                selectedProjectId: selectedProject?.id,
                              });
                            }}
                          >
                            <div className="tag-item-name" title={item?.title}>
                              {item?.title}
                            </div>
                            <div className="check-icon">
                              {checked && <CheckOutlined />}
                            </div>
                          </div>
                        );
                      })}
                    </ConditionComponent>

                    <ConditionComponent
                      isShow={!filteredCurProjectRightList?.length}
                    >
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无测试计划数据"
                      />
                    </ConditionComponent>
                  </div>
                </Spin>
              </div>
            </ConditionComponent>
          </PopoverContentWrapper>
        }
      >
        <PopoverSelect
          open={false}
          allowClear
          value={selfValue}
          className={className}
          placeholder={placeholder}
          onChange={(v) => {
            setSelectedProjectRightItem(undefined);
            onChange?.();
            // if (typeof v === 'undefined' && visible) {
            //   setVisible(false)
            // }
          }}
        />
      </Popover>
    );
  }
);

ProjectCascaderSelect.defaultProps = {};

export default ProjectCascaderSelect;
