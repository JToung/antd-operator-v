import React, { PureComponent } from 'react';
import {
  Upload,
  Select,
  Row,
  Col,
  Form,
  Input,
  Table,
  Tag,
  Descriptions,
  Badge,
  Card,
  Button,
  Tooltip,
  Modal,
  message,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { TweenOneGroup } from 'rc-tween-one';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import LinkButton from '@/components/link-button';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import memoryUtils from '@/utils/memoryUtils';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';

const { Column, ColumnGroup } = Table;

@connect(({ category, loading }) => ({
  category,
  loading: loading.effects['category/fetchCategory'],
  //model
}))
@Form.create()
class Editor extends PureComponent {

  state = {
    category1:{}
  }
  componentDidMount() {
    const { dispatch, match, category } = this.props;
    const { params } = match;

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

    console.log('params_id', this.props.match.params._id);

    const params1 = {
      _id: this.props.match.params._id,
    };

    dispatch({
      type: 'category/fetchCategory',
      payload: params1,
    }).then(res => {
      this.setState({category1:res.res[0]})
    });
  }

  handleSubmit = e => {
    const { dispatch, match } = this.props;
    const { params } = match;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      const {category1} = this.state;
      console.log('category1',category1)
      const payload = {
        ...values,
        categoryAddTime: category1.categoryAddTime,
        categoryExamineTF: category1.categoryExamineTF,
        categoryOperator: category1.categoryOperator,
        categoryReviseTime: new Date().getTime(),
        _id: this.props.match.params._id,
        id: this.props.match.params._id,
      };

      console.log('values', values);
      if (err) {
        console.log('err' + err);
        return;
      }
      // if (!err) {
      //   console.log('receive the value of input ' + values);
      // }
      console.log('参数', payload);

      dispatch({
        type: 'category/editorCategory',
        payload,
      }).then(res => {
        console.log('res', res);
        if (res.status != '0') {
          message.success(res.information);
          this.props.history.push('/category/list');
        } else {
          message.error(res.information);
        }
      });
    });
  };

  onOperatorState(operatorState) {
    if (operatorState == '1') {
      return <Badge status="success" text="已上架" />;
    } else {
      return <Badge status="error" text="未上架" />;
    }
  }

  initialValue(category) {
    console.log('category.data.res', category.data.res);
    if (category.data.res == null) {
      this.props.history.push('/category/list');
    } else if (category.data.res != null) {
      const {
        form: { getFieldDecorator },
      } = this.props;
      return (
        <div>
          <Card bordered={false}>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="品类包名">
                  {getFieldDecorator('categoryName', {
                    initialValue: category.data.res[0].categoryName,
                    rules: [{ required: true, message: '请输入品类包名' }],
                  })(<Input placeholder="请输入品类包名" />)}
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24}>
                <Form.Item label="品类包状态">
                  {this.onOperatorState(category.data.res[0].categoryState)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={24} md={12} sm={24}>
                <Form.Item label="品类包介绍">
                  {getFieldDecorator('categoryIntrod', {
                    initialValue: category.data.res[0].categoryIntrod,
                    rules: [
                      {
                        required: true,
                        message: '请输入品类包介绍',
                      },
                    ],
                  })(
                    <Input.TextArea
                      style={{ minHeight: 32 }}
                      placeholder="请输入品类包介绍"
                      rows={4}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card bordered={false} title="品类规范（用于品类下级单品规范）">
            <Row gutter={16}>
              <Col lg={24} md={12} sm={24}>
                <Form.Item label="规范必要说明">
                  {getFieldDecorator('categoryExplanation', {
                    initialValue: category.data.res[0].categoryExplanation,
                    rules: [
                      {
                        required: true,
                        message: '请输入规范必要说明',
                      },
                    ],
                  })(
                    <Input.TextArea
                      style={{ minHeight: 32 }}
                      placeholder="请输入规范必要说明"
                      rows={4}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="名称最小字数">
                  {getFieldDecorator('categoryMinName', {
                    initialValue: category.data.res[0].categoryMinName,
                    rules: [{ required: true, message: '请输入名称最小字数' }],
                  })(<Input placeholder="请输入名称最小字数" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="简介最小字数">
                  {getFieldDecorator('categoryMinIntroduction', {
                    initialValue: category.data.res[0].categoryMinIntroduction,
                    rules: [{ required: true, message: '请输入简介最小字数' }],
                  })(<Input placeholder="请输入简介最小字数" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="详情最小字数">
                  {getFieldDecorator('categoryMinContent', {
                    initialValue: category.data.res[0].categoryMinContent,
                    rules: [{ required: true, message: '请输入详情最小字数' }],
                  })(<Input placeholder="请输入详情最小字数" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="名称最大字数">
                  {getFieldDecorator('categoryMaxName', {
                    initialValue: category.data.res[0].categoryMaxName,
                    rules: [{ required: true, message: '请输入名称最大字数' }],
                  })(<Input placeholder="请输入名称最大字数" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="简介最大字数">
                  {getFieldDecorator('categoryMaxIntroduction', {
                    initialValue: category.data.res[0].categoryMaxIntroduction,
                    rules: [{ required: true, message: '请输入简介最大字数' }],
                  })(<Input placeholder="请输入简介最大字数" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="详情最大字数">
                  {getFieldDecorator('categoryMaxContent', {
                    initialValue: category.data.res[0].categoryMaxContent,
                    rules: [{ required: true, message: '请输入详情最大字数' }],
                  })(<Input placeholder="请输入详情最大字数" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="最少分区数">
                  {getFieldDecorator('categoryMinPartition', {
                    initialValue: category.data.res[0].categoryMinPartition,
                    rules: [{ required: true, message: '请输入最少分区数' }],
                  })(<Input placeholder="请输入最少分区数" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="最少任务数">
                  {getFieldDecorator('categoryMinTasks', {
                    initialValue: category.data.res[0].categoryMinTasks,
                    rules: [{ required: true, message: '请输入最少任务数' }],
                  })(<Input placeholder="请输入最少任务数" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="最小评分（若未达标，给予惩罚）">
                  {getFieldDecorator('categoryMinScore', {
                    initialValue: category.data.res[0].categoryMinScore,
                    rules: [{ required: true, message: '请输入最小评分' }],
                  })(<Input placeholder="请输入最小评分" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <Form.Item label="最大分区数">
                  {getFieldDecorator('categoryMaxPartition', {
                    initialValue: category.data.res[0].categoryMaxPartition,
                    rules: [{ required: true, message: '请输入最大分区数' }],
                  })(<Input placeholder="请输入最大分区数" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="最大任务数">
                  {getFieldDecorator('categoryMaxTasks', {
                    initialValue: category.data.res[0].categoryMaxTasks,
                    rules: [{ required: true, message: '请输入最大任务数' }],
                  })(<Input placeholder="请输入最大任务数" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 6, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="任务最长时间">
                  {getFieldDecorator('categoryMaxTaskTime', {
                    initialValue: category.data.res[0].categoryMaxTaskTime,
                    rules: [{ required: true, message: '请输入任务最长时间' }],
                  })(<Input placeholder="请输入任务最长时间" />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={10} md={12} sm={24}>
                <Form.Item label="单个分区最低价格">
                  {getFieldDecorator('categoryMinPrice', {
                    initialValue: category.data.res[0].categoryMinPrice,
                    rules: [{ required: true, message: '请输入单个分区最低价格' }],
                  })(<Input placeholder="请输入单个分区最低价格" />)}
                </Form.Item>
              </Col>
              <Col xl={{ span: 10, offset: 2 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <Form.Item label="单个分区最高价格">
                  {getFieldDecorator('categoryMaxPrice', {
                    initialValue: category.data.res[0].categoryMaxPrice,
                    rules: [{ required: true, message: '请输入单个分区最高价格' }],
                  })(<Input placeholder="请输入单个分区最高价格" />)}
                </Form.Item>
              </Col>
            </Row>
            {this.tfSJcategory(category)}
          </Card>
        </div>
      );
    }
  }

  tfSJcategory(category) {
    if (category.data.res == null) {
      this.props.history.push('/category/list');
    } else if (category.data.res != null) {
      const {
        form: { getFieldDecorator },
      } = this.props;
      if (category.data.res[0].categoryState == '1') {
        return (
          <div>
            <Row gutter={16}>
              <Col lg={24} md={12} sm={24}>
                <Form.Item label="修改理由">
                  {getFieldDecorator('categoryReason', {
                    rules: [
                      {
                        required: true,
                        message: '请输入修改理由',
                      },
                    ],
                  })(
                    <Input.TextArea
                      style={{ minHeight: 32 }}
                      placeholder="请输入修改理由"
                      rows={4}
                    />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
      } else {
        return <div />;
      }
    }
  }

  render() {
    const {
      category = {},
      loading,
      form: { getFieldDecorator },
    } = this.props;

    console.log('categotyData', category);
    // console.log('operator.date',operator);

    return (
      // 加头部
      <PageHeaderWrapper title={<FormattedMessage id="app.categoty.basic.title" />}>
        <Card bordered={false} title="编辑品类包">
          <Form layout="vertical" onSubmit={this.handleSubmit}>
            {this.initialValue(category)}
            <Card bordered={false}>
              <Row gutter={16}>
                <Col lg={12} md={12} sm={24}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className={styles.ButtonRight}
                      loading={loading}
                    >
                      确认修改
                    </Button>
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className={styles.ButtonLeft}
                      onClick={() => {
                        this.props.history.push('/category/list');
                      }}
                      loading={loading}
                    >
                      返回列表
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Editor;
