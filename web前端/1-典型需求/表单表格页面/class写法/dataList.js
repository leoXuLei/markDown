/*
 * @Author: xulei
 * @Date: 2020-04-28 22:50:01
 * @LastEditors: xulei
 * @LastEditTime: 2020-05-10 23:05:16
 * @FilePath: \表单表格页面\dataList.js
 */
import { Table } from "antd";
import Moment from "moment";
import ResaleModal from "./operation_resaleModal";

const columns = (onClickRecord) => [
  {
    title: "资料名称",
    dataIndex: "zlmc",
    render: (_, record) => (
      <a
        href={
          record.id && record.id !== 0
            ? `/#/training/CultivateDatumDetail/${record.id}`
            : ""
        }
        target="_blank"
        rel="noopener noreferrer"
      >
        {record.zlmc || "--"}
      </a>
    ),
  },
  {
    title: "发布时间",
    dataIndex: "fbsj",
    render: (text) => {
      return text ? Moment(text).format("YYYY年MM月DD日") : "--";
    },
  },
  {
    title: "发布人",
    dataIndex: "fbr",
    render: (text) => text || "--",
  },
  {
    title: "营业部名称",
    dataIndex: "yybmc",
    render: (text) => text || "--",
  },
  {
    title: "操作",
    dataIndex: "operation",
    render: (_, record, index) => {
      return (
        <div>
          <Button
            onClick={() => onClickRecord(record, index, "resale")}
            type="primary"
            size="small"
          >
            回售
          </Button>
        </div>
      );
    },
  },
];

/* 可以改成无状态组件 */
class DataList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resaleModalVisible: false,
      curRecord: null,
    };
  }

  onClickRecord = (record, type) => {
    this.setState({
      resaleModalVisible: type === "resale",
      curRecord: record,
    });
  };

  handleResaleModalOk = () => {
    this.setState({
      resaleModalVisible: false,
      curRecord: null,
    });
  };

  render() {
    const { resaleModalVisible, curRecord } = this.state;
    const { tableProps, onPaginationChange } = this.props;
    const { payload, loading, dataSource, total } = tableProps;
    const { current, pageSize } = payload;
    const tableAttributes = {
      loading,
      dataSource,
      rowKey: "id",
      pagination: {
        current,
        total,
        pageSize,
        showTotal: () => `共${payload.total}条`,
        onChange: onPaginationChange, // 页码改变的回调，参数是改变后的页码及每页条数
        // onShowSizeChange: (_, pageSize) => onPaginationChange(0, pageSize)	// pageSize 变化的回调
        showSizeChanger: true,
        showQuickJumper: true,
        defaultCurrent: 1,
        defaultPageSize: 10,
      },
      /* rowSelection: {
        selectedRowKeys: matureSelectedRows.map(item => item.id),
        selectAll,
        onChange: (selectedRowKeys, selectedRows) =>
          this.setState({ matureSelectedRows: selectedRows }),
      } */
      /* 
      onChange: (page, filters, sorter) => {
          const orderValue = Object.keys(sorter).length === 0 ? '' :  `${sorter.field}`;
          const sortValue = sorter.order ? sorter.order.substring(0, sorter.order.length - 3) : '';
          dispatch({
            type: "marktingModel/query",
            payload: {
              page: page.current,
              pageSize: page.pageSize,
              orderBy: orderValue,
              sort: sortValue,
            },
          });
      }
      */

      /* 
      expandedRowRender={record => {
          const newData = record.insideTableList || [];
          return (
            <Table
              // onChange={chrldrenChange}
              columns={resaleInsildeListColumns}
              pagination={false}
              dataSource={newData}
              rowKey={r => `${record.product_code}${r.hsqrr}`}
              scroll={{ x: resaleInsildeListColumns.length * 100 }}
            />
          );
        }}
      */
    };
    return (
      <div>
        <Table
          {...tableAttributes}
          scroll={{ x: 1400 }}
          columns={columns(this.onClickRecord)}
        />
        <ResaleModal
          visible={resaleModalVisible}
          record={curRecord}
          handleOk={this.handleResaleModalOk}
          handleCancel={this.handleResaleModalOk}
        />
      </div>
    );
  }
}

export default DataList;
