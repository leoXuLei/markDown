import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import _ from 'lodash';
import { mktInstrumentSearch } from '@/services/market-data-service';
import { DatePicker, Input, InputNumber, Select, Form2, TimePicker } from '@/containers';
import { ASSET_CLASS_ZHCN_MAP } from '@/constants/common';

const multiplier = {
  title: '合约乘数',
  dataIndex: 'multiplier',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [
          {
            required: true,
            message: '合约乘数是必填项',
          },
        ],
      })(
        <InputNumber
          precision={0}
          min={1}
          disabled={Form2.getFieldValue(record.instrumentType) === 'STOCK'}
        />,
      )}
    </FormItem>
  ),
};

const name = {
  title: '合约名称',
  dataIndex: 'name',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [
          {
            required: true,
            message: '合约名称是必填项',
          },
        ],
      })(<Input />)}
    </FormItem>
  ),
};

const exchange = {
  title: '交易所',
  dataIndex: 'exchange',
  render: (value, record, index, { form }) => {
    const getOptions = () => {
      return [
        {
          label: '上交所',
          value: 'SSE',
        },
        {
          label: '深交所',
          value: 'SZSE',
        },
        {
          label: '中金所',
          value: 'CFFEX',
        },
        {
          label: '港交所',
          value: 'HKEX',
        },
        {
          label: '上期所',
          value: 'SHFE',
        },
        {
          label: '大商所',
          value: 'DCE',
        },
        {
          label: '郑商所',
          value: 'CZCE',
        },
        {
          label: '金交所',
          value: 'SGE',
        },
        {
          label: '能源中心',
          value: 'INE',
        },
        {
          label: '其他',
          value: 'OTHERS',
        },
      ];
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '交易所是必填项',
            },
          ],
        })(<Select style={{ minWidth: 180 }} options={getOptions()} />)}
      </FormItem>
    );
  },
};

const maturity = {
  title: '期货到期日',
  dataIndex: 'maturity',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [
          {
            required: true,
            message: '期权到期日是必填项',
          },
        ],
      })(<DatePicker editing format="YYYY-MM-DD" />)}
    </FormItem>
  ),
};

const instrumentType = {
  title: '合约类型',
  dataIndex: 'instrumentType',
  render: (value, record, index, { form }) => {
    const getOptions = () => {
      if (record.assetClass && record.assetClass.value === 'EQUITY') {
        return [
          {
            label: '股票',
            value: 'STOCK',
          },
          {
            label: '股指',
            value: 'INDEX',
          },
          {
            label: '股指期货',
            value: 'INDEX_FUTURES',
          },
          {
            label: '股指期权',
            value: 'INDEX_OPTION',
          },
          {
            label: '个股/ETF期权',
            value: 'STOCK_OPTION',
          },
          {
            label: '自定义加权指数',
            value: 'CUSTOM_WEIGHTED_INDEX',
          },
        ];
      }
      return [
        {
          label: '现货',
          value: 'SPOT',
        },
        {
          label: '期货',
          value: 'FUTURES',
        },
        {
          label: '期货期权',
          value: 'FUTURES_OPTION',
        },
      ];
    };

    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '合约类型是必填项',
            },
          ],
        })(<Select style={{ minWidth: 180 }} options={getOptions()} />)}
      </FormItem>
    );
  },
};

const instrumentTypeSearch = {
  title: '合约类型',
  dataIndex: 'instrumentType',
  render: (value, record, index, { form }) => {
    const disable = () => !!_.get(record, 'instrumentIds.value.length');
    const getOptions = () => {
      if (record.assetClass && record.assetClass.value === 'EQUITY') {
        return [
          {
            label: '股票',
            value: 'STOCK',
          },
          {
            label: '股指',
            value: 'INDEX',
          },
          {
            label: '股指期货',
            value: 'INDEX_FUTURES',
          },
          {
            label: '股指期权',
            value: 'INDEX_OPTION',
          },
          {
            label: '个股/ETF期权',
            value: 'STOCK_OPTION',
          },
        ];
      }
      return [
        {
          label: '现货',
          value: 'SPOT',
        },
        {
          label: '期货',
          value: 'FUTURES',
        },
        {
          label: '期货期权',
          value: 'FUTURES_OPTION',
        },
      ];
    };

    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            allowClear
            style={{ minWidth: 180 }}
            options={getOptions()}
            disabled={disable()}
          />,
        )}
      </FormItem>
    );
  },
};

