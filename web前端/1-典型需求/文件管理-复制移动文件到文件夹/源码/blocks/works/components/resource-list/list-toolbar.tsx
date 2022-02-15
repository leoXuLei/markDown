import styled from '@emotion/styled'
import { BaseItem } from './base-item'

export const ListToolbar = styled(BaseItem)`
  font-size: 15px;
  line-height: 20px;
  color: #595959;

  &::after {
    position: absolute;
    height: 0;
    left: 15px;
    right: 15px;
    bottom: 0;
    content: '';
    border-bottom: 1px solid #e5e5e5;
  }

  .list-item__content {
    padding-top: 20px;
    padding-bottom: 20px;
  }
`
