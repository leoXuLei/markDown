import { Divider, Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import React, { PureComponent } from 'react';
import router from 'umi/router';
import Form2 from '@/components/Form2';
import { PAGE_SIZE } from '@/constants/component';
import { SmartTable } from '@/containers';
import { getPredifinedSteps, getProducts } from '@/services/distribution';
import {
  transformParams,
  transformDateParams,
  judgePagePermissionByRoleIdAndPageName,
} from '@/utils';
import { SEARCH_FORM_COLUMNS, TABLE_COLUMNS } from './constants';

class ProductList extends PureComponent {
  public $form: Form2 = null;

  public state = {
    loading: false,
    dataSource: [],
    productSteps: [],
    searchFormData: {},
    total: 0,
    pagination: {
      current: 1,
      pageSize: PAGE_SIZE,
    },
    moveProductDetailAuthVerified: true,
  };

  public componentDidMount = async () => {
    this.getStep();
    this.onFetchTable();
    const res = await judgePagePermissionByRoleIdAndPageName('moveProductDetail');
    this.setState({
      moveProductDetailAuthVerified: res || false,
    });
  };

  public getStep = async () => {
    const { error, data } = await getPredifinedSteps({});
    if (error) return;
    this.setState({
      productSteps: Array.isArray(data) ? data : [],
    });
  };

  public onFetchTable = async (paramsPagination = {}, sorter = {}) => {
    const res = await judgePagePermissionByRoleIdAndPageName('viewProductList');
    if (!res) {
      return;
    }
    const page = paramsPagination.current || this.state.pagination.current;
    const pageSize = paramsPagination.pageSize || this.state.pagination.pageSize;
    const formData = Form2.getFieldsValue(this.state.searchFormData);
    this.setState({ loading: true });
    const { error, data } = await getProducts({
      params: transformParams(['productCode', 'taskName'], formData),
      likes: transformParams(['productShortDescription'], formData),
      dates: transformDateParams(['subscriptionDate'], formData),
      page: page - 1,
      pageSize,
      ...sorter,
    });
    this.setState({ loading: false });
    if (error) return;
    this.setState(state => ({
      dataSource: Array.isArray(data.page) ? data.page : [],
      total: data.totalCount || 0,
      pagination: {
        ...state.pagination,
        ...paramsPagination,
      },
    }));
  };

  public onChange = ({ current, pageSize }, filter, { order, field }) => {
    if (!order || !field) {
      return this.onFetchTable({ current, pageSize });
    }
    return this.onFetchTable(
      { current, pageSize },
      {
        sortOrder: order,
        sortField: field,
      },
    );
  };

  public render() {
    const {
      loading,
      dataSource,
      productSteps,
      searchFormData,
      total,
      pagination,
      moveProductDetailAuthVerified,
    } = this.state;
    return (
      <Spin spinning={loading}>
        <Form2
          layout="inline"
          dataSource={searchFormData}
          columns={SEARCH_FORM_COLUMNS(productSteps)}
          onFieldsChange={(record, changedFields) =>
            this.setState(state => ({
              searchFormData: { ...state.searchFormData, ...changedFields },
            }))
          }
          onSubmitButtonClick={() => {
            this.onFetchTable({ current: 1, pageSize: PAGE_SIZE });
          }}
          onResetButtonClick={() => {
            this.setState({ searchFormData: {} }, () => {
              this.onFetchTable({ current: 1, pageSize: PAGE_SIZE });
            });
          }}
        ></Form2>
        <Divider></Divider>
        <SmartTable
          rowKey="processInstanceId"
          onChange={this.onChange}
          pagination={{ ...pagination, total }}
          columns={[
            {
              title: '产品代码',
              dataIndex: 'productCode',
              key: 'productCode',
              sorter: true,
              render: (val, record) => (
                <a
                  onClick={() => {
                    router.push(`/distribution/product-list/${record.processInstanceId}`);
                  }}
                  disabled={!moveProductDetailAuthVerified}
                >
                  {val}
                </a>
              ),
            },
            ...TABLE_COLUMNS,
          ]}
          dataSource={dataSource}
        ></SmartTable>
      </Spin>
    );
  }
}

export default ProductList;
