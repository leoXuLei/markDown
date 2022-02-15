import React from 'react'
import { BaseChart } from '@/blocks/teams/components/base-chart'
import { INPUT_VIEW_TYPE_MAP } from './config'

type IEachEndTechnicalStaffPieProps = {
  loading: boolean
  data: IEndPointCostResourceOverview
}

const createOption = (props: IEndPointCostResourceOverview) => {
  const pieConfigItem = INPUT_VIEW_TYPE_MAP?.staff

  // 饼图中间显示的总数
  const centerData = props?.[pieConfigItem?.centerKeyMap?.['all']]

  const handledData =
    (props?.['totalStaffEndpointList'] || [])?.map((v) => {
      return {
        name: v?.name!,
        value: v?.[pieConfigItem?.value]!,
        number: v?.[pieConfigItem?.number]!,
        unit: pieConfigItem?.unit,
        centerText: pieConfigItem?.centerText,
      }
    }) || []

  const handledLegendData =
    handledData?.reduce((t, v) => {
      if (!v?.name) {
        return t
      }
      if (!(v.name in t)) {
        t[v.name] = v
      }
      return t
    }, {}) || {}

  const option = {
    tooltip: {
      trigger: 'item',
      formatter(param) {
        let res = ''
        const objItem = param.data
        res += `<div>${param.marker}${param.name}：${objItem?.value ?? ''}%，${
          objItem?.number ?? ''
        }${objItem?.unit}</div>`
        return res
      },
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      top: '10',
      left: '0%',
      height: '30%',
      formatter(name) {
        const objItem = handledLegendData?.[name]
        return `${name}  ${objItem?.value ?? ''}%  ${objItem?.number ?? ''}${objItem?.unit}`
      },
      icon: 'circle',
    },
    toolbox: {
      show: false,
      feature: {
        saveAsImage: { show: true },
      },
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '65%'],
        center: ['55%', '65%'],
        label: {
          show: true,
          position: 'center',
          formatter: (params) => {
            const centerText = params?.data?.centerText
            const unit = params?.data?.unit
            return [
              `{textStyle|${centerText || ''}}`,
              '',
              `{valueStyle|${centerData ?? '-'}${unit || ''}}`,
            ].join('\n')
          },
          rich: {
            textStyle: {
              color: '#9c9c9c',
              fontSize: '14px',
            },
            valueStyle: {
              fontWeight: '500',
              fontSize: '20px',
              color: '#3a3c41',
            },
          },
        },
        labelLine: {
          normal: {
            show: false,
          },
        },
        avoidLabelOverlap: false,
        data: handledData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  return option
}

export const EachEndTechnicalStaffPie = (props: IEachEndTechnicalStaffPieProps) => {
  const { loading, data } = props

  return (
    <BaseChart
      isHasData={!!data?.['totalStaffEndpointList']?.length}
      loading={loading}
      data={data}
      createOption={createOption}
      style={{ padding: 0, height: 450 }}
    />
  )
}
