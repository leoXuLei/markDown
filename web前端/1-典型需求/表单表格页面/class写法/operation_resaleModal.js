import React, { PureComponent } from "react";
import { Modal, Row, Col, Form, InputNumber, DatePicker } from "antd";
import moment from 'moment';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 14,
  },
};

const formatNum = num => {
  return num.indexOf(".") === -1
    ? num.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,")
    : num.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
};

class ResaleModal extends PureComponent {
  handleOk = () => {
    const { handleOk } = this.props;
    const values = this.props.form.getFieldsValue();
    if (moment(values.date).format('d') !== 5) {
      Modal.confirm({
        title: '该日期不是回售开放日，是否仍要执行回售？',
        content: '',
        onOk() {
          /* if (handleOk && typeof handleOk === 'function') {
            handleOk(values);
          } */
        },
        onCancel() {
        },
      });
    } else {
      if (handleOk && typeof handleOk === 'function') {
        handleOk(values);
      }
    }
  }
  render() {
    const { visible, record, handleCancel } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Modal visible={visible} title="回售" onOk={this.handleOk} onCancel={handleCancel}>
        {
          /* 
          
                  {handledColumns.map(v => (
          <FormItem {...formItemLayout} label={v.title} hasFeedback>
            {getFieldDecorator("date", {
              initialValue: record[v.dataIndex],
            })(
              v.dataIndex == "coupon_rate" ? (
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              ) : (
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              )
            )}
          </FormItem>
        ))}
          */
        }
        <FormItem {...formItemLayout} label="回售日期" hasFeedback>
          {getFieldDecorator("date", {
            initialValue: moment(),
            rules: [
                { required: true, message: '回售日期' },
            ],
          })(<DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="回售确认日价格(元)" hasFeedback>
          {getFieldDecorator("jiage", {
            // rules: [{ required: true, message: "回售确认日价格(元)" }],
          })(
            <InputNumber
              // formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              formatter={val => (val === undefined || val === null ? val : formatNum(String(val)))}
              style={{ width: "100%" }}
              precision={4}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="回售份额(元)" hasFeedback>
          {getFieldDecorator("fene", {
            // rules: [{ required: true, message: "回售份额(元)" }],
          })(
            <InputNumber
              formatter={val => (val === undefined || val === null ? val : formatNum(String(val)))}
              style={{ width: "100%" }}
              precision={4}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="回售份额价值(元)" hasFeedback>
          {getFieldDecorator("jiazhi", {
            // rules: [{ required: true, message: "回售份额价值(元)" }],
          })(
            <InputNumber
              formatter={val => (val === undefined || val === null ? val : formatNum(String(val)))}
              style={{ width: "100%" }}
              precision={4}
            />
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="兑付金额(元)" hasFeedback>
          {getFieldDecorator("jiazhi", {
            // rules: [{ required: true, message: "兑付金额(元)" }],
          })(
            <InputNumber
              formatter={val => (val === undefined || val === null ? val : formatNum(String(val)))}
              disabled
              style={{ width: "100%" }}
              precision={4}
            />
          )}
        </FormItem>
      </Modal>
    );
  }
}
export default Form.create()(ResaleModal);
