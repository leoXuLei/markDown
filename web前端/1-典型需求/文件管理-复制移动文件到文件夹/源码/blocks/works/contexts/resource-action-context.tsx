import { createContext, useContext } from 'react'

type Result = unknown | Promise<void>

export type IMoveCopyResourceType = 'move' | 'copy'

export const moveCopyResourceTypeMap: Record<IMoveCopyResourceType, string> = {
  move: '移动',
  copy: '复制',
}

export interface IResourceActionContext {
  createFolder: (params?: {
    isHomePage?: boolean
    dirName?: string
    dirParentId?: string
    destProjectId?: string
  }) => Promise<IResource | undefined | boolean>
  remove: (args: { list: IResource[] }) => Promise<boolean>
  rename: (args: { resourceId: string; fileName: string }) => Promise<boolean>
  upload: (args?: { resourceId?: string; multiple?: boolean }) => Promise<boolean>
  openMoveCopyModal: (args: {
    type: IMoveCopyResourceType
    resourceList: IResource[]
  }) => Promise<boolean>
}

// @ts-ignore
export const ResourceActionContext = createContext<IResourceActionContext>()

export function useResourceAction() {
  return useContext(ResourceActionContext)
}