const assetClassSearch = {
  title: '资产类别',
  dataIndex: 'assetClass',
  render: (value, record, index, { form }) => {
    const disable = () => !!_.get(record, 'instrumentIds.value.length');
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            disabled={disable()}
            allowClear
            options={_.keys(ASSET_CLASS_ZHCN_MAP).map(item => ({
              value: item,
              label: ASSET_CLASS_ZHCN_MAP[item],
            }))}
          />,
        )}
      </FormItem>
    );
  },
};

const assetClass = type => ({
  title: '资产类别',
  dataIndex: 'assetClass',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [
          {
            required: true,
            message: '资产类别是必填项',
          },
        ],
      })(
        <Select
          style={{ minWidth: 180 }}
          disabled={type === 'edit'}
          options={_.keys(ASSET_CLASS_ZHCN_MAP).map(item => ({
            value: item,
            label: ASSET_CLASS_ZHCN_MAP[item],
          }))}
        />,
      )}
    </FormItem>
  ),
});

const instrumentId = type => ({
  title: '合约代码',
  dataIndex: 'instrumentId',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [
          {
            required: true,
            message: '合约代码是必填项',
          },
        ],
      })(<Input disabled={type === 'edit'} />)}
    </FormItem>
  ),
});

const instrumentIds = {
  title: '标的物列表',
  dataIndex: 'instrumentIds',
  render: (value, record, index, { form }) => {
    const disable = () =>
      _.get(record, 'assetClass.value') ||
      _.get(record, 'instrumentType.value') ||
      _.get(record, 'assetSubClass.value');
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            placeholder="请输入内容搜索"
            allowClear
            showSearch
            mode="multiple"
            disabled={disable()}
            fetchOptionsOnSearch
            options={async (values: string = '') => {
              const { data = [], error } = await mktInstrumentSearch({
                instrumentIdPart: values,
              });
              if (error) return [];
              return data.slice(0, 50).map(item => ({
                label: item,
                value: item,
              }));
            }}
          />,
        )}
      </FormItem>
    );
  },
};

const exerciseType = {
  title: '行权方式',
  dataIndex: 'exerciseType',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator('exerciseType', {
        rules: [
          {
            required: true,
            message: '行权方式是必填项',
          },
        ],
      })(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          showSearch
          fetchOptionsOnSearch
          options={[
            {
              label: '欧式',
              value: 'EUROPEAN',
            },
            {
              label: '美式',
              value: 'AMERICAN',
            },
          ]}
        />,
      )}
    </FormItem>
  ),
};

const optionType = {
  title: '期权类型',
  dataIndex: 'optionType',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator('optionType', {
        rules: [
          {
            required: true,
            message: '期权类型是必填项',
          },
        ],
      })(
        <Select
          style={{ minWidth: 180 }}
          placeholder="请输入内容搜索"
          allowClear
          showSearch
          fetchOptionsOnSearch
          options={[
            {
              label: '看涨',
              value: 'CALL',
            },
            {
              label: '看跌',
              value: 'PUT',
            },
          ]}
        />,
      )}
    </FormItem>
  ),
};

const strike = {
  title: '行权价格',
  dataIndex: 'strike',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [
          {
            required: true,
            message: '行权价格是必填项',
          },
        ],
      })(<InputNumber precision={4} />)}
    </FormItem>
  ),
};

const underlyerInstrumentId = {
  title: '标的代码',
  dataIndex: 'underlyerInstrumentId',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [
          {
            required: true,
            message: '标的代码是必填项',
          },
        ],
      })(
        <Select
          placeholder="请输入内容搜索"
          allowClear
          showSearch
          fetchOptionsOnSearch
          options={async (values: string = '') => {
            const { data = [], error } = await mktInstrumentSearch({
              instrumentIdPart: values,
              excludeOption: true,
            });
            if (error) return [];
            return data.slice(0, 50).map(item => ({
              label: item,
              value: item,
            }));
          }}
        />,
      )}
    </FormItem>
  ),
};

