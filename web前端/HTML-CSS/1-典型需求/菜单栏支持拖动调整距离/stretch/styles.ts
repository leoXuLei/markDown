import styled from '@emotion/styled'

export const StretchWrapper = styled.div`
  position: relative;
  will-change: width;
  flex-shrink: 0;
  z-index: 2;
  height: 100%;

  &.animate-width {
    transition: width 218ms cubic-bezier(0.1, 0, 0, 1) 0s;
  }

  &.stretch-wrap-collapsed {
    .left-wrapper {
      transform: translateX(-100%);
      .left-bar {
        &::before {
          width: 0;
        }
      }
    }
  }

  .left-wrapper {
    background: white;
    height: 100%;
    position: absolute;
    transition: transform 218ms cubic-bezier(0.1, 0, 0, 1) 0s;

    .left-scroll {
      position: absolute;
      left: 0;
      width: 100%;
      height: 100%;
      top: 0;
      overflow-y: scroll;
      overflow-x: hidden;
    }

    .left-bar {
      position: absolute;
      left: 100%;
      top: 0;
      width: 14px;
      height: 100%;
      cursor: ew-resize;
      display: flex;
      align-items: center;
      &.left-bar-collapsed {
        cursor: pointer;
        width: 15px;
      }
      &::after {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        content: '';
        cursor: pointer;
        width: 1px;
        height: 100%;
        background-color: #e5e5e5;
        transition-property: background-color, width;
        transition-duration: 218ms;
        transition-timing-function: ease-in-out;
        display: block;
      }
      &:hover {
        &::after {
          background-color: #1b9aee;
          width: 2px;
        }
        .icon-bar {
          background-color: #1b9aee;
          color: white;
        }
      }
      .icon-bar {
        cursor: pointer;
        /* z-index: 1; */
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        background-color: #fff;
        border-radius: 0 4px 4px 0;
        border: 1px solid #e5e5e5;
        border-left-color: transparent;
        opacity: 1;
        transition-property: background-color, opacity;
        transition-duration: 218ms;
        transition-timing-function: ease-in-out;
        justify-content: center;
        color: #bfbfbf;
        font-size: 14px;
      }
    }
  }
`
