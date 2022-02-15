import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import FormItem from 'antd/lib/form/FormItem';
import { formatNumber } from '@/utils';
import { Select, Input, InputNumber } from '@/containers';
import { getFuzzyIssueSearch } from '@/services/issue';
import { HOLDER_TYPE_MAP, CUSTOMIZATION_STATUS_MAP } from '@/constants';

const { RangePicker } = DatePicker;

export const TABLE_COLUMNS = [
  {
    title: '产品简称',
    dataIndex: 'productShortDescription',
    key: 'productShortDescription',
    sorter: true,
  },
  {
    title: '阶段',
    dataIndex: 'taskName',
    key: 'taskName',
  },
  {
    title: '定制/非定制',
    dataIndex: 'customization',
    key: 'customization',
    render: val => CUSTOMIZATION_STATUS_MAP[val] || '',
  },
  {
    title: '发行方式',
    dataIndex: 'holderType',
    key: 'holderType',
    render: val => HOLDER_TYPE_MAP[val] || '',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (val, record) => {
      if (val.includes('删除') && record.taskName === '产品确认发行') {
        return '发行失败';
      }
      if (val.includes('完成') && record.taskName === '产品确认发行') {
        return '发行成功';
      }
      return val;
    },
  },
  {
    title: '认购日',
    dataIndex: 'subscriptionDate',
    key: 'subscriptionDate',
    sorter: true,
    render: val => val && moment(val).format('YYYY-MM-DD'),
  },
  {
    title: '发行规模(元)',
    dataIndex: 'maxRaiseAmount',
    key: 'maxRaiseAmount',
    render: val => val && formatNumber(val, 1),
  },
  {
    title: '起息日',
    dataIndex: 'valueDate',
    key: 'valueDate',
    sorter: true,
    render: val => val && moment(val).format('YYYY-MM-DD'),
  },
  {
    title: '到期日',
    dataIndex: 'maturityDate',
    key: 'maturityDate',
    sorter: true,
    render: val => val && moment(val).format('YYYY-MM-DD'),
  },
  {
    title: '综合成本(%)',
    dataIndex: 'totalCostRate',
    key: 'totalCostRate',
    render: val => (val || val === 0 ? formatNumber(val * 100, 4) : ''),
  },
];

export const SEARCH_FORM_COLUMNS = productSteps => [
  {
    title: '产品代码',
    dataIndex: 'productCode',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator()(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear
            showSearch
            fetchOptionsOnSearch
            options={async (value: string = '') => {
              const { data, error } = await getFuzzyIssueSearch({
                productCode: value,
              });
              if (error) return [];
              return data
                .sort((a, b) => a.localeCompare(b))
                .map(item => ({
                  label: item,
                  value: item,
                }));
            }}
          ></Select>,
        )}
      </FormItem>
    ),
  },
  {
    title: '产品简称',
    dataIndex: 'productShortDescription',
    render: (val, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator()(<Input></Input>)}</FormItem>
    ),
  },
  {
    title: '产品阶段',
    dataIndex: 'taskName',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator()(
          <Select
            style={{ minWidth: 180 }}
            options={productSteps.map(item => ({ label: item, value: item }))}
            allowClear
          ></Select>,
        )}
      </FormItem>
    ),
  },
  {
    title: '认购日区间',
    dataIndex: 'subscriptionDate',
    render: (val, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator()(<RangePicker></RangePicker>)}</FormItem>
    ),
  },
];