const expirationDate = {
  title: '期权到期日',
  dataIndex: 'expirationDate',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [
          {
            required: true,
            message: '期权到期日是必填项',
          },
        ],
      })(<DatePicker editing format="YYYY-MM-DD" />)}
    </FormItem>
  ),
};

const expirationTime = {
  title: '期权到期时间',
  dataIndex: 'expirationTime',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator({
        rules: [
          {
            required: true,
            message: '期权到期时间是必填项',
          },
        ],
      })(<TimePicker />)}
    </FormItem>
  ),
};

export const ASSET_SUB_CLASS_MAP = {
  BLACK: '黑色',
  METAL: '有色金属',
  RESOURCE: '能化',
  PRECIOUS_METAL: '贵金属',
  AGRICULTURE: '农产品',
  EQUITY: '个股',
  INDEX: '指数',
  OTHERS: '其它',
};

const subAssetSearch = {
  title: '资产子类别',
  dataIndex: 'assetSubClass',
  render: (value, record, index, { form }) => {
    const disable = () => !!_.get(record, 'instrumentIds.value.length');
    return (
      <FormItem>
        {form.getFieldDecorator()(
          <Select
            disabled={disable()}
            style={{ minWidth: 180 }}
            allowClear
            options={Object.keys(ASSET_SUB_CLASS_MAP).map(v => ({
              label: ASSET_SUB_CLASS_MAP[v] || v,
              value: v,
            }))}
          />,
        )}
      </FormItem>
    );
  },
};

const subAsset = {
  title: '资产子类别',
  dataIndex: 'assetSubClass',
  render: (value, record, index, { form }) => {
    const disable = () => !!_.get(record, 'instrumentIds.value.length');
    return (
      <FormItem>
        {form.getFieldDecorator({
          rules: [
            {
              required: true,
              message: '资产子类别为必墳项',
            },
          ],
        })(
          <Select
            disabled={disable()}
            style={{ minWidth: 180 }}
            allowClear
            options={Object.keys(ASSET_SUB_CLASS_MAP).map(v => ({
              label: ASSET_SUB_CLASS_MAP[v] || v,
              value: v,
            }))}
          />,
        )}
      </FormItem>
    );
  },
};

const tradeCategory = {
  title: '交易品种',
  dataIndex: 'tradeCategory',
  render: (value, record, index, { form }) => {
    const assetClassType = _.get(record, 'assetClass.value');
    const validate =
      assetClassType === 'COMMODITY'
        ? {
            rules: [
              {
                required: true,
                message: '交易品种是必填项',
              },
            ],
          }
        : {};
    return <FormItem>{form.getFieldDecorator(validate)(<Input />)}</FormItem>;
  },
};

const tradeUnit = {
  title: '交易单位',
  dataIndex: 'tradeUnit',
  render: (value, record, index, { form }) => (
    <FormItem>{form.getFieldDecorator()(<Input />)}</FormItem>
  ),
};

const unit = {
  title: '报价单位',
  dataIndex: 'unit',
  render: (value, record, index, { form }) => (
    <FormItem>{form.getFieldDecorator()(<Input />)}</FormItem>
  ),
};

export const REGULATORY_CLASS_MAP = {
  EQUITY: '01:权益类',
  COMMODITY: '02:大宗商品',
  RATES: '03:利率',
  CREDIT: '04:信用类',
  FX: '05:汇率',
  OTHER: '99:其他',
};

const regulatoryClass = {
  title: '监管类别',
  dataIndex: 'regulationAssetClass',
  render: (value, record, index, { form }) => (
    <FormItem>
      {form.getFieldDecorator({})(
        <Select
          style={{ minWidth: 180 }}
          options={Object.keys(REGULATORY_CLASS_MAP).map(v => ({
            label: REGULATORY_CLASS_MAP[v] || v,
            value: v,
          }))}
        />,
      )}
    </FormItem>
  ),
};

