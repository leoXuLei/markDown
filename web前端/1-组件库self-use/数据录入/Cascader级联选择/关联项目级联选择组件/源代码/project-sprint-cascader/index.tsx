/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { Cascader, Tag, Tooltip, Divider, Spin } from "@com/sun";
import React, { useEffect, useState, useCallback } from "react";
import {
  getProjectBasicListByList,
  getStarProject,
} from "client/ekko/services/project";
import useAppSelector from "client/hooks/use-app-selector";
import {
  getSprintList,
  getCanBeRelatedSprintList,
  linkSprint,
  unLinkSprint,
} from "client/ekko/services/sprint";
import * as styles from "./styles";

export interface IOption {
  label?: string;
  value?: string;
  children?: IOption[];
  isLeaf?: boolean;
  nodeLabel?: string;
  loading?: boolean;
}

const getCurLabels = (arr: any[] = []) =>
  arr?.reduce(
    (t: string, item: IOption) => (!t ? item.label : `${t}-${item.label}`),
    ""
  );

export const getNodePropertyByKey = (arr: any[], key = "nodeLabel") => {
  return arr?.length ? arr[arr?.length - 1][key] : null;
};

const ProjectSprintSelect: React.FC<{
  onChange?: (v: any) => void;
  value?: any[];
  mode?: "create" | "edit"; // 新建迭代 | 迭代概览页面
  staffId: string;
  allowClear?: boolean;
  sprint?: ISprintListItem;
  visible?: boolean;
  onRefresh?(): void;
}> = (props) => {
  const project = useAppSelector((state) => state.project);

  const desc = project?.detail?.sprintNickname ?? "迭代";

  const [options, setOptions] = useState<IOption[]>([]);

  const [loading, setLoading] = useState(false);

  const {
    value = [],
    staffId,
    allowClear = true,
    mode = "create",
    sprint,
    visible,
    onRefresh,
    onChange,
  } = props;

  const modeIsEdit = mode === "edit"; // 迭代概览页面

  const relatedSprint =
    sprint?.linkedContentResponseDTO?.linkedContent?.sprints;

  const sprintId = sprint?.id;

  const getProjectSprintList = useCallback(async () => {
    if (!staffId) {
      return;
    }
    setLoading(true);

    const allProjectListRes: any = await Promise.all([
      // 获取业务线下的空间列表
      getProjectBasicListByList({
        staffId,
      }),
      // 我收藏的空间列表
      getStarProject(),
    ]);
    const basicProjectList = allProjectListRes[0]?.success
      ? allProjectListRes[0]?.result?.content
      : [];
    const starProjectList = allProjectListRes[1]?.success
      ? allProjectListRes[1]?.result
      : [];
    const basicProjectIds = basicProjectList?.map((v: any) => v?.id);
    const allProjectList = basicProjectList?.concat(
      starProjectList?.reduce((total: any[], startProjectItem) => {
        const { name, projectId } = startProjectItem || {};
        if (projectId && !basicProjectIds?.includes(projectId)) {
          return total.concat({
            id: projectId,
            name,
          });
        }
        return total;
      }, [])
    );
    setLoading(false);

    if (allProjectList?.length) {
      const projectSprintsOptions: IOption[] = allProjectList?.map(
        (projectItem) => {
          const { id, name } = projectItem;
          return {
            value: id,
            label: name,
            isLeaf: false,
          };
        }
      );
      setOptions(projectSprintsOptions);
      // 迭代概览编辑页面 处理初始值
      if (modeIsEdit) {
        const handledInitialValue = projectSprintsOptions?.reduce(
          (optionTotal: IOption[], option) => {
            const { label, value } = option;
            const childrenOption = relatedSprint?.reduce(
              (sprintTotal: IOption[], relatedSprintItem) => {
                const { projectId, id, name } = relatedSprintItem;
                if (projectId === value) {
                  return sprintTotal.concat({
                    value: id,
                    label: name,
                    nodeLabel: `${label}-${name}`,
                  });
                }
                return sprintTotal;
              },
              []
            );
            const optionToAdd = childrenOption
              ? (childrenOption?.map((childrenOptionItem) => [
                  option,
                  childrenOptionItem,
                ]) as IOption[])
              : [];

            return optionTotal.concat(optionToAdd);
          },
          []
        );
        onChange?.(handledInitialValue);
      }
    }
  }, [staffId, modeIsEdit, relatedSprint, onChange]);

  useEffect(() => {
    if (!modeIsEdit && visible) {
      getProjectSprintList();
      return;
    }
    if (modeIsEdit) {
      getProjectSprintList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, sprint]);

  const onRelatedSprintSelect = useCallback(
    async (id) => {
      // setLoading(true)
      const res = await linkSprint(sprintId!, "sprint", {
        linkedEntityId: id,
        linkedEntityType: "sprint",
      });
      // setLoading(false)
      if (res?.success) {
        onRefresh?.();
      }
      // setLoading(false)
    },
    [sprintId, onRefresh]
  );

  const onRelatedSprintDeselect = useCallback(
    async (id) => {
      // setLoading(true)
      const linkedSprintItem = relatedSprint?.find?.(
        (sprintitem) => sprintitem.id === id
      );
      if (linkedSprintItem) {
        const res = await unLinkSprint(linkedSprintItem?.linkedContentId);
        // setLoading(false)
        if (res.success) {
          onRefresh?.();
        }
      }
      // setLoading(false)
    },
    [relatedSprint, onRefresh]
  );

  const onCloseTag = useCallback(
    (selectedOption, index) => {
      if (modeIsEdit) {
        const curNodeValue = getNodePropertyByKey(selectedOption, "value");
        onRelatedSprintDeselect(curNodeValue);
      } else {
        onChange?.(value?.filter((_, i) => i !== index));
      }
    },
    [modeIsEdit, value, onRelatedSprintDeselect, onChange]
  );

  const onCascaderChange = useCallback(
    (nowValue, selectedOptions) => {
      // 清除所有
      if (!modeIsEdit && !selectedOptions?.length) {
        return onChange?.([]);
      }
      // 选择第一级时返回
      if (selectedOptions?.length !== 2) {
        return;
      }
      const copiedOptions = [...selectedOptions];
      const curNodeLabel = getCurLabels(copiedOptions); // 记录当前节点label
      const curNodeValue = getNodePropertyByKey(copiedOptions, "value"); // 记录当前节点value
      copiedOptions[copiedOptions?.length - 1].nodeLabel = curNodeLabel;

      const allNodeLabels = value?.reduce(
        (labelTotal: string[], nodeList: IOption[]) => {
          const labelToAdd = getNodePropertyByKey(nodeList);
          return labelTotal.concat(labelToAdd ? [labelToAdd] : []);
        },
        []
      );
      // 未存在节点新增
      if (!allNodeLabels?.includes(curNodeLabel)) {
        if (modeIsEdit) {
          onRelatedSprintSelect(curNodeValue);
        } else {
          onChange?.([...value, selectedOptions]);
        }
        return;
      }

      // 已存在节点删除
      if (modeIsEdit) {
        onRelatedSprintDeselect(curNodeValue);
      } else {
        onChange?.(
          value?.filter((nodeList: IOption[]) => {
            const nodeLabel = getNodePropertyByKey(nodeList);
            return nodeLabel && nodeLabel !== curNodeLabel;
          })
        );
      }
    },
    [
      modeIsEdit,
      value,
      onChange,
      onRelatedSprintDeselect,
      onRelatedSprintSelect,
    ]
  );

  const loadData = useCallback(
    async (selectedOptions: IOption[]) => {
      const targetOption = selectedOptions[selectedOptions.length - 1];
      targetOption.loading = true;

      let sprintsRes;
      if (modeIsEdit) {
        // 当前空间下当前迭代可以去关联的迭代列表
        const canBeRelatedSprintsRess: IBasicApi<CanBeRelatedSprintItemVO[]> =
          await getCanBeRelatedSprintList(targetOption.value!, sprintId!);
        sprintsRes = canBeRelatedSprintsRess;
      } else {
        // 空间列表下的迭代列表
        const allSprintsRess: IBasicApi<IPageApi<ISprintListItem[]>> =
          await getSprintList(targetOption.value!);
        sprintsRes = allSprintsRess;
      }
      targetOption.loading = false;

      const sprintsContent =
        (modeIsEdit ? sprintsRes?.result : sprintsRes?.result?.content) || [];

      const sprintsData = sprintsRes?.success ? sprintsContent : [];

      targetOption.children = sprintsData?.map((sprintItem) => ({
        value: sprintItem?.id,
        label: sprintItem?.name,
      }));
      setOptions([...options]);
    },
    [modeIsEdit, sprintId, options]
  );

  return (
    <Spin spinning={loading}>
      <Cascader
        css={styles.cascaderCss}
        style={modeIsEdit ? { width: 250 } : {}}
        // bordered={!modeIsEdit}
        // disabled={loading}
        allowClear={allowClear}
        options={options}
        placeholder={`请选择空间下的${desc}进行关联`}
        value={value}
        loadData={(selectedOptions) => {
          loadData(selectedOptions as IOption[]);
        }}
        changeOnSelect
        onChange={onCascaderChange}
        displayRender={(label, selectedOptions) => {
          const selectedOptionData = !selectedOptions?.length
            ? value
            : [...value, selectedOptions];
          const tooltipTitle = (selectedOptionData || [])
            ?.reduce((titleTotal, optionItem) => {
              const titleItem = getNodePropertyByKey(optionItem, "label");
              return titleItem ? titleTotal.concat(titleItem) : titleTotal;
            }, [])
            ?.join("、");

          return (
            <Tooltip title={tooltipTitle}>
              {(selectedOptionData || [])?.map((selectedOption, index) => {
                const nodeLabel = getNodePropertyByKey(selectedOption, "label");
                if (!nodeLabel) {
                  return null;
                }
                return (
                  <Tag
                    closable
                    key={nodeLabel}
                    onClose={() => onCloseTag(selectedOption, index)}
                  >
                    {nodeLabel}
                  </Tag>
                );
              })}
            </Tooltip>
          );
        }}
      />
    </Spin>
  );
};

export default React.memo(ProjectSprintSelect);
