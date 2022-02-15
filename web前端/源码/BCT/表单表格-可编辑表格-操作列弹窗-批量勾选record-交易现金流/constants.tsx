import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import _ from 'lodash';
import { fetch } from '@/utils';
import { DatePicker as AntdDatePicker } from 'antd';
import { Input, InputNumber, Select, DatePicker, Form2 } from '@/containers';
import { refSimilarLegalNameList } from '@/services/reference-data-service';
import { actFindSimilarTradeId } from '@/services/account-service';
import { BUSINESS_TYPE_OPTIONS, BUSINESS_TYPE_MAP, PAYMENT_METHOD_MAP } from '@/constants/common';
import { FUND_PAYMENT_TYPE, FUND_PAYMENT_MAP } from '@/pages/ClientManagementInfo/constants';
import {
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_STATUS_ZHCN_MAP,
  STATUS_OPTIONS,
  STATUS_ZHCN_MAP,
} from '../constants';

const { RangePicker } = AntdDatePicker;

export const EVENT_TYPE_MAP = {
  OPEN: '开仓',
  UNWIND: '平仓',
  SETTLE: '结算',
  PAYMENT: '支付',
  MARGIN_CALL: '追保',
  MARGIN_RETURN: '退保',
};

export const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPE_MAP).map(([key, value]) => ({
  label: value,
  value: key,
}));

export const PAYMENT_DIRECTION_MAP = {
  PAY: '预付',
  RECEIVE: '预收',
};

export const CASHFLOW_TYPE_MAP = {
  PRE_PAYMENT_INITIAL: '初始预付金',
  PRE_PAYMENT_ADD: '追加预付金',
  PRE_PAYMENT_WITHDRAWN: '提取预付金',
  PRE_PAYMENT_RETURN: '返还预付金',
};

export const CASHFLOW_TYPE_OPTIONS = Object.entries(CASHFLOW_TYPE_MAP).map(([key, value]) => ({
  label: value,
  value: key,
}));

export const FORM_COLUMNS = [
  {
    title: '资金流水编号',
    dataIndex: 'serialIds',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            mode="multiple"
            allowClear
            showSearch
            fetchOptionsOnSearch
            options={async (value: string = '') => {
              const {
                data: { result, error },
              } = await fetch['POST/capital-service/api/rpc/method=capMarginSerialIdSearch']({
                searchKey: value || '',
              });
              if (error) return [];
              return _.uniqBy(
                result.slice(0, 50).map(item => ({
                  label: item,
                  value: item,
                })),
                'value',
              );
            }}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '交易ID',
    dataIndex: 'tradeIds',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            mode="multiple"
            allowClear
            showSearch
            fetchOptionsOnSearch
            options={async (value: string = '') => {
              const {
                data: { result, error },
              } = await fetch['POST/capital-service/api/rpc/method=capMarginTradeIdSearch']({
                searchKey: value || '',
              });
              if (error) return [];
              return _.uniqBy(
                result.slice(0, 50).map(item => ({
                  label: item,
                  value: item,
                })),
                'value',
              );
            }}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '交易对手',
    dataIndex: 'partyName',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear
            showSearch
            fetchOptionsOnSearch
            options={async (value: string = '') => {
              const { data, error } = await refSimilarLegalNameList({
                similarLegalName: value,
              });
              if (error) return [];
              return data.map(item => ({
                label: item,
                value: item,
              }));
            }}
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '业务类型',
    dataIndex: 'businessTypes',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            placeholder="请选择"
            style={{ minWidth: 180 }}
            options={BUSINESS_TYPE_OPTIONS}
            mode="multiple"
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '事件类型',
    dataIndex: 'eventTypes',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            placeholder="请选择"
            style={{ minWidth: 180 }}
            options={EVENT_TYPE_OPTIONS}
            mode="multiple"
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '现金流类型',
    dataIndex: 'cashFlowTypes',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            placeholder="请选择"
            style={{ minWidth: 180 }}
            options={CASHFLOW_TYPE_OPTIONS}
            mode="multiple"
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '支付方式',
    dataIndex: 'paymentMethods',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            placeholder="请选择"
            style={{ minWidth: 180 }}
            options={FUND_PAYMENT_TYPE}
            mode="multiple"
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '实付状态',
    dataIndex: 'paymentStatus',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            placeholder="请选择"
            style={{ minWidth: 180 }}
            options={PAYMENT_STATUS_OPTIONS}
            mode="multiple"
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '产生日期',
    dataIndex: 'eventDate',
    render: (value, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<RangePicker />)}</FormItem>
    ),
  },
  {
    title: '预收/付日期',
    dataIndex: 'paymentDate',
    render: (value, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<RangePicker />)}</FormItem>
    ),
  },
  {
    title: '状态',
    dataIndex: 'cashFlowStatus',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select placeholder="请选择" style={{ minWidth: 180 }} options={STATUS_OPTIONS} />,
        )}
      </FormItem>
    ),
  },
];

