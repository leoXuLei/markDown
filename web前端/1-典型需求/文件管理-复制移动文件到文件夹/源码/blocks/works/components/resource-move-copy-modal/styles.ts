import styled from "@emotion/styled";
import { Modal } from "@com/sun";

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    background-color: #f7f7f7;

    .ant-modal-header {
      padding: 15px 20px;
      /* border-color: #e5e5e5; */
      border-color: #0000001f;
      background: #f7f7f7;
    }
    .ant-modal-body {
      padding: 0;
      overflow: hidden;
      height: 100%;
    }
    .ant-modal-footer {
      padding: 16px 20px;
      border-radius: 0 0 2px 2px;
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      .modal-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        > p {
          color: #595959;
        }
        .buttons {
          display: flex;
          .ant-btn {
            font-weight: 400;
          }
          .ant-btn-link {
            color: #262626;
          }
        }
      }
    }
  }
`;

export const TitleWrapper = styled.div`
  font-size: 20px;
  line-height: 30px;
  color: #262626;
  font-weight: 700;
`;

export const Body = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 438px;
  .projects-column {
    width: 220px;
    overflow-x: hidden;
    overflow-y: auto;
    flex-shrink: 0;
  }
  .folder-picker-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0%;
    background-color: #fff;
    .folder-picker-view {
      display: flex;
      flex: 1;
      height: 100%;
      .folder-picker {
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        overflow-y: hidden;
        overflow-x: auto;
      }
    }
  }
`;

export const FolderColumnItemWrapper = styled.div`
  width: 220px;
  min-width: 220px;
  overflow-x: hidden;
  overflow-y: auto;
  border-right: 1px solid #e5e5e5;
  .folder-picker-handlers {
    padding: 11px 0 0 16px;
    .create-icon {
      font-size: 18px;
      &:hover {
        cursor: pointer;
        fill: #1b9aee;
        color: #1b9af5;
      }
    }
  }
  header {
    margin-top: 8px;
    padding: 4px 16px;
    color: #595959;
    font-size: 13px;
  }
  .folder-container {
    .folder-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 4px 16px;
      cursor: pointer;
      &-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &-disabled {
        cursor: default;
        color: #bfbfbf;
      }
      &:hover:not(.disabled):not(.selected) {
        background: #f7f7f7;
        .folder-item-name {
          color: #1b9aee;
        }
      }
    }
    .active {
      background-color: #f7f7f7;
      svg {
        fill: rgb(27, 154, 238);
      }
      .folder-item-name {
        color: #1b9aee;
      }
    }
    .selected {
      background-color: #1b9aee;
      svg {
        fill: #fff;
      }
      .folder-item-name {
        color: #fff;
      }
    }

    .disabled {
      cursor: default;
      color: #bfbfbf;
    }
  }
`;

export const ProjectListWrapper = styled.div`
  width: 100%;
  padding: 8px 0;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  height: 100%;
  position: relative;
  .search-project {
    color: #979797;
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    margin: 0px 6px;
    font-size: 14px;
    border-radius: 18px;
    border: 1px solid #e5e5e5;
    transition: border-color 0.3s ease;
    background-color: #fff;
    &:hover {
      border-color: #1b9aee;
    }
    .project-list {
      position: absolute;
      top: 40px;
      left: 0;
      overflow-y: scroll;
      max-height: 200px;
      width: 100%;
      background-clip: padding-box;
      border: 0;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
        0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
      cursor: pointer;
      .project-item {
        padding: 5px 15px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .matched-text {
          color: #1b9aee;
        }
        &:hover {
          background: #f7f7f7;
          color: #1b9aee;
        }
      }
    }
  }
  .scroll-part {
    overflow-x: hidden;
    overflow-y: auto;
    height: 398px;
  }
  .project-select-group {
    &:not(:first-child) {
      margin-top: 20px;
      border-top: 1px solid #ccc;
    }
    &-title {
      padding: 5px 15px 5px 8px;
      color: #595959;
      font-size: 14px;
      font-weight: 700;
      line-height: 20px;
    }
    &-list {
      &-item {
        line-height: 20px;
        padding: 5px 15px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #595959;
        cursor: pointer;
        &:hover:not(.project-select-group-list-item-active) {
          color: #1b9aee;
          background-color: #ccc;
        }
        &-active {
          /* color: #1b9aee; */
          /* background-color: #f0f0f0; */
          background-color: #1b9aee;
          color: #fff;
        }
      }
    }
  }
`;
