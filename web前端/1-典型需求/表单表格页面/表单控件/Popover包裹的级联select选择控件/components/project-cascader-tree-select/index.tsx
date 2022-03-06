import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Popover, Avatar, Empty, Spin, TreeSelect } from "@com/sun";
import { useSearch } from "@/hooks";
import { IProjectSimpleItem, getClassifyTree } from "@/service/team-member";
import { CheckOutlined } from "@ant-design/icons";
import { ConditionComponent } from "@/components/conditions";
import { PopoverContentWrapper, PopoverSelect } from "../styles";
import { mapTree } from "./utils";

interface IProjectCascaderTreeSelectProps {
  projectList: IProjectSimpleItem[];
  value?: { [key: string]: any };
  className?: string;
  placeholder?: string;
  onChange: (item?: { [key: string]: any }) => void;
}

const ProjectCascaderTreeSelect: React.FC<IProjectCascaderTreeSelectProps> =
  memo((props) => {
    const {
      value,
      projectList = [],
      className,
      placeholder = "请选择",
      onChange,
    } = props;
    const [visible, setVisible] = useState(false);

    const [selfValue, setSelfValue] = useState<string | undefined>(
      value?.title
    );
    const [selectedProject, setSelectedProject] =
      useState<IProjectSimpleItem>(); // 当前选中的空间

    const selectedProjectIdRef = useRef<string>(); // 当前选中的空间的id

    const [loading, setLoading] = useState<boolean>(false);
    const [curProjectClassifyTreeData, setCurProjectClassifyTreeData] =
      useState<IClassifyType[]>(); // 当前选中的空间的缺陷分类tree
    const [classifyTreeValue, setClassifyTreeValue] = useState<any>(); // 当前选中的缺陷分类treeNode

    // 搜索空间
    const { ele, searchVal } = useSearch({
      allowClear: true,
      placeholder: "请输入空间",
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
        setClassifyTreeValue(undefined);
      }
    }, [value]);

    // 获取选择空间下的缺陷分类
    const fetchProjectBugClassifyTreeData = useCallback(async (projectItem) => {
      if (!projectItem?.id) {
        return;
      }
      setLoading(true);
      selectedProjectIdRef.current = projectItem?.id;

      const { success, result } = await getClassifyTree(
        projectItem?.id,
        "tasktype3"
      ).finally(() => setLoading(false));
      if (success && selectedProjectIdRef.current === projectItem?.id) {
        const handleTreeData = (node) => {
          const data = mapTree(
            node,
            (node) => {
              return {
                label: node?.name,
                value: node?.id,
                children: node?.subClassifies,
              };
            },
            "subClassifies"
          );
          return [data];
        };
        const handledTreeData = handleTreeData(result || {});
        setCurProjectClassifyTreeData(handledTreeData || []);
      }
    }, []);

    const onTreeSelectChange = useCallback(
      (nodeValue, label) => {
        setClassifyTreeValue(nodeValue);
        onChange?.({
          id: nodeValue,
          title: label?.[0],
          selectedProjectId: selectedProject?.id,
        });
      },
      [onChange, selectedProject]
    );

    // 当前展示的空间列表
    const filteredProjectList = useMemo(() => {
      return projectList?.filter((item) =>
        item?.name?.includes(searchVal || "")
      );
    }, [searchVal, projectList]);

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
                          fetchProjectBugClassifyTreeData?.(item);
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
                  <div className="header">
                    <TreeSelect
                      style={{ width: "100%" }}
                      allowClear
                      showSearch
                      treeDefaultExpandAll
                      treeNodeFilterProp="label"
                      placeholder="请选择缺陷分类"
                      value={classifyTreeValue}
                      treeData={curProjectClassifyTreeData}
                      onChange={onTreeSelectChange}
                    />
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
            onChange?.();
          }}
        />
      </Popover>
    );
  });

ProjectCascaderTreeSelect.defaultProps = {};

export default ProjectCascaderTreeSelect;
