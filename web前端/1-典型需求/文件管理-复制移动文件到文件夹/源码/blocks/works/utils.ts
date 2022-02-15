import { getDownloadUrlReq } from 'client/ekko/services/storage'
import { downloadFiles } from 'client/utils/download'
import _mapValues from 'lodash/mapValues'
import { IFilterArgs, ITimeRange } from 'client/blocks/works/components/filter/types'
import { IGetResourceProps } from 'client/ekko/services/works'
import moment from 'moment'

function getDirectoryOrder(a: IResource, b: IResource) {
  if (a.directory && !b.directory) {
    return -1
  } else if (!a.directory && b.directory) {
    return 1
  }
  return 0
}

export function sortResource(list: IResource[], key: keyof IResource) {
  return [...list].sort((a, b) => {
    const dirOrder = getDirectoryOrder(a, b)

    if (dirOrder !== 0) {
      return dirOrder
    }

    if (key === 'size') {
      return Number(a.size) - Number(b.size)
    } else if (!a[key] && !b[key]) {
      return 0
    }

    return (a[key]?.toString() ?? '').localeCompare(b[key]?.toString() ?? '')
  })
}

export async function downloadResource(resource: IResource | IResource[]) {
  if (!Array.isArray(resource)) {
    resource = [resource]
  }

  const downloadInfos = await Promise.all(
    resource.map((res) =>
      getDownloadUrlReq({
        bucket: 'airtake-private-data',
        url: res.fileId,
      }).then((url) => ({ name: res.name, url })),
    ),
  )

  downloadFiles(downloadInfos)
}

export const viewRadioTypeMap = {
  sprintView: 'sprintView',
  directoryView: 'directoryView',
}

export const judgeViewTypeIsDirectory = (type) => {
  return type === viewRadioTypeMap?.directoryView
}

export const handledSelectedFilesInfo = (list: IResource[]): string[] => {
  const directoryCount = list?.filter((item) => item?.directory === true)?.length || 0
  const fileCount = (list?.length || 0) - directoryCount
  const fileInfo: string[] = []

  if (fileCount) {
    fileInfo.push(`${fileCount} 个文件`)
  }

  if (directoryCount) {
    fileInfo.push(`${directoryCount} 个文件夹`)
  }
  return fileInfo
}

export const handleFilterArgs = (obj: IFilterArgs): IGetResourceProps => {
  const { resourceName, creator, createTime, modifiedTime, linkedOperator, linkedTime, tags } =
    obj || {}
  const handleTimeFun = (time: ITimeRange | undefined) => {
    return time?.map((v, index) => {
      if (!v) {
        return v
      }
      return index === 0
        ? moment(v)?.startOf('day')?.valueOf?.()
        : moment(v)?.endOf('day')?.valueOf?.()
    })
  }
  const handledCreateTime = handleTimeFun(createTime)
  const handledModifiedTime = handleTimeFun(modifiedTime)
  const handledLinkedTime = handleTimeFun(linkedTime) // 关联日期还有问题
  const res: IGetResourceProps = {
    resourceName: resourceName!,
    creator: creator?.map((v) => v?.staffId)!,
    linkedOperatorIds: linkedOperator?.map((v) => v?.staffId)!,
    tagIds: tags?.map((v) => v?.id)!,
    leftCreateTime: handledCreateTime?.[0] || undefined,
    rightCreateTime: handledCreateTime?.[1] || undefined,
    leftModifiedTime: handledModifiedTime?.[0] || undefined,
    rightModifiedTime: handledModifiedTime?.[1] || undefined,
    leftLinkedTime: handledLinkedTime?.[0] || undefined,
    rightLinkedTime: handledLinkedTime?.[1] || undefined,
  }
  return res
}
