import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import Link from 'umi/link';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Descriptions,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Table,
} from 'antd';
// import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import memoryUtils from '@/utils/memoryUtils';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['warning', 'success', 'error'];
const status = ['未审核', '审核通过', '审核未通过'];

/*
  返回审核model
*/
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
      visible={examineViewVisible}
      onOk={okHandle}
      onCancel={handleExamineViewCancel}
      width={720}
    >
      <Form layout="vertical">
        <Card bordered={false}>
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24}>
              <Form.Item label="审核结果">
                {getFieldDecorator('state', {
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
                {getFieldDecorator('reason', {
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

/* eslint react/no-multi-comp:0 */
@connect(({ servicer, loading }) => ({
  servicer,
  loading: loading.effects['servicer'],
  //model
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    examineViewVisible: false,
    viewVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    servicer: [],
    servicerE: [],
    Contract: {},
    valT: {},
  };

  columns = [
    {
      title: '申请表ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '专才id',
      dataIndex: 'servicerId',
      key: 'servicerId',
    },
    {
      title: '审核申请时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '审核状态',
      dataIndex: 'state',
      key: 'state',
      render: val => <Badge status={statusMap[val]} text={status[val]} />,
    },
    {
      title: '操作',
      width: 250,
      render: val => (
        <Fragment>
          {console.log('val', val)}
          <Divider type="vertical" />
          <Link onClick={() => this.showViewModal(val)}>查看</Link>
          {this.getView()}
          <Divider type="vertical" />
          {this.initialValue(val)}
          <ExamineForm
            examineViewVisible={this.state.examineViewVisible}
            handleExamineViewOk={this.handleExamineViewOk}
            handleExamineViewCancel={this.handleExamineViewCancel}
          />
          <Divider type="vertical" />
        </Fragment>
      ),
    },
  ];

  initialValue(val) {
    if (val.state == '0') {
      return <a onClick={() => this.showExamineViewModal(val)}>审核</a>;
    } else {
      return <Link disabled>已审核</Link>;
    }
  }

  componentDidMount() {
    if (JSON.parse(localStorage.getItem('user')) === null) {
      message.error('未登录！！请登录！');
      this.props.history.push('/');
    }
    if (JSON.parse(localStorage.getItem('user')) != null) {
      if (JSON.parse(localStorage.getItem('user')) === 'guest') {
        message.error('未登录！！请登录！');
        this.props.history.push('/');
        console.log(JSON.parse(localStorage.getItem('user')));
      }
      if (JSON.parse(localStorage.getItem('user')).status === 'false') {
        message.error('未登录！！请登录！');
        this.props.history.push('/');
        console.log(JSON.parse(localStorage.getItem('user')));
      }
    }
    const { dispatch } = this.props;
    const payload = {
      operatorId: localStorage.getItem('userId'),
    };
    dispatch({
      type: 'servicer/queryApply',
      payload: payload,
    }).then(res => {
      console.log('res：', res);
      if (res.status == '1') {
        this.setState({ servicerE: res.findResult });
      }
    });
    console.log('servicerE:', this.state.servicerE);
  }

  /*
  查看审核内容
  */
  getView = () => {
    const { Contract } = this.state;
    if (Contract._id != null) {
      return (
        <Modal
          title="查看审核内容"
          visible={this.state.viewVisible}
          onOk={this.handleViewOk}
          onCancel={this.handleViewCancel}
          width={720}
        >
          <Descriptions bordered layout="vertical">
            <Descriptions.Item label="专才ID">{Contract.servicerId}</Descriptions.Item>
            <Descriptions.Item label="项目名称">{Contract.itemName}</Descriptions.Item>
            <Descriptions.Item label="审核状态">
              <Badge status={statusMap[Contract.state]} text={status[Contract.state]} />
            </Descriptions.Item>
            <Descriptions.Item label="提交申请时间">
              <span>{moment(Contract.timestamp).format('YYYY-MM-DD HH:mm:ss')}</span>
            </Descriptions.Item>
            <Descriptions.Item label="技能证书" span={2}>
              <img
                alt="example"
                style={{ width: 70, height: 70 }}
                src={'http://47.103.1.149:7001' + Contract.certificates[0].certificate}
              />
            </Descriptions.Item>
            <Descriptions.Item label="能力描述" span={3}>
              {Contract.skillDescribe}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      );
    } else {
      return (
        <Modal
          title="查看审核内容"
          visible={this.state.viewVisible}
          onOk={this.handleViewOk}
          onCancel={this.handleViewCancel}
          width={720}
        >
          查询错误
        </Modal>
      );
    }
  };

  
  //查看审核
  handleViewOk = e => {
    console.log(e);
    this.setState({
      viewVisible: false,
    });
  };

  showViewModal = (val, e) => {
    console.log(e);
    this.setState({
      Contract: val,
      viewVisible: true,
    });
  };

  handleViewCancel = e => {
    console.log(e);
    this.setState({
      viewVisible: false,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const payload = {
      operatorId: localStorage.getItem('userId'),
    };
    dispatch({
      type: 'servicer/queryApply',
      payload: payload,
    }).then(res => {
      console.log(res);
      if (res.status == '1') {
        this.setState({ servicerE: res.findResult });
      }else{
        this.setState({ servicerE: [] });
      }
    });
  };

  //提交审核
  handleExamineViewOk = (values, e) => {
    const { dispatch } = this.props;
    const { valT } = this.state;
    console.log(e);
    const data = {
      ...values,
      operatorId: localStorage.getItem('userId'),
      servicerId: valT.servicerId,
      _id: valT._id,
      itemId: valT.itemId,
      itemName: valT.itemName,
    };
    console.log('data', data);

    dispatch({
      type: 'servicer/verifyServicer',
      payload: data,
    }).then(res => {
      if (res.status == '1') {
        message.success(res.information);
        //刷新页面
        location.reload(true);
      } else {
        message.error(res.information);
      }
    });
    this.setState({
      examineViewVisible: false,
    });
  };

  showExamineViewModal = (val, e) => {
    console.log(e);
    this.setState({
      valT: val,
      examineViewVisible: true,
    });
  };

  handleExamineViewCancel = e => {
    console.log(e);
    this.setState({
      examineViewVisible: false,
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      console.log('fieldsValue', values);

      this.setState({
        formValues: values,
      });

      console.log('payload', payload);
      const payload = {
        ...values,
        operatorId: localStorage.getItem('userId'),
      };
      dispatch({
        type: 'servicer/queryApply',
        payload: payload,
      }).then(res => {
        console.log(res);
        if (res.status == '1') {
          this.setState({ servicerE: res.findResult });
        }else{
          this.setState({ servicerE: [] });
        }
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      loading,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="申请项目名">
              {getFieldDecorator('itemName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="专才状态">
              {getFieldDecorator('state')(
                <Select placeholder="请选择">
                  <Option value="0">未审核</Option>
                  <Option value="1">审核通过</Option>
                  <Option value="2">审核不通过</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  queryDate(item) {
    console.log('item', item);
    if (item != []) {
      this.setState();
      return item;
    } else {
      return item;
    }
  }

  render() {
    const { loading } = this.props;
    const { servicerE } = this.state;
    console.log('servicerE', servicerE);
    console.log('loading', loading);
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <div>
        <Card bordered={false} loading={loading}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <Table
              selectedRows={selectedRows}
              rowKey="_id"
              loading={loading}
              dataSource={servicerE}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
            />
          </div>
        </Card>
      </div>
    );
  }
}

export default TableList;
