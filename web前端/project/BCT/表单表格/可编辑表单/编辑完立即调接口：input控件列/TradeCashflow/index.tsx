import React, { useEffect, useState, memo } from 'react';
import { Divider, message, Button, Row } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { PAGE_SIZE } from '@/constants/component';
import { fetch } from '@/utils';
import { ITableColDef } from '@/components/type';
import { VERTICAL_GUTTER } from '@/constants/global';
import { exportExcelFileStream } from '@/tools';
import SmartForm from '@/containers/SmartForm';
import { Form2, Select, SmartTable } from '@/containers';
import { TABLE_COLUMNS, FORM_COLUMNS } from './constants';
import { PAYMENT_STATUS_MAP } from '../constants';

const defaultPage = {
  pageSize: PAGE_SIZE,
  current: 1,
};

const TradeCashflow = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFormData, setSearchFormData] = useState({});
  const [pagination, setPagination] = useState(defaultPage);
  const [total, setTotal] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSearchForm = () => {
    const formData = Form2.getFieldsValue(searchFormData);
    return {
      ..._.omit(formData, ['paymentDate', 'eventDate', 'settleDate']),
      ...(_.get(formData, 'eventDate.length')
        ? {
            eventStartDate: moment(formData.eventDate[0]).format('YYYY-MM-DD'),
            eventEndDate: moment(formData.eventDate[1]).format('YYYY-MM-DD'),
          }
        : null),
      ...(_.get(formData, 'paymentDate.length')
        ? {
            paymentStartDate: moment(formData.paymentDate[0]).format('YYYY-MM-DD'),
            paymentEndDate: moment(formData.paymentDate[1]).format('YYYY-MM-DD'),
          }
        : null),
      ...(_.get(formData, 'settleDate.length')
        ? {
            settleStartDate: moment(formData.settleDate[0]).format('YYYY-MM-DD'),
            settleEndDate: moment(formData.settleDate[1]).format('YYYY-MM-DD'),
          }
        : null),
    };
  };

  const fetchTable = async (paginationParams, formData = null) => {
    const { current: page, pageSize } = paginationParams;
    const formDataParam = formData || handleSearchForm();
    setLoading(true);
    const {
      data: { result, error },
    } = await fetch['POST/capital-service/api/rpc/method=capTradeReceivablePayableSearch']({
      request: formDataParam,
      page: page - 1,
      pageSize,
    });
    setLoading(false);
    if (error) {
      return;
    }
    setTotal(result.totalCount || 0);
    setDataSource(
      Array.isArray(result.page)
        ? result.page.map(v => ({
            ...v,
            comment: Form2.createField(v.comment),
          }))
        : [],
    );
  };

  useEffect(() => {
    fetchTable(defaultPage);
  }, []);

  const handleSearchFormChange = async (props, changedFields, allFields) => {
    setSearchFormData(prevState => ({
      ...prevState,
      ...changedFields,
    }));
  };

  const handleSearch = () => {
    fetchTable(defaultPage);
    setPagination(defaultPage);
  };

  const handleReset = () => {
    fetchTable(defaultPage, {});
    setPagination(defaultPage);
    setSearchFormData({});
  };

  // pageSize变化
  const handlePaginationChange = (page, pageSize) => {
    setPagination({ current: page, pageSize });
  };

  // pageSize & 页码
  const handleTableChange = (paginationParams, filters, sorter) => {
    const { current, pageSize } = paginationParams;
    fetchTable({ current, pageSize });
    setPagination({ current, pageSize });
  };

  const handleExportExcel = async () => {
    const asyncRes = await fetch[
      'POST/capital-service/api/rpc/method=capTradeReceivablePayableExport'
    ](
      {
        request: handleSearchForm(),
      },
      {
        // responseType: 'application/vnd.ms-excel',
        // responseType: 'arraybuffer',
      },
    );
    const {
      data: { result },
    } = asyncRes;
    const { fileName, fileExtension, file } = result;
    exportExcelFileStream({ fileName, fileExtension, file });
  };

  const onClickConfirmPayment = async record => {
    const { id } = record;
    const {
      data: { error },
    } = await fetch['POST/capital-service/api/rpc/method=capTradeReceivablePayableConfirmPayment']({
      id,
    });
    if (error) return;
    message.success('确认支付成功！');
    fetchTable(defaultPage);
  };

  const onClickCancelPayment = async record => {
    const { id } = record;
    const {
      data: { error },
    } = await fetch['POST/capital-service/api/rpc/method=capTradeReceivablePayableRevertPayment']({
      id,
    });
    if (error) return;
    message.success('撤销支付成功！');
    fetchTable(defaultPage);
  };

  const handleBatchConfirmPayment = async () => {
    if (!selectedRows.length) {
      message.info('请先勾选数据');
      return;
    }
    const {
      data: { error },
    } = await fetch[
      'POST/capital-service/api/rpc/method=capTradeReceivablePayableBulkConfirmPayment'
    ]({
      ids: selectedRows.map(v => v.id),
    });
    if (error) return;
    message.success('批量确认支付成功！');
    setSelectedRows([]);
    fetchTable(defaultPage);
  };

  const onCellFieldsChange = async ({ record, rowIndex }, isSelect) => {
    console.log(`record`, record);
    setDataSource(prev => {
      return prev.map((item, index) => {
        if (index === rowIndex) {
          return record;
        }
        return item;
      });
    });
  };

  const onCellEditingChanged = async ({ record, rowIndex }, isSelect) => {
    const { comment, id } = Form2.getFieldValue(record);
    if (!id) return;
    setLoading(true);
    const {
      data: { error },
    } = await fetch['POST/capital-service/api/rpc/method=capTradeReceivablePayableComment']({
      id,
      comment: Form2.getFieldValue(comment),
    });
    setLoading(false);
    if (error) {
      return;
    }
    fetchTable(defaultPage);
  };

  return (
    <>
      <SmartForm
        layout="inline"
        dataSource={searchFormData}
        spread={3}
        submitText="查询"
        submitButtonProps={{
          icon: 'search',
        }}
        onSubmitButtonClick={handleSearch}
        onResetButtonClick={handleReset}
        onFieldsChange={handleSearchFormChange}
        columns={FORM_COLUMNS}
      />
      <Divider />
      <Row style={{ marginBottom: '20px' }} type="flex" justify="end">
        <Button
          type="primary"
          style={{ marginBottom: VERTICAL_GUTTER }}
          onClick={handleExportExcel}
        >
          导出Excel
        </Button>

        <Button
          type="primary"
          style={{ marginBottom: VERTICAL_GUTTER, marginLeft: VERTICAL_GUTTER }}
          onClick={handleBatchConfirmPayment}
        >
          批量确认支付
        </Button>
      </Row>

      <SmartTable
        rowKey="id"
        dataSource={dataSource}
        columns={
          [
            ...TABLE_COLUMNS,
            {
              title: '操作',
              dataIndex: 'operation',
              fixed: 'right',
              width: 120,
              render: (val, record) => {
                if (record.paymentStatus === PAYMENT_STATUS_MAP.NOT_PAY) {
                  return (
                    <a href="#" onClick={() => onClickConfirmPayment(record)}>
                      确认支付
                    </a>
                  );
                }
                if (record.paymentStatus === PAYMENT_STATUS_MAP.PAID) {
                  return (
                    <a href="#" onClick={() => onClickCancelPayment(record)}>
                      撤销支付
                    </a>
                  );
                }
                return null;
              },
            },
          ] as ITableColDef<any>
        }
        pagination={{
          ...pagination,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: handlePaginationChange,
        }}
        rowSelection={{
          selectedRowKeys: selectedRows.map(v => v.id),
          getCheckboxProps: record => ({
            disabled: record.paymentStatus === PAYMENT_STATUS_MAP.PAID,
          }),
          onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        loading={loading}
        scroll={dataSource && dataSource.length > 0 ? { x: 'max-content' } : { x: false }}
        onChange={handleTableChange}
        onCellFieldsChange={onCellFieldsChange}
        onCellEditingChanged={onCellEditingChanged}
      />
    </>
  );
};

export default memo(TradeCashflow);
