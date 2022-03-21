import React, { useCallback, useMemo, useState } from "react";
import moment from "moment";
import styled from "@emotion/styled";
import {
  DeleteOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Input, Tooltip } from "antd";
import { trackingRender } from "client/utils/wdyr";
import { useResourceLink } from "client/blocks/works/hooks";
import { formatSize } from "client/utils/format-size";
import { FileIcon, IFileType } from "../file-icon";
import { downloadResource } from "../../utils";
import { BaseItem } from "./base-item";
import { useResourceAction } from "../../contexts/resource-action-context";

export const FileTitle = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  justify-content: start;
  align-items: center;
  width: 100%;
`;

export const Item = styled(BaseItem)`
  cursor: pointer;

  &:hover {
    background: #f7f7f7;
  }

  .list-item__content {
    border-bottom: 1px solid #f7f7f7;
  }

  .list-item__handler {
    pointer-events: none;
    opacity: 0;

    svg {
      width: 16px;
      height: 16px;
      color: #8c8c8c;

      &:hover {
        color: #1b9aee;
      }
    }
  }

  &:hover > .list-item__handler {
    pointer-events: auto;
    opacity: 1;
  }
`;

const EditInput = styled(Input)`
  margin-right: 16px;
  padding: 0 4px;
`;

interface IResourceItemProps {
  resource: IResource;
  selected: boolean;
  viewType?: IViewRadioType;
  onSelect: (id: string) => void;
}

export const ResourceItem = React.memo(
  ({ resource, selected, viewType, onSelect }: IResourceItemProps) => {
    const nav = useResourceLink();
    const { rename, remove, upload } = useResourceAction();

    const [editable, setEditable] = useState(false);

    const { id, directory } = resource;

    const toDetail = useCallback(() => {
      if (directory) {
        nav.toDirectory(id);
      } else {
        nav.toFile(id);
      }
    }, [directory, nav, id]);

    const handleDelete = useCallback(() => {
      remove({ list: [resource] });
    }, [remove, resource]);

    const handleDownload = useCallback(() => {
      downloadResource(resource);
    }, [resource]);

    const handleSelect = useCallback(() => {
      onSelect?.(id);
    }, [onSelect, id]);

    const handleUpdate = useCallback(async () => {
      upload({ multiple: false, resourceId: resource.id });
    }, [upload, resource.id]);

    const handleEditName = useCallback(() => {
      setEditable(true);
    }, []);

    const handleRename = useCallback(
      async (event: any) => {
        if (!event.target) {
          return;
        }

        const newName = (event.target as HTMLInputElement).value as string;

        if (!newName) {
          return;
        }

        if (newName !== resource.name) {
          rename?.({ resourceId: resource.id, fileName: newName });
        }

        setEditable(false);
      },
      [resource.name, resource.id, rename]
    );

    const handler = useMemo(
      () => (
        <>
          {!resource.directory && (
            <>
              <Tooltip title="下载">
                <CloudDownloadOutlined onClick={handleDownload} />
              </Tooltip>
              <Tooltip title="更新">
                <CloudUploadOutlined onClick={handleUpdate} />
              </Tooltip>
            </>
          )}
          <Tooltip title="重命名">
            <EditOutlined onClick={handleEditName} />
          </Tooltip>
          <Tooltip title="移动到回收站">
            <DeleteOutlined onClick={handleDelete} />
          </Tooltip>
        </>
      ),
      [
        handleDownload,
        resource.directory,
        handleUpdate,
        handleEditName,
        handleDelete,
      ]
    );

    const children = useMemo(
      () => (
        <>
          <FileTitle>
            <FileIcon
              directory={resource.directory ?? false}
              extension={resource.name?.split(".").pop() as IFileType}
            />
            {editable ? (
              <EditInput
                autoFocus
                defaultValue={resource.name}
                onBlur={handleRename}
                onPressEnter={handleRename}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              resource.name
            )}
          </FileTitle>
          <div>{resource.directory ? "-" : formatSize(resource.size)}</div>
          <div>
            {resource.directory || !resource.gmtModified
              ? "-"
              : moment(resource.gmtModified).calendar()}
          </div>
        </>
      ),
      [resource, editable, handleRename]
    );

    return (
      <Item
        onClick={toDetail}
        key={resource.id}
        checked={selected}
        onChecked={handleSelect}
        viewType={viewType}
        handler={handler}
      >
        {children}
      </Item>
    );
  }
);

ResourceItem.displayName = "ResourceItem";
trackingRender(ResourceItem);
