import FormItem from 'antd/lib/form/FormItem';
import { TreeSelect, Input as AntdInput } from 'antd';
import React from 'react';
import { Input, Select, Form2 } from '@/components';
import { IFormColDef } from '@/components/type';

export const CREATE_FORM_CONTROLS: (departments, roleOptions) => IFormColDef[] = (
  departments,
  roleOptions,
) => [
  {
    title: '用户名',
    dataIndex: 'username',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(<Input />)}
        </FormItem>
      );
    },
  },
  {
    dataIndex: 'password',
    title: '密码',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(
            <AntdInput.Password placeholder="至少一位数字、大小写字母以及其他特殊字符，且不少于8位" />,
          )}
        </FormItem>
      );
    },
  },
  {
    dataIndex: 'confirmpassword',
    title: '确认密码',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(<AntdInput.Password placeholder="请与密码保持一致" />)}
        </FormItem>
      );
    },
  },
  {
    title: '部门',
    dataIndex: 'departmentId',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(<TreeSelect treeData={departments} treeDefaultExpandAll />)}
        </FormItem>
      );
    },
  },
  {
    title: '用户类型',
    dataIndex: 'userType',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(
            <Select
              options={[
                { label: '普通用户', value: 'NORMAL' },
                { label: '脚本用户', value: 'SCRIPT' },
              ]}
            />,
          )}
        </FormItem>
      );
    },
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    render: (val, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
    },
  },
  {
    title: '邮箱',
    dataIndex: 'contactEmail',
    render: (val, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
    },
  },
  {
    title: '角色',
    dataIndex: 'roleIds',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({})(<Select options={roleOptions} mode="multiple" />)}
        </FormItem>
      );
    },
  },
];

export const UPDATE_FORM_CONTROLS = departments => [
  {
    title: '用户名',
    dataIndex: 'username',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(<Input />)}
        </FormItem>
      );
    },
  },
  {
    title: '部门',
    dataIndex: 'departmentId',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(
            <TreeSelect
              treeData={departments}
              treeDefaultExpandAll
              disabled={record.username.value === 'admin'}
            />,
          )}
        </FormItem>
      );
    },
  },
  {
    title: '用户类型',
    dataIndex: 'userType',
    render: (val, record, index, { form }) => {
      return (
        <FormItem>
          {form.getFieldDecorator({
            rules: [
              {
                required: true,
                message: '必填',
              },
            ],
          })(
            <Select
              options={[
                { label: '普通用户', value: 'NORMAL' },
                { label: '脚本用户', value: 'SCRIPT' },
              ]}
            />,
          )}
        </FormItem>
      );
    },
  },
  {
    title: '用户昵称',
    dataIndex: 'nickName',
    render: (val, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
    },
  },
  {
    title: '邮箱',
    dataIndex: 'contactEmail',
    render: (val, record, index, { form }) => {
      return <FormItem>{form.getFieldDecorator({})(<Input />)}</FormItem>;
    },
  },
];
