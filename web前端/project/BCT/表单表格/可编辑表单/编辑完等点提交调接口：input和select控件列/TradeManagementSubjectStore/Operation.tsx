import { Divider, message, Modal, Popconfirm } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { memo, useRef, useState } from 'react';
import { getMoment } from '@/tools';
import { mktInstrumentCreate, mktInstrumentDelete } from '@/services/market-data-service';
import { Form2 } from '@/containers';
import { editFormControls } from './services';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const Operation = memo<{ record: any; fetchTable: any }>(props => {
  let $form = useRef<Form2>(null);

  const [editVisible, setEditVisible] = useState(false);
  const [editFormControlsState, setEditformControlsState] = useState({});
  const [editFormData, setEditFormData] = useState({});
  const [editing, setEditing] = useState(false);

  const onRemove = async () => {
    const { error } = await mktInstrumentDelete({
      instrumentId: props.record.instrumentId,
    });
    if (error) {
      message.error('删除失败');
      return;
    }
    message.success('删除成功');
    props.fetchTable();
  };

  const switchModal = () => {
    const data = _.mapValues(props.record, (value, key) => {
      if (value === null || value === undefined) return value;
      if (key === 'expirationTime') {
        return moment(value, 'HH:mm:ss');
      }
      if (['maturity', 'expirationDate'].indexOf(key) !== -1) {
        return moment(value);
      }
      return value;
    });
    setEditVisible(!editVisible);
    setEditFormData(Form2.createFields(_.omitBy(data, _.isNull)));
    setEditformControlsState(editFormControls(props.record, 'edit'));
  };

  const omitNull = obj => _.omitBy(obj, val => val === null);

  const getMomentData = (obj, name) => {
    if (_.has(obj, name)) {
      return getMoment(obj[name]).format('YYYY-MM-DD');
    }
    return undefined;
  };

  const getMomentTime = (obj, name) => {
    if (_.has(obj, name)) {
      return getMoment(obj[name]).format('HH:mm:ss');
    }
    return undefined;
  };

  const composeInstrumentInfo = modalFormData => {
    const formData = {
      ...modalFormData,
      expirationDate: getMomentData(modalFormData, 'expirationDate'),
      expirationTime: getMomentTime(modalFormData, 'expirationTime'),
      maturity: getMomentData(modalFormData, 'maturity'),
    };
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
      'tradeUnit',
      'tradeCategory',
      'unit',
      'regulationAssetClass',
      'regulationAssetSubClass',
    ];
    const params = {
      ..._.omit(formData, instrumentInfoFields),
      instrumentInfo: omitNull(_.pick(formData, instrumentInfoFields)),
    };
    return omitNull(params);
  };

  const onEdit = async () => {
    const rsp = await $form.validate();
    if (rsp.error) return;
    setEditing(false);
    const newEditFormData = composeInstrumentInfo(Form2.getFieldsValue(editFormData));
    const { error } = await mktInstrumentCreate(newEditFormData);
    setEditing(false);

    if (error) {
      message.error('编辑失败');
      return;
    }
    message.success('编辑成功');
    setEditVisible(false);
    props.fetchTable();
  };

  const filterFormData = (allFields, fields, columns) => {
    const changed = fields;
    const column = columns.map(item => item.dataIndex);
    const formData = _.pick(allFields, column);
    if (Object.keys(changed)[0] === 'assetClass') {
      return {
        ..._.pick(props.record, ['instrumentId']),
        ...fields,
      };
    }
    if (Form2.getFieldValue(changed.instrumentType) === 'STOCK') {
      return {
        ...formData,
        multiplier: Form2.createField(1),
      };
    }
    return formData;
  };

  const onEditFormChange = (p, fields, allFields) => {
    const columns = editFormControls(Form2.getFieldsValue(allFields), 'edit');
    setEditformControlsState(columns);
    setEditFormData(filterFormData(allFields, fields, columns));
  };

  return (
    <>
      <a style={{ color: '#1890ff' }} onClick={switchModal}>
        编辑
      </a>
      <Divider type="vertical" />
      <Popconfirm title="确定要删除吗？" onConfirm={onRemove}>
        <a style={{ color: 'red' }}>删除</a>
      </Popconfirm>
      <Modal
        visible={editVisible}
        onOk={onEdit}
        onCancel={switchModal}
        okButtonProps={{ loading: editing }}
        title="编辑标的物"
      >
        <Form2
          ref={node => {
            $form = node;
          }}
          columns={editFormControlsState}
          dataSource={editFormData}
          onFieldsChange={onEditFormChange}
          footer={false}
        />
      </Modal>
    </>
  );
});

export default Operation;
