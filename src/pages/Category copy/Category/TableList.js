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
  Table
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

/* eslint react/no-multi-comp:0 */
@connect(({ category, loading }) => ({
  category,
  loading: loading.effects['category/fetchCategory'],
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
  };

  columns = [
    {
      title: '品类ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '品类名称',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '品类简介',
      dataIndex: 'categoryIntrod',
      key: 'categoryIntrod',
    },
    {
      title: '上架状态',
      dataIndex: 'categoryState',
      key: 'categoryState',
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },
    {
      title: '品类产生时间',
      dataIndex: 'categoryAddTime',
      key: 'categoryAddTime',
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
      render: val => (
        <Fragment>
          {console.log('val',val)}
          <Link to={`/category/v/editor-categroy/${val._id}`}>编辑</Link>
          <Divider type="vertical" />
          <Link to={`/category/v/view-categroy/${val._id}`}>查看</Link>
          <Divider type="vertical" />
          <Link to={`/category/v/delete-categroy/${val._id}`}>删除</Link>
          <Divider type="vertical" />
          {this.initialValue(val)}
        </Fragment>
      ),
    },
  ];

  initialValue(val){
    if(val.categoryState =="0"){
      return <Link to={`/category/v/uporoff-categroy/${val._id}`}>上架</Link>
    }else if(val.categoryState =="1"){
      return <Link to={`/category/v/uporoff-categroy/${val._id}`}>下架</Link>
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
      categoryOperator: localStorage.getItem('userId'),
    };
    dispatch({
      type: 'category/fetchCategory',
      payload: params,
    });
  }


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const params = {
      categoryOperator: localStorage.getItem('userId'),
    };
    dispatch({
      type: 'category/fetchCategory',
      payload: params,
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
        categoryOperator: localStorage.getItem('userId'),
      };
      dispatch({
        type: 'category/fetchCategory',
        payload: payload,
      });
    });
  };



  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
      category = {},
      loading,
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="品类包名">
              {getFieldDecorator('categoryName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="上架状态">
              {getFieldDecorator('categoryState')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
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

  queryDate(category) {
    if (category.data != null) {
      return category.data.res;
    } else {
      return category;
    }
  }

  getL(data){
    if(data != null){
      return data.length;
    }else{
      return 0;
    }
  }

  render() {
    const { category = {}, loading } = this.props;
    console.log('categoryListrender', category);
    console.log('loading', loading);
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;

    return (
      <div>
        <Card bordered={false} loading={loading}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <div className={styles.tableListOperator}>
              <Link to="/category/v/new-categroy">
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
              dataSource={this.queryDate(category)}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                total: this.getL(this.queryDate(category)), // 数据总数
                pageSize: 6, // 每页条数
                showTotal: total => {
                  return `共 ${total} 条`;
                },
              }}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
            />
            {console.log('categoryList', category.data.res)}
          </div>
        </Card>
      </div>
    );
  }
}

export default TableList;
