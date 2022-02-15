import React, { useEffect, useState, memo, useRef } from 'react';
import { Divider, message, Button, Row, Modal } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { PAGE_SIZE } from '@/constants/component';
import { fetch } from '@/utils';
import { ITableColDef } from '@/components/type';
import { VERTICAL_GUTTER } from '@/constants/global';
import SmartForm from '@/containers/SmartForm';
import { Form2, Select, SmartTable } from '@/containers';
import { exportExcelFileStream } from '@/tools';
import { TABLE_COLUMNS, FORM_COLUMNS, modalFormControls } from './constants';
import { PAYMENT_STATUS_MAP } from '../constants';

const defaultPage = {
  pageSize: PAGE_SIZE,
  current: 1,
};

const AdvancePaymentCashflow = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchFormData, setSearchFormData] = useState({});
  const [pagination, setPagination] = useState(defaultPage);
  const [total, setTotal] = useState(0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalFormData, setModalFormData] = useState({});
  const [filterData, setFilterData] = useState([]);

  let $modalForm = useRef<Form2>(null);

  const handleSearchForm = () => {
    const formData = Form2.getFieldsValue(searchFormData);
    return {
      ..._.omit(formData, ['eventDate', 'paymentDate']),
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
    };
  };

  const fetchTable = async (paginationParams, formData = null, setFilterDataFlag = false) => {
    const { current: page, pageSize } = paginationParams;
    const formDataParam = formData || handleSearchForm();
    setLoading(true);
    const {
      data: { result, error },
    } = await fetch['POST/capital-service/api/rpc/method=capMarginReceivablePayableSearch']({
      request: formDataParam,
      page: page - 1,
      pageSize,
    });
    setLoading(false);
    if (error) {
      return;
    }
    setTotal(result.totalCount || 0);
    const tempData = Array.isArray(result.page)
      ? result.page.map(v => ({
          ...v,
          comment: Form2.createField(v.comment),
        }))
      : [];
    setDataSource(tempData);
    setFilterData(
      setFilterDataFlag ? tempData.filter(item => item.cashFlowAmount !== 0) : tempData,
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
    // 金额列筛选取消点击确定之后会触发本函数且传参有问题， current是1，pageSize是undefined
    setPagination({ current: page, pageSize: pageSize || defaultPage.pageSize });
  };

  // pageSize & 页码
  const handleTableChange = (paginationParams, filters, sorter) => {
    const { current, pageSize } = paginationParams;
    const isNotCurrentPage = !(current === pagination.current && pageSize === pagination.pageSize);

    if (isNotCurrentPage) {
      if (_.get(filters, 'cashFlowAmount.length')) {
        fetchTable({ current, pageSize }, null, true);
      } else {
        fetchTable({ current, pageSize });
      }
      setPagination({ current, pageSize });
      return;
    }
    if (_.get(filters, 'cashFlowAmount.length')) {
      setFilterData(dataSource.filter(item => item.cashFlowAmount !== 0));
    } else {
      setFilterData(dataSource);
    }
  };

  const handleExportExcel = async () => {
    const asyncRes = await fetch[
      'POST/capital-service/api/rpc/method=capMarginReceivablePayableExport'
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
    } = await fetch['POST/capital-service/api/rpc/method=capMarginReceivablePayableConfirmPayment'](
      {
        id,
      },
    );
    if (error) return;
    message.success('确认支付成功！');
    fetchTable(defaultPage);
  };

  const onClickCancelPayment = async record => {
    const { id } = record;
    const {
      data: { error },
    } = await fetch['POST/capital-service/api/rpc/method=capMarginReceivablePayableRevertPayment']({
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
      'POST/capital-service/api/rpc/method=capMarginReceivablePayableBulkConfirmPayment'
    ]({
      ids: selectedRows.map(v => v.id),
    });
    if (error) return;
    message.success('批量确认支付成功！');
    setSelectedRows([]);
    fetchTable(defaultPage);
  };

  const onCellFieldsChange = async ({ record, rowIndex }, isSelect) => {
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
    } = await fetch['POST/capital-service/api/rpc/method=capMarginReceivablePayableComment']({
      id,
      comment: Form2.getFieldValue(comment),
    });
    setLoading(false);
    if (error) {
      return;
    }
    fetchTable(defaultPage);
  };

  const onClickUpdatePaymentMethod = record => {
    const formData = _.pick(record, [...modalFormControls.map(v => v.dataIndex), 'id']);
    setModalVisible(true);
    setModalFormData(Form2.createFields(formData));
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const handleModalOk = async () => {
    setConfirmLoading(true);
    const { id, paymentMethod } = Form2.getFieldsValue(modalFormData);

    const {
      data: { error },
    } = await fetch[
      'POST/capital-service/api/rpc/method=capMarginReceivablePayableChangePaymentMethod'
    ]({
      id,
      paymentMethod,
    });
    setConfirmLoading(false);
    if (error) return;
    message.success('更新支付方式成功！');
    setModalVisible(false);
    fetchTable(defaultPage);
  };

  const modalFormChange = async (props, changedFields, allFields) => {
    setModalFormData(prev => {
      return {
        ...prev,
        ...changedFields,
      };
    });
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
        dataSource={filterData}
        columns={
          [
            ...TABLE_COLUMNS,
            {
              title: '操作',
              dataIndex: 'operation',
              fixed: 'right',
              width: 200,
              render: (val, record) => {
                if (record.cashFlowStatus === 'DISABLE') {
                  return null;
                }
                return (
                  <>
                    <a href="#" onClick={() => onClickUpdatePaymentMethod(record)}>
                      更新支付方式
                    </a>
                    <Divider type="vertical" />
                    {record.paymentStatus === PAYMENT_STATUS_MAP.NOT_PAY && (
                      <a href="#" onClick={() => onClickConfirmPayment(record)}>
                        确认支付
                      </a>
                    )}
                    {record.paymentStatus === PAYMENT_STATUS_MAP.PAID && (
                      <a href="#" onClick={() => onClickCancelPayment(record)}>
                        撤销支付
                      </a>
                    )}
                  </>
                );
              },
            },
          ] as ITableColDef<any>
        }
        pagination={{
          ...pagination,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          // onChange: handlePaginationChange,
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

      <Modal
        visible={modalVisible}
        title="更新支付方式"
        onCancel={handleModalCancel}
        maskClosable={false}
        footer={[
          <Button onClick={handleModalCancel}>取消</Button>,
          <Button key="submit" type="primary" loading={confirmLoading} onClick={handleModalOk}>
            确定
          </Button>,
        ]}
      >
        <Form2
          ref={node => {
            $modalForm = node;
          }}
          dataSource={modalFormData}
          columns={modalFormControls}
          footer={false}
          onFieldsChange={modalFormChange}
        />
      </Modal>
    </>
  );
};

export default memo(AdvancePaymentCashflow);
