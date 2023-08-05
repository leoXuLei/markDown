import type { MouseEvent } from 'react';
import React, { FC, useEffect, useMemo, useRef } from 'react';
import { Modal, ModalProps } from 'antd';
import { useMemoizedFn } from 'ahooks';

interface IAntDraggableModal extends ModalProps {
  isSelectedTable?: boolean;
}

const AntDraggableModal: FC<IAntDraggableModal> = ({
  title,
  open = false,
  children,
  wrapClassName,
  ...restProps
}) => {
  const simpleClassRef = useRef<string>(
    Math.random().toString(36).substring(2),
  );

  const headerRef = useRef<any>(null);
  const containRef = useRef<any>(null);
  const modalContentRef = useRef<any>(null);

  // 鼠标按下时的X/Y
  const mouseDownXRef = useRef<number>(0);
  const mouseDownYRef = useRef<number>(0);

  // 最新一次鼠标从按下到松开后，x/y的变化值，可能为负值表示方向
  const deltaXRef = useRef<number>(0);
  const deltaYRef = useRef<number>(0);

  // 上一次鼠标从按下到松开后，x/y的变化值，可能为负值表示方向
  const sumXRef = useRef<number>(0);
  const sumYRef = useRef<number>(0);

  // 初始时 'div.ant-modal'相对于其最近的定位祖先元素的水平位移，即`弹窗左上角`距离`屏幕左上角`水平距离
  const offsetLeftRef = useRef<number>(0);
  // 初始时 'div.ant-modal'相对于其最近的定位祖先元素的垂直位移，即`弹窗左上角`距离`屏幕左上角`垂直距离
  const offsetTopRef = useRef<number>(0);

  const handleMove = useMemoizedFn((event: any) => {
    const deltaX = event.pageX - mouseDownXRef.current;
    const deltaY = event.pageY - mouseDownYRef.current;
    deltaXRef.current = deltaX;
    deltaYRef.current = deltaY;

    // 最新的tranX = 最新一次鼠标从按下到松开后的x变化 + 上一次的x变化
    let tranX = deltaX + sumXRef.current;
    // 最新的tranY = 最新一次鼠标从按下到松开后的y变化 + 上一次的y变化
    let tranY = deltaY + sumYRef.current;

    // 超出屏幕左边界
    if (tranX < -offsetLeftRef.current) {
      tranX = -offsetLeftRef.current;
    }

    // 弹窗初始位置右侧边到屏幕右边界的距离
    const offsetRight =
      document.body.clientWidth -
      ((modalContentRef.current as any)?.parentElement?.offsetWidth || 0) -
      offsetLeftRef.current;
    // 超出屏幕右边界
    if (tranX > offsetRight) {
      tranX = offsetRight;
    }

    // 超出屏幕上边界
    if (tranY < -offsetTopRef.current) {
      tranY = -offsetTopRef.current;
    }

    // 弹窗初始位置下侧边到屏幕下边界的距离
    const offsetBottom =
      document.body.clientHeight -
      ((modalContentRef.current as any)?.parentElement?.offsetHeight || 0) -
      offsetTopRef.current;
    // 超出屏幕下边界
    if (tranY > offsetBottom) {
      tranY = offsetBottom;
    }

    if (modalContentRef.current) {
      modalContentRef.current.style.transform = `translate(${tranX}px, ${tranY}px)`;
    }
  });

  const initialEvent = useMemoizedFn((open: boolean) => {
    if (title && open) {
      setTimeout(() => {
        window.removeEventListener('mouseup', removeUp, false);

        containRef.current = document.getElementsByClassName(
          simpleClassRef.current,
        )[0] as any;
        headerRef.current =
          containRef.current?.getElementsByClassName?.('ant-modal-header')?.[0];
        modalContentRef.current =
          containRef.current?.getElementsByClassName?.(
            'ant-modal-content',
          )?.[0];

        // 'div.ant-modal'弹窗左上角的水平位移
        offsetLeftRef.current =
          modalContentRef.current?.parentElement?.offsetLeft;
        // 'div.ant-modal'弹窗左上角的垂直位移
        offsetTopRef.current =
          modalContentRef.current?.parentElement?.offsetTop;

        // 元素可任意方向滚动（平移）
        headerRef.current.style.cursor = 'all-scroll';

        headerRef.current.onmousedown = (e: MouseEvent<HTMLDivElement>) => {
          // console.log('headerRef ::> onmousedown', e.pageX, e.pageY);
          mouseDownXRef.current = e.pageX;
          mouseDownYRef.current = e.pageY;
          // 禁用了文档的选择（让用户无法拖动文本）
          document.body.onselectstart = () => false;
          window.addEventListener('mousemove', handleMove, false);
        };
        window.addEventListener('mouseup', removeUp, false);
      }, 0);
    }
  });

  // 移除mousemove事件
  const removeMove = useMemoizedFn(() => {
    window.removeEventListener('mousemove', handleMove, false);
  });

  const removeUp = useMemoizedFn(() => {
    // 放开文档文本的选择
    document.body.onselectstart = () => true;
    // console.log('removeUp ::>>');
    // console.log('removeUp ::>> sumXRef.current', sumXRef.current);
    // console.log('removeUp ::>> sumYRef.current', sumYRef.current);
    sumXRef.current += deltaXRef.current;
    sumYRef.current += deltaYRef.current;
    deltaXRef.current = 0;
    deltaYRef.current = 0;
    // console.log('removeUp ::>> sumXRef.current', sumXRef.current);
    // console.log('removeUp ::>> sumYRef.current', sumYRef.current);

    // 超出屏幕左边界
    if (sumXRef.current < -offsetLeftRef.current) {
      sumXRef.current = -offsetLeftRef.current;
    }

    // 弹窗初始位置右侧边到屏幕右边界的距离
    const offsetRight =
      document.body.clientWidth -
      ((modalContentRef.current as any)?.parentElement?.offsetWidth || 0) -
      offsetLeftRef.current;
    // 超出屏幕右边界
    if (sumXRef.current > offsetRight) {
      sumXRef.current = offsetRight;
    }

    // 超出屏幕上边界
    if (sumYRef.current < -offsetTopRef.current) {
      sumYRef.current = -offsetTopRef.current;
    }

    // 弹窗初始位置下侧边到屏幕下边界的距离
    const offsetBottom =
      document.body.clientHeight -
      ((modalContentRef.current as any)?.parentElement?.offsetHeight || 0) -
      offsetTopRef.current;
    // 超出屏幕下边界
    if (sumYRef.current > offsetBottom) {
      sumYRef.current = offsetBottom;
    }

    removeMove();
  });

  useEffect(() => {
    if (open) {
      initialEvent(open);
    } else {
      removeMove();
      window.removeEventListener('mouseup', removeUp, false);
    }
    return () => {
      removeMove();
      window.removeEventListener('mouseup', removeUp, false);
      headerRef.current = null;
      containRef.current = null;
      modalContentRef.current = null;
    };
  }, [open, initialEvent, removeUp, removeMove]);

  const wrapModalClassName = useMemo(() => {
    return wrapClassName
      ? `${wrapClassName} ${simpleClassRef.current}`
      : `${simpleClassRef.current}`;
  }, [wrapClassName]);

  return (
    <Modal
      title={title}
      open={open}
      {...restProps}
      wrapClassName={wrapModalClassName}
    >
      {children}
    </Modal>
  );
};

export default AntDraggableModal;