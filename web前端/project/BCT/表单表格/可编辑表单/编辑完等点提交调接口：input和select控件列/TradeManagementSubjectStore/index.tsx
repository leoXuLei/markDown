import { Button, Divider, message, Alert, Modal } from 'antd';
import _ from 'lodash';
import moment, { isMoment } from 'moment';
import React, { memo, useEffect, useRef, useState } from 'react';
import FormItem from 'antd/lib/form/FormItem';
import { PAGE_SIZE } from '@/constants/component';
import { VERTICAL_GUTTER } from '@/constants/global';
import { Form2, SmartTable, InputNumber, Select, Table2 } from '@/containers';
import BigNumber from 'bignumber.js';
import Page from '@/containers/Page';
import {
  mktInstrumentCreate,
  mktInstrumentsListPaged,
  mktInstrumentSearch,
} from '@/services/market-data-service';
import { TABLE_COL_DEFS } from './tools';
import { createFormControls, searchFormControls } from './services';
import AutoSelect from './AutoSelect';

const TradeManagementMarketManagement = () => {
  const $form = useRef<Form2>(null);

  const defaultPagination = {
    pageSize: PAGE_SIZE,
    current: 1,
  };

  const [searchFormData, setSearchFormData] = useState({});
  const [searchForm, setSearchForm] = useState({});
  const [createFormData, setCreateFormData] = useState({});
  const [pagination, setPagination] = useState(defaultPagination);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tableDataSource, setTableDataSource] = useState([]);
  const [createVisible, setCreateVisible] = useState(false);
  const [createFormControlsState, setCreateFormControlsState] = useState({});
  const [creating, setCreating] = useState(false);
  const [noData, setNoData] = useState(true);
  const [underlyerTableData, setUnderlyerTableData] = useState([]);

  const $editTable = useRef<Table2>(null);

  const fetchTable = async (paramsPagination?, formData?, useSearchForm = false) => {
    const actualPagination = paramsPagination || pagination;
    setLoading(true);
    const newSearchFormData = _.mapValues(
      Form2.getFieldsValue(formData || searchForm),
      (value, key) => {
        if (key === 'instrumentIds' && (!value || !value.length)) {
          return undefined;
        }
        return value;
      },
    );

    const { error, data } = await mktInstrumentsListPaged({
      page: actualPagination.current - 1,
      pageSize: actualPagination.pageSize,
      ...newSearchFormData,
    });
    setLoading(false);
    if (error) return;
    if (useSearchForm) {
      setSearchForm(searchFormData);
    }
    setTableDataSource(data.page);
    setTotal(data.totalCount);
    setNoData(data.page.length === 0);
  };

  const filterFormData = (allFields, fields) => {
    if (fields.assetClass) {
      return {
        ..._.pick(allFields, ['instrumentId', 'name']),
        ...fields,
      };
    }

    const instrumentType = Form2.getFieldValue(fields.instrumentType);
    if (instrumentType === 'STOCK') {
      return {
        ...allFields,
        multiplier: Form2.createField(1),
      };
    }
    return allFields;
  };

  const optionInstrumentType = ['FUTURES_OPTION', 'STOCK_OPTION', 'INDEX_OPTION'];

  const onCreateFormChange = (p, fields) => {
    const nextAllFields = {
      ...createFormData,
      ...fields,
    };
    const instrumentType = Form2.getFieldValue(fields.instrumentType);
    if (optionInstrumentType.indexOf(instrumentType) !== -1) {
      nextAllFields.expirationTime = Form2.createField(moment('15:00:00', 'HH:mm:ss'));
    }
    const columns = createFormControls(Form2.getFieldsValue(nextAllFields), 'create');
    setCreateFormControlsState(columns);
    setCreateFormData(filterFormData(nextAllFields, fields));
  };

  const omitNull = obj => _.omitBy(obj, val => val === null);

  const composeInstrumentInfo = formData => {
    const modalFormData = formData;
    if (optionInstrumentType.indexOf(modalFormData.instrumentType) !== -1) {
      modalFormData.expirationDate = moment(modalFormData.expirationDate).format('YYYY-MM-DD');
      modalFormData.expirationTime = moment(modalFormData.expirationTime).format('HH:mm:ss');
    }
    const instrumentInfoFields = [
      'multiplier',
      'name',
      'exchange',
      'maturity',
      'expirationDate',
      'expirationTime',
      'optionType',
      'exerciseType',
      'strike',
      'multiplier',
      'underlyerInstrumentId',
      'tradeCategory',
      'tradeUnit',
      'unit',
      'regulationAssetClass',
      'regulationAssetSubClass',
    ];
    const params = {
      ..._.omit(modalFormData, instrumentInfoFields),
      instrumentInfo: omitNull(_.pick(modalFormData, instrumentInfoFields)),
    };
    return omitNull(params);
  };

  const onCreate = async () => {
    // 校验表单
    if (!underlyerTableData.length) {
      message.error('标的物列表为空');
      return;
    }
    if (
      underlyerTableData.some(
        v => !Form2.getFieldValue(v.weight) || !Form2.getFieldValue(v.underlyerInstrumentId),
      )
    ) {
      message.error('标的物代码和权重必填');
      return;
    }
    const res = await $editTable.current.validate({ force: true });
    if (_.isArray(res)) {
      if (res.some(v => v.errors)) return;
    }
    const weight = underlyerTableData.reduce((t, v) => {
      let temp = t;
      temp = new BigNumber(temp).plus(Form2.getFieldValue(v.weight)).toNumber();
      return temp;
    }, 0);

    if (weight !== 100) {
      message.error('所以标的物权重之和必须等于100');
      return;
    }
    const rsp = await $form.current.validate();
    if (rsp.error) return;
    const columnsKey = $form.current.props.columns.map(item => item.dataIndex);
    let newCreateFormData = Form2.getFieldsValue(createFormData);
    newCreateFormData = composeInstrumentInfo(newCreateFormData);
    newCreateFormData.instrumentInfo.maturity = isMoment(newCreateFormData.instrumentInfo.maturity)
      ? moment(newCreateFormData.instrumentInfo.maturity).format('YYYY-MM-DD')
      : newCreateFormData.instrumentInfo.maturity;

    setCreating(true);
    const instrumentList = underlyerTableData.map(v => Form2.getFieldsValue(_.omit(v, ['index'])));
    const { error } = await mktInstrumentCreate({
      ...newCreateFormData,
      instrumentInfo: {
        ..._.pick(newCreateFormData.instrumentInfo, columnsKey),
        instrumentList,
      },
    });
    setCreating(false);

    if (error) {
      message.error('创建失败');
      return;
    }
    message.success('创建成功');

    setCreateVisible(false);
    setCreateFormData({});
    setCreateFormControlsState(createFormControls({}, 'create'));
    setPagination(defaultPagination);
    fetchTable(defaultPagination);
  };

  const onSearchFormChange = (p, fields, allFields) => {
    if (fields.assetClass) {
      return setSearchFormData({
        ..._.omit(searchFormData, ['instrumentType']),
        ...fields,
      });
    }
    return setSearchFormData(allFields);
  };

  const onPaginationChange = (current, pageSize) => {
    const next = {
      current,
      pageSize,
    };
    setPagination(next);
    fetchTable(next);
  };

  const switchModal = () => {
    setCreateVisible(!createVisible);
    setCreateFormData({});
    setCreateFormControlsState(createFormControls({}, 'create'));
    setUnderlyerTableData([]);
  };

  const onSearch = () => {
    setPagination(defaultPagination);
    fetchTable(defaultPagination, searchFormData, true);
  };

  const onReset = () => {
    setPagination(defaultPagination);
    setSearchFormData({});
    setSearchForm({});
    fetchTable(defaultPagination, {}, false);
  };

  const description = (
    <div>
      <p>1. 新创建的标的，需要确保有行情数据才能正确试定价；</p>
      <p>2. 需要将标的物加入风控白名单之后才能正常簿记。</p>
    </div>
  );

  useEffect(() => {
    fetchTable(null, {});
    setCreateFormControlsState(createFormControls({}, 'create'));
  }, []);

  const onCellFieldsChange = async ({ record, rowIndex }, isSelect) => {
    setUnderlyerTableData(
      underlyerTableData.map((item, index) => {
        if (index === rowIndex) {
          return record;
        }
        return item;
      }),
    );
  };

  const onAutoSelectChange = (rowIndex, list) => {
    setUnderlyerTableData(
      underlyerTableData.map((v, index) => {
        if (index === rowIndex) {
          return {
            ...v,
            underlyerInstrumentId: Form2.createField(list),
          };
        }
        return v;
      }),
    );
  };

  const instrumentType = Form2.getFieldValue(createFormData.instrumentType);

  return (
    <Page>
      <Form2
        columns={searchFormControls()}
        dataSource={searchFormData}
        layout="inline"
        onSubmitButtonClick={onSearch}
        onResetButtonClick={onReset}
        onFieldsChange={onSearchFormChange}
        submitText="查询"
      />
      <Divider />
      <SmartTable
        tablePro
        tableKey="markets_subject-store"
        tableProProps={{
          defaultCustomColumnsComponentProps: {
            customFromDefaultColumns: true,
          },
          enableCustomColumns: true,
          enableResizeColumns: true,
          defaultColumns: TABLE_COL_DEFS(() => fetchTable(null, null, false)).map(col => ({
            ...col,
            key: col.dataIndex || col.title,
            defaultWidth: col.width,
          })),
          extraActions: (
            <Button style={{ marginBottom: VERTICAL_GUTTER }} type="primary" onClick={switchModal}>
              新建标准合约
            </Button>
          ),
        }}
        rowKey="instrumentId"
        loading={loading}
        dataSource={tableDataSource}
        pagination={{
          ...pagination,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: onPaginationChange,
          onShowSizeChange: onPaginationChange,
        }}
      />
      <Modal
        visible={createVisible}
        onOk={onCreate}
        onCancel={switchModal}
        title="新建标的物"
        okButtonProps={{ loading: creating }}
        width={800}
      >
        <Form2
          ref={node => {
            $form.current = node;
          }}
          columns={createFormControlsState}
          dataSource={createFormData}
          onFieldsChange={onCreateFormChange}
          footer={false}
        />
        {instrumentType === 'CUSTOM_WEIGHTED_INDEX' && (
          <>
            <Button
              onClick={() => {
                setUnderlyerTableData(prev => [...prev, { index: prev.length }]);
              }}
              type="primary"
              style={{ marginBottom: VERTICAL_GUTTER }}
            >
              新增标的物
            </Button>
            <SmartTable
              ref={node => {
                $editTable.current = node;
              }}
              style={{ marginBottom: VERTICAL_GUTTER }}
              dataSource={underlyerTableData}
              rowKey="index"
              pagination={false}
              onCellFieldsChange={onCellFieldsChange}
              columns={[
                {
                  title: '标的物代码',
                  dataIndex: 'underlyerInstrumentId',
                  editable: () => true,
                  render: (value, record, index, { form, editing, api }) => (
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [
                          {
                            required: true,
                            message: '标的物代码必填',
                          },
                        ],
                      })(
                        <AutoSelect
                          getPopupContainer={() => api.tableApi.getTableEl()} // 不加可编辑select无法保存值
                          {...{
                            index,
                            form,
                            editing,
                          }}
                          onAutoSelectChange={onAutoSelectChange}
                        />,
                      )}
                    </FormItem>
                  ),
                },
                {
                  title: '权重',
                  dataIndex: 'weight',
                  editable: () => true,
                  render: (value, record, index, { form, editing }) => (
                    <FormItem>
                      {form.getFieldDecorator({
                        rules: [
                          {
                            required: true,
                            message: '权重必填',
                          },
                        ],
                      })(<InputNumber editing={editing} autoSelect min={0} max={100} />)}
                    </FormItem>
                  ),
                },
              ]}
            />
          </>
        )}
        <Alert message="注意：" description={description} type="warning" />
      </Modal>
    </Page>
  );
};
export default memo(TradeManagementMarketManagement);
