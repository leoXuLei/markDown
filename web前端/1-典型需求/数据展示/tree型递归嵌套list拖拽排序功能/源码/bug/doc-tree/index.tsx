/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import {
  CaretDownOutlined,
  CaretRightOutlined,
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { classnames } from "client/utils/common";
import React, { memo, useCallback, useState, useRef, useMemo } from "react";
import { useDrag, useDrop, DragObjectWithType } from "react-dnd";
import IfElseComponent, { ConditionComponent } from "../conditions";
import * as styles from "./styles";
import PopMenu from "../pop-menu";
import NewModal from "./new-category";
import AddChildModal from "@/components/doc-tree-demand/add-child-modal";
import { deleteClassify } from "client/ekko/services/task";
import { useLink } from "../link";
import { Tooltip } from "@com/sun";
import { ItemTypes } from "./ItemTypes";
import { taskTypeSortAndChangeParent } from "@/service/task";
import produce from "immer";

const buildDocTree = (item: IClassifyType) => ({
  executorInfo: item.executorInfo || {},
  title: `${item.name}`,
  count: item.count,
  doneCount: item.doneCount,
  key: item.id,
  item,
  subClassifies: item.subClassifies || [],
  canDelete: !item.systemTaskClassify,
  expanded: false,
  deep: item.deep || 0,
});

type ITree = {
  title: string;
  key: string;
  item: IClassifyType;
  count: number;
  canDelete: boolean;
  executorInfo: IUser;
  subClassifies: any[];
  deep: number;
  doneCount?: number;
};

export interface IDragDropItem extends DragObjectWithType {
  id: string;
  originalIndex: number;
  deep: number;
  title?: string;
}

interface IDocTreeProps {
  activeKey: string;
  treeData?: ITree;
  onSelect: (key: string) => void;
  params: {
    projectId: string;
    taskTypeId: string;
  };
  onRefresh: (sectionId?: string) => void;
  onExpandClick: () => void;
  expanded;
  label: string;
  id?: string;
  parentNodeId?: string;
  parentSubCards?: any[];
  parentMoveCardFun?: (id: string, to: number) => void;
  parentFindCardFun?: (id: string) => { index: number; card: any };
}

const DocTree: React.FC<IDocTreeProps> = memo((props) => {
  const {
    treeData,
    id,
    parentSubCards,
    parentNodeId,
    onExpandClick,
    parentMoveCardFun,
    parentFindCardFun,
    onRefresh,
  } = props;
  const count = treeData?.count || 0;
  const doneCount = treeData?.doneCount || 0;
  const [expanded, setExpanded] = useState(false);
  const [editItem, setEditItem] = useState<IClassifyType>();
  const [parentId, setParentId] = useState<any>();
  const [expandedMap, setExpandedMap] = useState<any>({});
  const router = useLink();

  const onDelete = useCallback(
    async (item) => {
      const res = await deleteClassify(
        props.params.projectId,
        props.params.taskTypeId,
        item.id
      );
      if (res.success) {
        props.onRefresh(item.id);
      }
    },
    [props]
  );

  const ref = useRef<HTMLDivElement>(null);
  const [subCards, setSubCards] = useState(props.treeData?.subClassifies || []);

  const originalIndex = id ? parentFindCardFun?.(id)?.index : 0;

  const type = useMemo(() => `${ItemTypes.CARD}-${treeData?.deep}`, [treeData]);

  // 拖放结束后保存最新排序
  const handleSortedList = useCallback(async () => {
    const { projectId } = props.params;
    // console.log(
    //   'handleSortedList',
    //   parentSubCards?.map((v) => ({ name: v.name, id: v.id })),
    // )
    if (projectId && parentNodeId) {
      const res = await taskTypeSortAndChangeParent(projectId, "taskTypeId3", {
        // id: parentNodeId, // 需要改变父分类的分类id
        ids: parentSubCards?.map((v) => v.id) || [], // 排序后的id列表
      });
      onRefresh?.(); // 有没有调用成功都需要刷新
    }
  }, [props.params, parentNodeId, parentSubCards, onRefresh]);

  // 拖
  const [{ isDragging }, dragRef] = useDrag({
    item: {
      type, // 每一层级使用不同的type才能在当前层级拖拽移动
      id,
      originalIndex,
      title: treeData?.title,
      deep: treeData?.deep,
    } as IDragDropItem,
    canDrag: (monitor) =>
      !!treeData?.deep && !treeData?.item?.systemTaskClassify,
    end: (item, monitor) => {
      const { id: droppedId, originalIndex } = item as IDragDropItem;
      const didDrop = monitor.didDrop();
      // console.log('useDrag end item', item)
      // 未放下则重置位置
      if (!didDrop) {
        parentMoveCardFun?.(droppedId, originalIndex);
        return;
      }
      handleSortedList();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 放下
  const [_, dropRef] = useDrop({
    accept: [type],
    hover: (item: IDragDropItem) => {
      const { id: draggedId, title, deep: draggedDeep } = item; // 拖动元素

      // 移到到同级元素上时交换位置
      if (id && draggedId !== id && draggedDeep === treeData?.deep) {
        const { index: overIndex } = parentFindCardFun?.(id) || {};
        console.log("useDrop hover item, title", item, treeData?.title, title);
        parentMoveCardFun?.(draggedId, overIndex!);
      }
    },
  });

  dragRef(dropRef(ref));

  const findCard = useCallback(
    (id: string) => {
      const card = subCards?.filter((c) => `${c?.id}` === id)?.[0];
      return {
        card,
        index: subCards?.indexOf?.(card),
      };
    },
    [subCards]
  );

  const moveCard = useCallback(
    (id: string, atIndex: number) => {
      const { card, index } = findCard?.(id);
      const lastest = produce(subCards, (draft) => {
        draft.splice(index, 1);
        draft.splice(atIndex, 0, card);
      });
      // console.log(
      //   'lastest',
      //   lastest?.map((v) => v.name),
      // )
      setSubCards(lastest);
    },
    [findCard, subCards, setSubCards]
  );

  // const [, dropParentRef] = useDrop({ accept: [type] })  // 加不加好像无影响

  if (!props.treeData) {
    return null;
  }

  return (
    <div
      css={styles.containerCss}
      style={{
        opacity: isDragging ? 0 : 1,
      }}
      ref={ref}
    >
      <div
        style={{
          paddingLeft: `${(treeData?.deep || 0) * 20}px`,
        }}
        className={classnames(
          "node-wrapper",
          props.activeKey === props.treeData?.key && "active",
          expanded && "expanded"
        )}
      >
        <div className="node">
          <div className="icon" onClick={onExpandClick}>
            {treeData?.subClassifies.length ? (
              <IfElseComponent
                if={<CaretDownOutlined />}
                else={<CaretRightOutlined />}
                checked={props.expanded}
              />
            ) : (
              <div className="dot" />
            )}
          </div>
          <div
            className="node-title"
            onClick={() => props.onSelect(treeData!.key)}
          >
            <Tooltip
              title={
                <div>
                  <div>{props.treeData.title}</div>
                  <div>
                    未完成 {count - doneCount}，总计 {count}
                  </div>
                </div>
              }
            >
              <span className="node-title-name">{props.treeData.title} · </span>
              <span className="node-title-rate">
                {count - doneCount}/{count}
              </span>
            </Tooltip>
          </div>
          <div className={`node-operator ${treeData?.canDelete ? "hide" : ""}`}>
            {treeData?.executorInfo && treeData?.executorInfo.comName
              ? `${treeData?.executorInfo.comName}(${treeData?.executorInfo.name})`
              : ""}
          </div>
          <ConditionComponent isShow={!!treeData?.canDelete}>
            <div className="operations">
              <div
                className="icon-more"
                onClick={() => setParentId(treeData?.key)}
              >
                <PlusCircleOutlined />
              </div>
              <PopMenu
                title={`${props.label}分类菜单`}
                menus={[
                  {
                    key: "detail",
                    label: `编辑${props.label}分类`,
                    icon: <EditOutlined />,
                  },
                  {
                    label: `删除${props.label}分类`,
                    icon: <DeleteOutlined />,
                    key: "delete",
                    message: {
                      title: `删除${props.label}分类`,
                      text: treeData?.count
                        ? "删除后此分类和其子分类将一并删除，对应任务上的分类信息也会清除。"
                        : "是否确定删除此分类？",
                    },
                  },
                ]}
                onMenuSelect={(key) => {
                  if (key === "detail") {
                    setEditItem(treeData?.item);
                  } else if (key === "delete") {
                    onDelete(treeData?.item);
                  }
                }}
              >
                <div className="icon-more">
                  <EllipsisOutlined />
                </div>
              </PopMenu>
            </div>
          </ConditionComponent>
        </div>
      </div>
      {/* <div ref={dropParentRef}> */}
      <div>
        <ConditionComponent isShow={props.expanded}>
          {subCards?.map((c) => (
            <DocTree
              key={c?.id}
              label="缺陷"
              activeKey={props.activeKey}
              onSelect={(v) => {
                if (v === c.key) {
                  return;
                }
                router.toBug(v);
              }}
              treeData={c ? buildDocTree(c) : undefined}
              params={props.params}
              onRefresh={(id?: string) => {
                if (id === c?.id) {
                  router.toBug("all");
                }
                props.onRefresh();
              }}
              expanded={expandedMap[c?.id]}
              onExpandClick={() => {
                setExpandedMap({
                  ...expandedMap,
                  ...(c?.id
                    ? {
                        [c.id]: !expandedMap[c.id],
                      }
                    : {}),
                });
              }}
              id={c?.id}
              parentNodeId={treeData?.item?.id}
              parentSubCards={subCards}
              parentMoveCardFun={moveCard}
              parentFindCardFun={findCard}
            />
          ))}
        </ConditionComponent>
      </div>
      <NewModal
        label={props.label}
        params={props.params}
        visible={!!editItem}
        onClose={() => setEditItem(undefined)}
        onRefresh={props.onRefresh}
        item={editItem}
      />
      <AddChildModal
        type="bug"
        visible={!!parentId}
        onClose={() => setParentId("")}
        params={props.params}
        parentId={parentId}
        onRefresh={props.onRefresh}
      />
    </div>
  );
});

export default DocTree;
