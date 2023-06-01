import React, { useContext } from 'react'
import styled from '@emotion/styled'
import { useReportsPermission } from 'client/blocks/common/access-control/data'
import { PermissionDataContext } from '@/blocks/common/access-control/data'
import { ConditionComponent } from '@/components/conditions'

const Container = styled.div`
  flex: 1;
  overflow: auto;
`

const PermissionWarnContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 200px;
`

export const ReportsPermissionContainer = (props) => {
  const { state } = useContext(PermissionDataContext)

  const { reportsPermission } = state ?? {}

  const { isNotNeedPermissionCurPage } = useReportsPermission()

  return (
    <Container>
      {props?.children}

      <ConditionComponent isShow={!(reportsPermission || isNotNeedPermissionCurPage)}>
        {/* user有权限或者当前页面不需要权限返回null, 否则返回提示语 */}

        <PermissionWarnContainer>
          请专注在日常工作中（空间内的项目、需求、任务、缺陷）并及时处理自己的待办事项，该页面只对TL开放。
        </PermissionWarnContainer>
      </ConditionComponent>
    </Container>
  )
}
