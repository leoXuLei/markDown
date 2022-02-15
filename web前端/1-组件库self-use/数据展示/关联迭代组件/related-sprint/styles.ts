import { css } from '@emotion/core'

export const modalWrapperCss = css`
  .ant-modal-body {
    padding: 0;
  }
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
    }
    .input-search {
      margin-right: 20px;
    }
  }
  .modal-content {
    display: flex;
    height: 480px;
    .container {
      padding-top: 8px;
      .task-group {
        .task-title {
          padding: 5px 15px 5px 8px;
          line-height: 20px;
          color: #595959;
          font-size: 16px;
          font-weight: 700;
        }
        .task-list {
          &-item {
            line-height: 20px;
            padding: 5px 15px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #595959;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            .ant-dropdown-trigger {
              display: none;
              flex: 0 0 auto;
              margin: 0 20px;
            }
            &-active {
              color: #1b9aee;
              background-color: #f0f0f0;
            }
            &:hover {
              color: #1b9aee;
              background-color: #f0f0f0;
              .ant-dropdown-trigger {
                display: block;
              }
            }
            &-name {
              flex: 1 1 auto;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              &-linked {
                color: #1b9aee;
              }
            }
          }
        }
      }
    }

    .related-sprints-container {
      flex-shrink: 0;
      height: 100%;
      width: 200px;
      border-right: 1px solid rgba(0, 0, 0, 0.12);
      .scroll-part {
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100% - 30px);
      }
      .container-title {
        font-size: 16px;
        font-weight: 700;
        padding: 5px 15px 5px 8px;
        line-height: 20px;
        color: #1b9aee;
      }
      .task-group {
        .task-title {
          padding: 5px 12px;
          font-size: 15px;
        }
        .task-list-item {
          padding: 5px 20px;
          .ant-dropdown-trigger {
            margin: 0 0 0 20px;
          }
        }
      }
    }

    .projects-container {
      width: 220px;
      flex-shrink: 0;
      border-right: 1px solid rgba(0, 0, 0, 0.12);
      position: relative;
      .search-project {
        color: #979797;
        height: 32px;
        display: flex;
        align-items: center;
        padding: 0 12px;
        margin: 0px 12px;
        font-size: 14px;
        border-radius: 18px;
        border: 1px solid #e5e5e5;
        transition: border-color 0.3s ease;
        background-color: #fff;
        &:hover {
          border-color: #1b9aee;
        }
        .project-list {
          z-index: 1;
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
          box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),
            0 9px 28px 8px rgba(0, 0, 0, 0.05);
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
        height: 440px;
      }
    }

    .sprints-container {
      flex-grow: 1;
      overflow-x: hidden;
      overflow-y: auto;
      height: 100%;
      flex-shrink: 1;
      flex-basis: auto;
      .task-group {
        .task-title {
          padding-right: 30px;
        }
        .task-list-item {
          padding-right: 30px;
        }
      }
    }

    .empty-text {
      line-height: 20px;
      padding: 5px 15px;
    }
  }
`
