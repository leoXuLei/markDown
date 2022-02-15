import FormItem from 'antd/lib/form/FormItem';
import { Input as AntdInput } from 'antd';
import React from 'react';
import { Form2 } from '@/components';
import { IFormColDef } from '@/components/type';

export const RESET_FORM: IFormColDef[] = [
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
];

export const ROLE_FIRST_ROW_TITLE_LIST = [
  '序号',
  '用户名',
  '昵称',
  '部门',
  '类型',
  '邮箱',
  '角色',
];


export const DATA_PERMISSIONS_FIRST_ROW_TITLE_LIST = [
  '序号',
  '用户名',
  '昵称',
  '部门',
  '类型',
  '邮箱',
  '数据权限',
  '数据权限',
  '数据权限',
];
