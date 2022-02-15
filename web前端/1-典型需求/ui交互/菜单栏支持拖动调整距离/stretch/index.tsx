/* eslint-disable react/no-unused-prop-types */
import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import { useControllableValue } from 'ahooks'
import IfElseComponent from '@/components/conditions'
import { StretchWrapper } from './styles'

interface MouseState {
  screenX?: number
  screenY?: number
  clientX?: number
  clientY?: number
  pageX?: number
  pageY?: number
}

interface StretchProps {
  minWidth?: number
  maxWidth?: number
  width?: number
  collapse?: boolean
  onCollapse?: (collapse: boolean) => void
  className?: string
  children?: any
  onChange?: (number) => void
  onDragStart?: () => void
  onDragEnd?: (number) => void
}

const Stretch = (props: StretchProps) => {
  const {
    minWidth = -Infinity,
    maxWidth = Infinity,
    width: defaultWidth = 0,
    onChange,
    onDragStart,
    onDragEnd,
  } = props

  const [collapse, setCollapse] = useControllableValue<boolean>(props, {
    defaultValue: false,
    defaultValuePropName: 'defaultCollapse',
    trigger: 'onCollapse',
    valuePropName: 'collapse',
  })

  const [isDragging, setIsDragging] = useState(false)

  const [active, setActive] = useState<boolean>(false)

  const [mouseState, setMouseState] = useState<MouseState>()

  const [width, setWidth] = useState<number>(defaultWidth)

  const prevState = useRef<any>({})

  const contentWrapRef = useRef<any>()

  useEffect(() => {
    const mousemove = (e) => {
      setMouseState({
        screenX: e.screenX,
        screenY: e.screenY,
        clientX: e.clientX,
        clientY: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
      })
    }

    const mouseup = () => {
      if (active) {
        setIsDragging(false)
        onDragEnd?.(width)
      }
      setActive(false)
    }

    document.addEventListener('mousemove', mousemove)
    document.addEventListener('mouseup', mouseup)

    return () => {
      document.removeEventListener('mousemove', mousemove)
      document.removeEventListener('mouseup', mouseup)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, width])

  const onMouseDown = useCallback(() => {
    if (!collapse) {
      const width = contentWrapRef.current.clientWidth
      setActive(true)
      setWidth(width)
      setIsDragging(true)
      onDragStart?.()
      prevState.current.mouseState = mouseState
      prevState.current.width = width
    }
  }, [collapse, mouseState, onDragStart])

  useEffect(() => {
    if (active) {
      const offetX = Number(mouseState?.clientX) - prevState.current.mouseState.clientX // 跟之前的位置相比水平拖动的距离
      const cliwntWidth = prevState.current.width // StretchWrapper 的宽度
      const width = Math.max(Math.min(cliwntWidth + offetX, maxWidth), minWidth) //  限制 StretchWrapper的宽度范围保证在minWidth和maxWidth之间
      onChange?.(width) // 最新宽度传递出去
      setWidth(width) // 给StretchWrapper设置最新宽度
    }
  }, [mouseState, active, maxWidth, minWidth, onChange])

  const style = useMemo(() => {
    return {
      width: `${collapse ? 0 : Number(width || 0)}px`,
    }
  }, [width, collapse])

  const handleToogleCollapse = useCallback(
    (e) => {
      e.stopPropagation()
      e.preventDefault()
      setCollapse(!collapse)
    },
    [collapse, setCollapse],
  )

  const onSiderClick = useCallback(() => {
    setCollapse(false)
  }, [setCollapse])

  return (
    <StretchWrapper
      className={classnames(
        collapse && 'stretch-wrap-collapsed',
        // !isDragging && 'animate-width', // StretchWrapper暂时不需要transition
        props.className,
      )}
      style={style}
      ref={contentWrapRef}
    >
      <div
        className="left-wrapper"
        style={{
          width: `${Number(width || 0)}px`,
        }}
      >
        <div className="left-scroll">{props.children}</div>
        <div
          className="left-bar"
          style={collapse ? { cursor: 'pointer' } : {}}
          onClick={onSiderClick}
          onMouseDown={onMouseDown}
        >
          <div className="icon-bar" onClick={handleToogleCollapse}>
            <IfElseComponent checked={collapse} if={<RightOutlined />} else={<LeftOutlined />} />
          </div>
        </div>
      </div>
    </StretchWrapper>
  )
}

export default Stretch
