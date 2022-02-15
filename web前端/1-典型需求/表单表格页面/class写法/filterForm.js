import React from 'react';
import { Row, Col, Form, Input, DatePicker, Button, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

class filterForm extends React.Component {
  handleSubmit = () => {
    const { handleSubmit, form } = this.props;
    const values = form.getFieldsValue();
    if (handleSubmit && typeof handleSubmit === 'function') {
      handleSubmit.call(this, values);
    }
  }
  handleReset = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      pxsj: [null, null],
      zlmc: null,
      zlfl: null,
      yyb: null,
    });
  }
  render() {
    const { zlflOptions = [], yybOptions = [] } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className="m-form-default" >
        <Row>
          <Col xs={24} sm={12} xl={9} >
            <FormItem label="培训时间" className="m-form-item" >
              {
                getFieldDecorator('pxsj')(<RangePicker />)
              }
            </FormItem>
          </Col>
          <Col xs={24} sm={12} xl={9}>
            <FormItem label="资料名称" className="m-form-item" >
              {getFieldDecorator('zlmc', {})(<Input autoComplete="off" />)}
            </FormItem>
          </Col>
          <Col xs={24} sm={12} xl={9}>
            <FormItem label="资料分类" className="m-form-item">
              {getFieldDecorator('zlfl', {

              })(// eslint-disable-line
                <Select labelName="" placeholder="请选择资料分类" allowClear showSearch optionFilterProp="children" >
                  {zlflOptions.map(item => <Option value={item.ibm} key={item.ibm}>{item.mc}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
          <Col xs={24} sm={12} xl={9}>
            <FormItem label="营业部" className="m-form-item">
              {getFieldDecorator('yyb', {

              })(// eslint-disable-line
                <Select labelName="" placeholder="请选择营业部" allowClear showSearch optionFilterProp="children" >
                  {yybOptions.map(item => <Option value={item.ibm} key={item.ibm}>{item.mc}</Option>)}
                </Select>)}
            </FormItem>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Button className="m-btn-radius m-btn-pink ant-btn" onClick={this.handleSubmit}> 查询 </Button>
            <Button className="m-btn-radius m-btn-blue ant-btn" onClick={this.handleReset} > 重置 </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(filterForm);