export const REGULATORY_ASSET_MAP = {
  STOCK: '01:股票',
  INDEX: '02:股指',
  NEW_OTC_MARKET_STOCK: '03:新三板挂牌股票',
  HK_STOCK: '04:香港股票',
  HK_INDEX: '05:香港股指',
  FUND: '06:基金及基金专户',
  BONDS: '07:债券',
  GOLD_FUTURES: '08:黄金期货',
  BONDS_FUTURES: '09:国债期货',
  INDEX_FUTURES: '10:股指期货',
  OTHER_FUTURES: '11:其他期货',
  GOLD_SPOT: '12:黄金现货',
  OTHER_SPOT: '13:其他现货',
  OUTLANDS_FUTURES: '14:境外期货',
  OUTLANDS_SPOT: '15:境外现货',
  OUTLANDS_STOCK: '16:境外股票',
  OUTLANDS_INDEX: '17:境外股指',
  FX: '18:汇率',
  SHIBOR: '19:Shibor',
  BANK_FIXING_REPO_RATE: '20:银行间回购定盘（Fixing Repo Rate）',
  OTHER_RATES: '21:其他利率',
  OTHERS: '99:其他标的',
};

const regulatoryAsset = {
  title: '监管子类别',
  dataIndex: 'regulationAssetSubClass',
  render: (value, record, index, { form }) => {
    return (
      <FormItem>
        {form.getFieldDecorator({})(
          <Select
            style={{ minWidth: 180 }}
            allowClear
            options={Object.keys(REGULATORY_ASSET_MAP).map(v => ({
              label: REGULATORY_ASSET_MAP[v] || v,
              value: v,
            }))}
          />,
        )}
      </FormItem>
    );
  },
};

export const getInstrumenInfo = event => {
  const fieldMap = {
    'COMMODITY:SPOT': [multiplier],
    'COMMODITY:FUTURES': [multiplier, maturity],
    'COMMODITY:FUTURES_OPTION': [
      underlyerInstrumentId,
      multiplier,
      exerciseType,
      optionType,
      strike,
      expirationDate,
      expirationTime,
    ],
    'EQUITY:STOCK': [multiplier],
    'EQUITY:INDEX': [],
    'EQUITY:INDEX_FUTURES': [multiplier, maturity],
    'EQUITY:INDEX_OPTION': [
      underlyerInstrumentId,
      multiplier,
      exerciseType,
      optionType,
      strike,
      expirationDate,
      expirationTime,
    ],
    'EQUITY:STOCK_OPTION': [
      underlyerInstrumentId,
      multiplier,
      exerciseType,
      optionType,
      strike,
      expirationDate,
      expirationTime,
    ],
    'EQUITY:FUTURES_OPTION': [
      underlyerInstrumentId,
      multiplier,
      exerciseType,
      optionType,
      exerciseType,
      expirationDate,
      expirationTime,
    ],
    'EQUITY:CUSTOM_WEIGHTED_INDEX': [],
  };
  Object.keys(fieldMap).forEach(key => {
    if (
      key === 'COMMODITY:FUTURES_OPTION' ||
      key === 'EQUITY:INDEX_OPTION' ||
      key === 'EQUITY:STOCK_OPTION'
    ) {
      fieldMap[key] = fieldMap[key].concat([subAsset, tradeUnit, unit]);
      return;
    }
    fieldMap[key] = fieldMap[key].concat([subAsset, tradeCategory, tradeUnit, unit]);
  });
  const key = [event.assetClass, event.instrumentType].join(':');
  return fieldMap[key] || [];
};

export const createFormControls = (event = {}, type) =>
  [instrumentId(type), name, assetClass(type), instrumentType, exchange]
    .concat(getInstrumenInfo(event))
    .concat([regulatoryClass, regulatoryAsset]);

export const editFormControls = (event = {}, type) =>
  [instrumentId(type), name, assetClass(type), instrumentType, exchange]
    .concat(getInstrumenInfo(event))
    .concat([regulatoryClass, regulatoryAsset]);

export const searchFormControls = () => [
  assetClassSearch,
  instrumentTypeSearch,
  subAssetSearch,
  instrumentIds,
];
