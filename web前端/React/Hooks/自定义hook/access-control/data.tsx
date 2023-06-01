import React, { createContext, useReducer, useMemo } from 'react'
import { notNeedPermissionPages } from './utils'

interface IAuthorityDataContext {
  state?: {
    reportsPermission?: boolean
  }
  dispatch?: any
}

const initState = {
  reportsPermission: false,
}

const reducer = (state, action) => {
  const { type, payload } = action
  switch (type) {
    case 'change-reports-authority':
      return { ...state, reportsPermission: payload }
    default:
      return state
  }
}

export const PermissionDataContext = createContext<IAuthorityDataContext>({})

export const PermissionData = (props) => {
  const [state, dispatch] = useReducer(reducer, initState)
  return useMemo(
    () => (
      <PermissionDataContext.Provider value={{ state, dispatch }}>
        {props.children}
      </PermissionDataContext.Provider>
    ),
    [props.children, state],
  )
}

export function useReportsPermission() {
  // 当前页面不需要权限
  const isNotNeedPermissionCurPage = useMemo<boolean>(() => {
    const handledPathName = window.location.pathname?.split?.('/')?.slice?.(-3)?.join?.('/') || ''
    return notNeedPermissionPages.includes(handledPathName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname])

  return { isNotNeedPermissionCurPage }
}
