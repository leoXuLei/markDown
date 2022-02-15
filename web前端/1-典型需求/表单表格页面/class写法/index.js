import React from 'react';
import { Card, message } from 'antd';
import Moment from 'moment';
import FilterForm from './filterForm';
import DataList from './dataList';
import { FetchTrainDataDictionary } from '../../../../../../services/trainexam';

class CultivateRecord extends React.Component {
  state={
    tableProps: {
      loading: false,
      dataSource: [],
      total: 0,
      /* 接口参数 */
      payload: {
        /* 分页参数 */
        current: 1,
        pageSize: 10,
        // sort: '',

        /* 控件参数 */
        jsrq: '', // 结束日期
        ksrq: '', // 开始日期
        yyb: '',  // 营业部
        zlfl: '', // 资料分类
        zlmc: '', // 资料名称
      },
    },

    zlflOptions: [], // 资料分类控件源数据
    yybOptions: [],  // 营业部控件源数据

  }

  /* this.setState(prevState => ({
    tableProps: {
      ...prevState.tableProps,
      loading: true
    }
  })); */

  /*  */
  componentDidMount() {
    this.fetchData();
    this.fetchSelectData(1); // 获取资料种类option
    this.fetchSelectData(2); // 获取营业部种类option  暂时接口有问题
  }

  fetchData = (param = {}) => {
    const { tableProps } = this.state;
    const latestPayload = {
      ...tableProps.payload,
      ...param,
    };
    this.setState(prevState => ({
      tableProps: {
        ...prevState.tableProps,
        loading: true
      }
    }));
    FetchxxxList({
      ...latestPayload,
    }).then((ret = {}) => {
      const { records = [], total = 0, note = '' } = ret;
      this.setState(prevState => ({
        tableProps: {
          ...prevState.tableProps,
          dataSource: records,
          total, // 查询列表后更新total
          loading: false,
          payload: {
            ...latestPayload,
          },
        }
      }))
    }).catch(((error) => {
      message.error(!error.success ? error.message : error.note);
    }));
  }

  fetchSelectData=(type) => {
    // 获取表单控件源数据 下拉菜单options
    FetchTrainDataDictionary({
      zdlx: type,
    }).then((ret = {}) => {
      const { code = 0, records = [] } = ret;
      if (code > 0) {
        switch (type) {
          case 1:
            this.setState({ zlflOptions: records });
            break;
          case 2:
            this.setState({ yybOptions: records });
            break;
          default:
            break;
        }
      }
    }).catch((error) => {
      message.error(!error.success ? error.message : error.note);
    });
  }

  handleSubmit = (values) => {
    const dateFormat = 'YYYYMMDD';
    const { pxsj = [null, null], zlmc = '', zlfl = '', yyb = '' } = values;
    this.fetchData({
      ksrq: pxsj[0] === null ? null : Moment(pxsj[0]).format(dateFormat),
      jsrq: pxsj[1] === null ? null : Moment(pxsj[1]).format(dateFormat),
      zlmc,
      zlfl,
      yyb,
      current: 1,  /* 点击查询第一页 */
    });
  }

  onPaginationChange = (page, pageSize) => {
    this.fetchData({ current: page, pageSize });
  }
  render() {
    const { tableProps, zlflOptions = [], yybOptions = [] } = this.state;

    return (
      <div>
        <Card
          title="培训资料"
          className="m-card"
        >
          <FilterForm 
            handleSubmit={this.handleSubmit}
            zlflOptions={zlflOptions}
            yybOptions={yybOptions}
          />
          <DataList 
            tableProps={tableProps}
            onPaginationChange={this.onPaginationChange}
          />
        </Card>
      </div>
    );
  }
}

export default CultivateRecord;
