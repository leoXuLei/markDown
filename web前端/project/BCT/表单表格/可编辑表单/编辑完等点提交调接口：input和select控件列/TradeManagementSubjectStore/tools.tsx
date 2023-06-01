import React from 'react';
import { formatNumber } from '@/tools';
import {
  EXERCISETYPE_MAP_CN,
  TOTAL_EXCHANGE_ZHCN_MAP,
  ASSET_CLASS_ZHCN_MAP,
  INSTRUMENT_TYPE_ZHCN_MAP,
  OPTION_TYPE_ZHCN_MAP,
} from '@/constants/common';
import Operation from './Operation';
import { ASSET_SUB_CLASS_MAP, REGULATORY_ASSET_MAP, REGULATORY_CLASS_MAP } from './services';

export const TABLE_COL_DEFS = fetchTable => [
  {
    title: '合约代码',
    fixed: 'left',
    width: 130,
    dataIndex: 'instrumentId',
  },
  {
    title: '合约名称',
    dataIndex: 'name',
  },
  {
    title: '交易所',
    dataIndex: 'exchange',
    render: value =>
      ({
        ...TOTAL_EXCHANGE_ZHCN_MAP,
      }[value]),
  },
  {
    title: '资产类别',
    dataIndex: 'assetClass',
    render: value => ASSET_CLASS_ZHCN_MAP[value] || value,
  },
  {
    title: '合约类型',
    dataIndex: 'instrumentType',
    render: value => INSTRUMENT_TYPE_ZHCN_MAP[value] || value,
  },
  {
    title: '资产子类别',
    dataIndex: 'assetSubClass',
    render: value => ASSET_SUB_CLASS_MAP[value] || value,
  },
  {
    title: '交易品种',
    dataIndex: 'tradeCategory',
  },
  {
    title: '交易单位',
    dataIndex: 'tradeUnit',
  },
  {
    title: '报价单位',
    dataIndex: 'unit',
  },
  {
    title: '合约乘数',
    dataIndex: 'multiplier',
    align: 'right',
    render: value => formatNumber(value, 4),
  },
  {
    title: '标的代码',
    dataIndex: 'underlyerInstrumentId',
  },
  {
    title: '行权价格（￥）',
    dataIndex: 'strike',
    render: value => formatNumber(value, 4),
  },
  {
    title: '行权方式',
    dataIndex: 'exerciseType',
    render: value => EXERCISETYPE_MAP_CN[value] || value,
  },
  {
    title: '期权类型',
    dataIndex: 'optionType',
    render: value => OPTION_TYPE_ZHCN_MAP[value] || value,
  },
  {
    title: '期货到期日',
    dataIndex: 'maturity',
  },
  {
    title: '期权到期日',
    dataIndex: 'expirationDate',
  },
  {
    title: '监管类别',
    dataIndex: 'regulationAssetClass',
    render: value => REGULATORY_CLASS_MAP[value] || value,
  },
  {
    title: '监管子类别',
    dataIndex: 'regulationAssetSubClass',
    render: value => REGULATORY_ASSET_MAP[value] || value,
  },
  {
    dataIndex: 'operation',
    title: '操作',
    fixed: 'right',
    width: 130,
    render: (value, record) => <Operation record={record} fetchTable={fetchTable} />,
  },
];
