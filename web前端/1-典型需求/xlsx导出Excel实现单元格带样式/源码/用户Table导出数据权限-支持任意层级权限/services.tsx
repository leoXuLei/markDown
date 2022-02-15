import React from 'react';
import FormItem from 'antd/lib/form/FormItem';
import Operation from './Operation';
import ButtonSelect from './ButtonSelect';

export const createPageTableColDefs = (roleOptions, showResources, departments, fetchData) => [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 180,
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    width: 180,
  },
  {
    title: '拥有角色',
    dataIndex: 'roles',
    editable: record => {
      return true;
    },
    render: (value, record, index, { form, editing, cellApi, api }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(
            <ButtonSelect
              getPopupContainer={() => api.tableApi.getTableEl()}
              options={roleOptions}
              mode="multiple"
              {...{ record, index, form, editing, cellApi }}
            />,
          )}
        </FormItem>
      );
    },
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    width: 200,
  },
  {
    title: '类型',
    dataIndex: 'userTypeName',
    width: 100,
  },
  {
    title: '邮箱',
    dataIndex: 'contactEmail',
    width: 200,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 230,
    render: (value, record, index) => {
      return (
        <Operation
          record={record}
          showResources={showResources}
          departments={departments}
          fetchData={fetchData}
        />
      );
    },
  },
];

export const ExportTableColDefs = [
  {
    title: '用户名',
    dataIndex: 'username',
    width: 180,
  },
  {
    title: '昵称',
    dataIndex: 'nickName',
    width: 180,
  },
  {
    title: '拥有角色',
    dataIndex: 'roles',
  },
  {
    title: '部门',
    dataIndex: 'departmentName',
    width: 200,
  },
  {
    title: '类型',
    dataIndex: 'userTypeName',
    width: 100,
  },
  {
    title: '邮箱',
    dataIndex: 'contactEmail',
    width: 200,
  },
  {
    title: '最近登陆时间',
    dataIndex: 'lastLoginTime',
    width: 200,
  },
  {
    title: '最近锁定时间',
    dataIndex: 'lockedTime',
    width: 200,
  },
  {
    title: '最近密码修改时间',
    dataIndex: 'passwordModifyTime',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'state',
    width: 200,
  },
];
