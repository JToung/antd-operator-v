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
const statusMap = ['error', 'success'];
const status = ['未运行', '正在运行'];

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
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    servicer: [],
  };

  columns = [
    {
      title: '专才ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '专才名称',
      dataIndex: 'servicerName',
      key: 'servicerName',
    },
    {
      title: '专才加入时间',
      dataIndex: 'servicerRegistrationDate',
      key: 'servicerRegistrationDate',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '专才联系方式',
      dataIndex: 'servicerPhone',
      key: 'servicerPhone',
    },
    {
      title: '专才状态',
      dataIndex: 'servicerStatus',
      key: 'servicerStatus',
      render: val => (
        this.getServicerStatus(val)
      ),
    },
    {
      title: '操作',
      render: val => (
        <Fragment>
          {console.log('val', val)}
          <Divider type="vertical" />
          <Link to={`/servicer/center/view-servicer/${val._id}`}>查看</Link>
          <Divider type="vertical" />
        </Fragment>
      ),
    },
  ];

  initialValue(val) {
    if (val.state == '2') {
      return <Link to={`/workorder/v/assign-workorder/${val._id}`}>审核</Link>;
    } else {
      return <Link disabled>已审核</Link>;
    }
  }

  getServicerStatus(val){
    if (val) {
      return <Badge status={statusMap[1]} text={status[1]} />;
    } else {
      return <Badge status={statusMap[0]} text={status[0]} />;
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
      type: 'servicer/queryServicer',
      payload:payload,
    }).then(res => {
      console.log(res)
      this.setState({ servicer: res.findResult });
    });
    console.log('servicer:', this.state.servicer);
  }

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
      type: 'servicer/queryServicer',
      payload:payload,
    }).then(res => {
      console.log(res)
      this.setState({ servicer: res.findResult });
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
        type: 'servicer/queryServicer',
        payload:payload,
      }).then(res => {
        console.log(res)
        this.setState({ servicer: res.findResult });
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
            <FormItem label="专才名">
              {getFieldDecorator('servicerName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="专才状态">
              {getFieldDecorator('servicerStatus')(
                <Select placeholder="请选择">
                  <Option value="false">未运行</Option>
                  <Option value="true">正在运行</Option>
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
    console.log("item",item)
    if (item != []) {
      this.setState();
      return item;
    } else {
      return item;
    }
  }

  render() {
    const { loading } = this.props;
    const { servicer } = this.state;
    console.log('servicer', servicer);
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
              dataSource={servicer}
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
