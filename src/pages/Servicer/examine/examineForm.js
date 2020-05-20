import React, { Component } from 'react';
import { Form, Button, Input } from 'antd';
const FormItem = Form.Item;

class ExamineForm extends Component {
  render() {
    const ExamineForm = Form.create()(props => {
      const { examineViewVisible, form, handleExamineViewOk, handleExamineViewCancel } = props;
      const { getFieldDecorator } = form;
      const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          handleExamineViewOk(fieldsValue);
        });
      };

      return (
        <Modal
          title="填写审核内容"
          visible={this.state.examineViewVisible}
          onOk={this.handleExamineViewOk}
          onCancel={this.handleExamineViewCancel}
          width={720}
        >
          <Form layout="vertical">
            <Card bordered={false}>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="审核结果">
                    {this.props.form.getFieldDecorator('state', {
                      rules: [{ required: true, message: '请选择审核结果' }],
                    })(
                      <Select placeholder="请选择审核结果">
                        <Option value="1">审核通过</Option>
                        <Option value="2">审核不通过</Option>
                      </Select>
                    )}
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col lg={24} md={12} sm={24}>
                  <Form.Item label="审核理由">
                    {this.props.form.getFieldDecorator('reason', {
                      rules: [
                        {
                          required: true,
                          message: '请输入审核理由',
                        },
                      ],
                    })(
                      <Input.TextArea
                        style={{ minHeight: 32 }}
                        placeholder="请输入审核理由"
                        rows={4}
                      />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form>
        </Modal>
      );
    });
  }
}
export default ExamineForm