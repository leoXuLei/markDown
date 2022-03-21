import React, { useState, useCallback, useEffect, useMemo } from "react";
import classnames from "classnames";
import styled from "@emotion/styled";
import {
  DeleteOutlined,
  CloudDownloadOutlined,
  FileMarkdownOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { Empty, Spin } from "antd";
import { downloadResource, sortResource } from "client/blocks/works/utils";
import Loading from "client/components/loading";
import { toArray } from "client/utils/to-array";
import { EMPTY_ARRAY } from "client/utils/emptyArray";
import { trackingRender } from "client/utils/wdyr";
import { ResourceAction } from "../";
import { ListToolbar } from "./list-toolbar";
import { ResourceItem } from "./resource-item";
import {
  useResourceAction,
  IMoveCopyResourceType,
} from "../../contexts/resource-action-context";

const Container = styled.div`
  min-height: 400px;
`;

const Label = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;

  &.sortable:hover {
    color: #1b9aee;
  }

  &.sorting.ascending::after {
    content: "";
    width: 0;
    height: 0;
    margin-left: 5px;
    vertical-align: middle;
    border-bottom: 4px solid;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }

  &.sorting:not(.ascending)::after {
    content: "";
    width: 0;
    height: 0;
    margin-left: 5px;
    vertical-align: middle;
    border-top: 4px solid;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
  }
`;

const BulkWrapper = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-auto-flow: column;
  justify-content: start;
  align-items: center;
  font-size: 15px;
  line-height: 20px;

  svg {
    width: 15px;
    height: 15px;
  }
`;

interface ISortOption {
  key: keyof IResource;
  ascending: boolean;
}

const defaultSortOption: ISortOption = { key: "name", ascending: true };

interface IResourceListProps {
  resources: IResource[];
  loading: boolean;
  viewType: IViewRadioType;
}

export const ResourceList = React.memo(
  ({ resources = EMPTY_ARRAY, loading, viewType }: IResourceListProps) => {
    const { remove, openMoveCopyModal } = useResourceAction();
    const [selectedItems, setSelectedItems] = useState<string[]>(EMPTY_ARRAY);

    const [sorting, setSorting] = useState<ISortOption>(defaultSortOption);

    const [list, setSortedList] = useState<IResource[]>();

    useEffect(() => {
      if (resources.length === 0) {
        setSelectedItems(EMPTY_ARRAY);
        return;
      }

      if (selectedItems.length === 0) {
        return;
      }

      const idList = resources.map((res) => res.id);
      setSelectedItems((items) => {
        if (items.length === 0) {
          return items;
        }
        return items.filter((id) => idList.includes(id));
      });
    }, [resources, selectedItems.length]);

    useEffect(() => {
      if (resources.length === 0) {
        setSelectedItems(EMPTY_ARRAY);
        setSortedList(EMPTY_ARRAY);
        return;
      }

      setSortedList(
        sorting.ascending
          ? sortResource(resources, sorting.key)
          : sortResource(resources, sorting.key).reverse()
      );
    }, [sorting, resources]);

    const handleSort = useCallback(
      (key: keyof IResource) => {
        if (key === sorting.key) {
          setSorting({ key, ascending: !sorting.ascending });
        } else {
          setSorting({ key, ascending: true });
        }
      },
      [sorting]
    );

    const handleSelectAll = useCallback(
      (checked: boolean) => {
        if (checked) {
          setSelectedItems(resources.map((res) => res.id));
        } else {
          setSelectedItems(EMPTY_ARRAY);
        }
      },
      [resources]
    );

    const handleSelect = useCallback((id: string) => {
      /** 用回调的方式，可以避免由 selectItems 变化导致的 hook 依赖项更新 */
      setSelectedItems((selectedItems) => {
        const _selected = [...selectedItems];

        if (_selected.includes(id)) {
          const index = _selected.indexOf(id);
          _selected.splice(index, 1);
        } else {
          _selected.push(id);
        }
        return _selected;
      });
    }, []);

    const isSelected = useCallback(
      (id: string) => selectedItems.includes(id),
      [selectedItems]
    );

    const handleDownload = useCallback(() => {
      const list = resources
        .filter((res) => selectedItems.includes(res.id))
        .filter((res) => !res.directory);
      downloadResource(list);
    }, [resources, selectedItems]);

    const handleMoveCopyFile = useCallback(
      (type: IMoveCopyResourceType) => {
        const list =
          resources?.filter((res) => selectedItems.includes(res.id)) || [];
        openMoveCopyModal?.({
          type,
          resourceList: list,
        });
      },
      [resources, selectedItems, openMoveCopyModal]
    );

    const handleDelete = useCallback(
      (selectedKeys: string | string[]) => {
        const keys = toArray(selectedKeys);
        const list = resources.filter((res) => keys.includes(res.id));
        remove({ list });
      },
      [remove, resources]
    );

    const createLabel = useCallback(
      (key: keyof IResource, name: string, sortable: boolean) => {
        return (
          <Label
            key={key}
            className={classnames({
              sortable,
              sorting: sorting.key === key,
              ascending: sorting.ascending,
            })}
            onClick={() => {
              if (sortable) {
                handleSort(key);
              }
            }}
          >
            {name}
          </Label>
        );
      },
      [handleSort, sorting.ascending, sorting.key]
    );

    const labels = useMemo(
      () => (
        <>
          {createLabel("name", "名称", true)}
          {createLabel("size", "大小", true)}
          {createLabel("gmtModified", "更新时间", true)}
        </>
      ),
      [createLabel]
    );

    const actions = useMemo(
      () => (
        <BulkWrapper>
          <span>{`已选择 ${selectedItems.length} 项`}</span>
          <ResourceAction onClick={handleDownload}>
            <CloudDownloadOutlined />
            下载
          </ResourceAction>

          <ResourceAction onClick={() => handleMoveCopyFile("move")}>
            <FileMarkdownOutlined />
            移动
          </ResourceAction>

          <ResourceAction onClick={() => handleMoveCopyFile("copy")}>
            <CopyOutlined />
            复制
          </ResourceAction>

          <ResourceAction onClick={() => handleDelete(selectedItems)}>
            <DeleteOutlined />
            移到回收站
          </ResourceAction>
        </BulkWrapper>
      ),
      [selectedItems, handleDownload, handleDelete, handleMoveCopyFile]
    );

    return (
      <Container>
        <ListToolbar
          checked={list?.length! > 0 && selectedItems.length === list?.length}
          viewType={viewType}
          onChecked={handleSelectAll}
        >
          {selectedItems.length > 0 ? actions : labels}
        </ListToolbar>

        {!loading && list?.length === 0 && (
          <Empty description={false} style={{ padding: "100px 0" }} />
        )}
        <Spin spinning={loading}>
          {list?.map((res) => (
            <ResourceItem
              key={res.id}
              resource={res}
              selected={isSelected(res.id)}
              viewType={viewType}
              onSelect={handleSelect}
            />
          ))}
        </Spin>
      </Container>
    );
  }
);

ResourceList.displayName = "ResourceList";

trackingRender(ResourceList);