export const TABLE_COLUMNS = [
  {
    title: '资金流水编号',
    dataIndex: 'serialId',
  },
  {
    title: '交易ID',
    dataIndex: 'tradeId',
  },
  {
    title: '交易对手',
    dataIndex: 'partyName',
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    render: value => BUSINESS_TYPE_MAP[value],
  },
  {
    title: '客户收支类型',
    dataIndex: 'paymentDirection',
    render: value => PAYMENT_DIRECTION_MAP[value],
  },
  {
    title: '事件类型',
    dataIndex: 'eventType',
    render: value => EVENT_TYPE_MAP[value],
  },
  {
    title: '现金流类型',
    dataIndex: 'cashFlowType',
    render: value => CASHFLOW_TYPE_MAP[value],
    // render: value => value.map(v => CASHFLOW_TYPE_MAP[v]).join(','),
  },
  {
    title: '金额',
    dataIndex: 'cashFlowAmount',
    align: 'right',
    filters: [{ text: '不为0的数', value: '0' }],
    render: value => <InputNumber value={value} precision={2} editing={false} />,
  },
  {
    title: '产生日期',
    dataIndex: 'eventDate',
  },
  {
    title: '预收/付日期',
    dataIndex: 'paymentDate',
  },
  {
    title: '录入日期',
    dataIndex: 'createDate',
  },
  {
    title: '支付方式',
    dataIndex: 'paymentMethod',
    render: value => FUND_PAYMENT_MAP[value],
  },
  {
    title: '实付状态',
    dataIndex: 'paymentStatus',
    render: (value, record) => {
      if (record.cashFlowStatus === 'DISABLE') {
        return null;
      }
      return PAYMENT_STATUS_ZHCN_MAP[value];
    },
  },
  {
    title: '状态',
    dataIndex: 'cashFlowStatus',
    render: value => STATUS_ZHCN_MAP[value],
  },
  {
    title: '备注',
    dataIndex: 'comment',
    editable: () => true,
    render: (value, record, index, { form, editing }) => (
      <FormItem>
        {form.getFieldDecorator({
          rules: [],
        })(<Input editing={editing} autoSelect />)}
      </FormItem>
    ),
  },
];

export const modalFormControls = [
  {
    title: '资金流水编号',
    dataIndex: 'serialId',
    render: (val, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<Input placeholder="请输入" disabled />)}</FormItem>
    ),
  },
  {
    title: '交易ID',
    dataIndex: 'tradeId',
    render: (val, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<Input placeholder="请输入" disabled />)}</FormItem>
    ),
  },
  {
    title: '交易对手',
    dataIndex: 'partyName',
    render: (val, record, index, { form }) => (
      <FormItem>{form.getFieldDecorator({})(<Input placeholder="请输入" disabled />)}</FormItem>
    ),
  },
  {
    title: '业务类型',
    dataIndex: 'businessType',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select placeholder="请选择" options={BUSINESS_TYPE_OPTIONS} disabled />,
        )}
      </FormItem>
    ),
  },
  {
    title: '事件类型',
    dataIndex: 'eventType',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            placeholder="请选择"
            style={{ minWidth: 180 }}
            options={EVENT_TYPE_OPTIONS}
            disabled
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '现金流类型',
    dataIndex: 'cashFlowType',
    render: (value, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            placeholder="请选择"
            style={{ minWidth: 180 }}
            options={CASHFLOW_TYPE_OPTIONS}
            disabled
          />,
        )}
      </FormItem>
    ),
  },
  {
    title: '支付方式',
    dataIndex: 'paymentMethod',
    render: (val, record, index, { form }) => (
      <FormItem>
        {form.getFieldDecorator()(
          <Select
            options={Object.keys(PAYMENT_METHOD_MAP).map(key => ({
              label: PAYMENT_METHOD_MAP[key],
              value: key,
            }))}
          />,
        )}
      </FormItem>
    ),
  },
];
