import styled from "@emotion/styled";
import { Select } from "antd";

export const PopoverContentWrapper = styled.div`
  width: 560px;
  display: flex;
  .tag-item {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0px 16px;
    cursor: pointer;
    &-name {
      margin-left: 8px;
      margin-right: 4px;
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .ant-avatar {
        margin-right: 8px;
      }
    }
    &:hover {
      background-color: #f7f7f7;
    }
    .check-icon {
      width: 20px;
      display: flex;
      justify-content: flex-end;
      color: #8c8c8c;
    }
  }
  .left,
  .right {
    width: 50%;
    .header {
      height: 52px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      border-bottom: solid 1px #e5e5e5;
    }
    .project-list,
    .resource-list {
      height: 280px;
      overflow: scroll;
    }
  }
  .right {
    border-left: 1px solid #ccc;
  }
`;

export const PopoverSelect = styled(Select)`
  width: 280px;
`;
