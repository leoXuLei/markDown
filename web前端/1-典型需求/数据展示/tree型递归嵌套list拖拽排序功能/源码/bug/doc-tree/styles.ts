import { css } from '@emotion/core'

export const containerCss = css`
  .node-wrapper {
    margin: 0 16px;
    background: linear-gradient(90deg, #fff 45%, #f7f7f7 0, #f7f7f7 55%, #fff 0);
    background-size: 20px;
    position: relative;
    padding-left: 20px;

    &.active {
      .node {
        background: rgb(247, 247, 247);
        border-radius: 4px;
        .node-title {
          color: #262626;
          font-weight: 700;
        }
      }
    }

    .node {
      display: flex;
      align-items: center;
      height: 40px;
      background: #fff;
      height: 40px;
      cursor: pointer;
      user-select: none;
      font-size: 14px;
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #e5e5e5;
        margin: 0 7px;
      }
      .icon {
        cursor: pointer;
        height: 20px;
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #8c8c8c;
      }
      .node-title {
        margin-left: 3px;
        color: #595959;
        transition: color 218ms ease;
        flex-grow: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .operations {
        display: none;
        margin-left: 4px;
        .icon-more {
          font-size: 16px;
          flex-shrink: 0;
          color: #8c8c8c;
          height: 24px;
          width: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          &:hover {
            color: #1b9aee;
            background-color: #e8f5fd;
          }
        }
      }

      &:hover {
        .node-title {
          color: #1b9aee;
        }
        .operations {
          display: flex;
        }
      }
    }
  }
`
