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
const status = ['未上架', '已上架'];

/*
  提交单品审核model
*/
const ExamineForm = Form.create()(props => {
  const { examineViewVisible, form, handleExamineViewOk, handleExamineViewCancel } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      handleExamineViewOk(fieldsValue);
      console.log('fieldsValue', fieldsValue);
    });
  };

  return (
    <Modal
      title="填写上/下架理由"
      visible={examineViewVisible}
      onOk={okHandle}
      onCancel={handleExamineViewCancel}
      width={720}
    >
      <Form layout="vertical">
        <Card bordered={false}>
          <Row gutter={16}>
            <Col lg={24} md={12} sm={24}>
              <Form.Item label="上/下架理由">
                {getFieldDecorator('itemReason', {
                  rules: [
                    {
                      required: true,
                      message: '请输入上/下架理由',
                    },
                  ],
                })(
                  <Input.TextArea
                    style={{ minHeight: 32 }}
                    placeholder="请输入上/下架理由"
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
@connect(({ item, loading }) => ({
  item,
  loading: loading.effects['item'],
  //model
}))
@Form.create()
class TableListItem extends PureComponent {
  state = {
    modalVisible: false,
    updateModalVisible: false,
    examineViewVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    Item: [],
    valT: {},
  };

  columns = [
    {
      title: '单品ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '单品名称',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: '单品简介',
      dataIndex: 'itemIntroduction',
      key: 'itemIntroduction',
      width: 200,
    },
    {
      title: '单品状态',
      dataIndex: 'itemState',
      key: 'itemState',
      width: 120,
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '单品产生时间',
      dataIndex: 'itemAddTime',
      key: 'itemAddTime',
      render: val => (
        <span>
          {moment(val)
            .subtract(8, 'hours')
            .format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '操作',
      width: 200,
      render: val => (
        <Fragment>
          {console.log('val', val)}
          <Link to={`/item/v/editor-item/${val._id}`}>编辑</Link>
          <Divider type="vertical" />
          <Link to={`/item/v/view-item/${val._id}`}>查看</Link>
          <Divider type="vertical" />
          <Link to={`/item/v/delete-item/${val._id}`}>删除</Link>
          <Divider type="vertical" />
          {this.initialValue(val)}
          <ExamineForm
            examineViewVisible={this.state.examineViewVisible}
            handleExamineViewOk={this.handleExamineViewOk}
            handleExamineViewCancel={this.handleExamineViewCancel}
          />
        </Fragment>
      ),
    },
  ];

  initialValue(val) {
    if (val.itemState == '0') {
      return <a onClick={() => this.showExamineViewModal(val)}>上架</a>;
    } else {
      return <a onClick={() => this.showExamineViewModal(val)}>下架</a>;
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
    const params = {
      operatorID: localStorage.getItem('userId'),
    };
    dispatch({
      type: 'item/fetchItem',
      payload: params,
    }).then(res => {
      this.setState({ Item: res.findResult });
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const params = {
      operatorID: localStorage.getItem('userId'),
    };
    dispatch({
      type: 'item/fetchItem',
      payload: params,
    }).then(res => {
      this.setState({ Item: res.findResult });
    });
  };

  //提交审核
  handleExamineViewOk = (values, e) => {
    const { dispatch } = this.props;
    const { valT } = this.state;
    console.log('valT', valT);
    console.log(e);
    const data = {
      ...values,
      ...valT,
      operatorId: localStorage.getItem('userId'),
    };
    console.log('data', data);

    dispatch({
      type: 'item/changeItemState',
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

      // dispatch({
      //   type: 'rule/fetch',
      //   payload: values,
      // });
      const payload = {
        ...values,
        operatorID: localStorage.getItem('userId'),
      };
      console.log('payload', payload);
      dispatch({
        type: 'item/fetchItem',
        payload: payload,
      }).then(res => {
        this.setState({ Item: res.findResult });
      });
    });
  };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      item = {},
      loading,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="单品包名">
              {getFieldDecorator('itemName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="上架状态">
              {getFieldDecorator('itemState')(
                <Select placeholder="请选择">
                  <Option value="0">未上架</Option>
                  <Option value="1">已上架</Option>
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
    if (item.data != null) {
      this.setState();
      return item.data.findResult;
    } else {
      return item;
    }
  }

  render() {
    const { item = {}, loading } = this.props;
    const { Item } = this.state;
    console.log('Item', Item);
    console.log('loading', loading);
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <div>
        <Card bordered={false} loading={loading}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Link to="/item/v/new-item">
                <Button icon="plus" type="primary">
                  {console.log(this.props.history)}
                  新建
                </Button>
              </Link>
            </div>
            <Table
              selectedRows={selectedRows}
              rowKey="_id"
              loading={loading}
              dataSource={this.queryDate(Item)}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
            />
            {console.log('categoryList', item.data.res)}
          </div>
        </Card>
      </div>
    );
  }
}

export default TableListItem;
