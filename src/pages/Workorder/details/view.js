import React, { PureComponent } from 'react';
import { Table, Tag, Descriptions, Badge, Card, Modal, Button, Divider, Row, Col } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import memoryUtils from '@/utils/memoryUtils';
import moment from 'moment';
import Link from 'umi/link';

const statusMap = ['red', 'green', 'yellow', 'cyan', 'geekblue', 'lime'];
const status = ['结束', '进行中', '待分配', '用户终止', '等待启动', '已派单未进行'];
const statusLogMap = ['yellow', 'green', 'lime', 'red'];
const statusLog = ['任务未开始', '任务进行中', '任务完成', '任务终止'];
@connect(({ item, loading }) => ({
  item,
  loading: loading.effects['workorder'],
  //model
}))
class ViewItem extends PureComponent {
  constructor(props) {
    super(props);

    this.logColumns = [
      {
        title: '任务日志ID',
        dataIndex: '_id',
        key: '_id',
      },
      {
        title: '任务日志名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '任务开始时间',
        dataIndex: 'start',
        key: 'start',
      },
      {
        title: '任务完成时间',
        dataIndex: 'end',
        key: 'end',
      },
      {
        title: '任务状态',
        dataIndex: 'state',
        key: 'state',
        render(val) {
          return <Badge status={statusLogMap[val]} text={statusLog[val]} />;
        },
      },
      {
        title: '操作',
        render: (text, record) =>
          this.state.log.length >= 1 ? (
            <div>
              {console.log('record', record.name)}
              <Link onClick={() => this.showLogViewModal(record._id)}>查看</Link>
              <Modal
                title="查看任务详情"
                visible={this.state.logViewVisible}
                onOk={this.handleLogViewOk}
                onCancel={this.handleLogCancel}
                width={720}
              >
                <Descriptions bordered layout="vertical">
                  <Descriptions.Item label="任务日志id" span={2}>
                    {record._id}
                  </Descriptions.Item>
                  <Descriptions.Item label="任务日志名">{record.name}</Descriptions.Item>
                  <Descriptions.Item label="任务状态" span={3}>
                    <Badge status={statusLogMap[record.state]} text={statusLog[record.state]} />
                  </Descriptions.Item>
                  <Descriptions.Item label="任务起始时间" span={3}>
                    {record.start}
                  </Descriptions.Item>
                  <Descriptions.Item label="任务结束时间" span={3}>
                    {record.end}
                  </Descriptions.Item>
                  <Descriptions.Item label="日志简介简介" span={3}>
                    {record.content}
                  </Descriptions.Item>
                  <Descriptions.Item label="专才反馈" span={3}>
                    {record.Servicerfeedback}
                  </Descriptions.Item>
                  <Descriptions.Item label="图片反馈" span={3}>
                    {record.serverFeedbackImg}待修改成图片
                  </Descriptions.Item>
                  <Descriptions.Item label="客户反馈" span={3}>
                    {record.Customerfeedback}
                  </Descriptions.Item>
                </Descriptions>
              </Modal>
              <Divider type="vertical" />
            </div>
          ) : null,
      },
    ];

    this.state = {
      //存储工单信息
      Workorder: {},
      //存储单品中断处理表状态
      interruptData: [],
      //分区名
      partitionsName: '',
      partitionViewVisible: false,
      View: {},
      keyView: '',
      Task: [],
      //品类名
      categoryName: '',
      //任务表汇总
      log: [],
      logTask: [],
      logViewVisible: false,
      //所属品类名
      categoryName: '',
    };
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
    console.log('params_id', this.props.match.params._id);

    const { dispatch } = this.props;
    const params = {
      operatorID: localStorage.getItem('userId'),
      _id: this.props.match.params._id,
    };
    dispatch({
      type: 'workorder/queryWorkorder',
      payload: params,
    }).then(res => {
      this.setState({ Workorder: res.findResult[0] });
      const params1 = {
        id: res.findResult[0].itemPartition,
      };
      console.log(params1);
      dispatch({
        type: 'workorder/queryPartition',
        payload: params1,
      }).then(res => {
        this.setState({ partitionsName: res.findResult.name });
      });
      const params2 = {
        workorderId: res.findResult[0]._id,
      };
      dispatch({
        type: 'workorder/queryLog',
        payload: params2,
      }).then(res => {
        this.setState({ log: res.workorderLogs });
        console.log('res.workorderLogs', res.workorderLogs);
      });
    });
  }

  onState(state) {
    return <Badge color={statusMap[state]} text={status[state]} />;
  }

  //查看任务分区
  handleLogViewOk = e => {
    console.log(e);
    this.setState({
      logViewVisible: false,
    });
  };

  showLogViewModal = keyView => {
    this.setState({ keyView: keyView });
    console.log('keyEditor', keyView);
    const { dispatch } = this.props;

    const params = {
      _id: keyView,
    };
    dispatch({
      type: 'workorder/queryLog',
      payload: params,
    }).then(res => {
      this.setState({ logTask: res.workorderLogs });
      console.log('logTask', res.workorderLogs);
    });

    this.setState({
      logViewVisible: true,
    });
  };

  handleLogViewCancel = e => {
    console.log(e);
    this.setState({
      logViewVisible: false,
    });
  };

  getState = state => {
    if (state == '2') {
      return (
        <div>
          <Row gutter={16}>
            <Col lg={12} md={12} sm={24}>
              <Button
                type="primary"
                onClick={() => {
                  this.props.history.push('/workorder/v/list');
                }}
                className={styles.ButtonRight}
              >
                返回
              </Button>
            </Col>
            <Col xl={{ span: 6 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
              <Button
                type="danger"
                onClick={() => {
                  this.props.history.push(
                    `/workorder/v/assign-workorder/${this.props.match.params._id}`
                  );
                }}
                className={styles.ButtonLeft}
              >
                派单
              </Button>
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <Button
          type="primary"
          onClick={() => {
            this.props.history.push('/workorder/v/list');
          }}
          className={styles.ButtonCenter}
        >
          返回
        </Button>
      );
    }
  };

  re = () => {
    const { workorder = {}, loading } = this.props;
    const { partitions, Workorder, interruptData, partitionsName, log } = this.state;
    console.log('log', log);
    return (
      // 加头部
      <PageHeaderWrapper title={<FormattedMessage id="app.workorder.basic.title" />}>
        <Card bordered={false}>
          <Descriptions title="工单信息" bordered loading={loading} layout="vertical">
            <Descriptions.Item label="工单ID">{Workorder._id}</Descriptions.Item>
            <Descriptions.Item label="工单名">{Workorder.name}</Descriptions.Item>
            <Descriptions.Item label="订单id">{Workorder.orderID}</Descriptions.Item>
            <Descriptions.Item label="工单起始时间" span={3}>
              {moment(Workorder.startTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="工单状态">{this.onState(Workorder.state)}</Descriptions.Item>
            <Descriptions.Item label="所属分区名" span={2}>
              {this.state.partitionsName}
            </Descriptions.Item>
            <Descriptions.Item label="专才id" span={3}>
              {Workorder.servicer}
            </Descriptions.Item>
            <Descriptions.Item label="服务启动时间" span={3}>
              {moment(Workorder.serverTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="客户要求" span={3}>
              {Workorder.requirement}
            </Descriptions.Item>
            <Descriptions.Item label="客户电话" span={3}>
              {Workorder.customerPhone}
            </Descriptions.Item>
            <Descriptions.Item label="工单任务日志" span={3}>
              <Table bordered dataSource={log} columns={this.logColumns} />
            </Descriptions.Item>
          </Descriptions>
          <div>
            <Card bordered={false}>{this.getState(Workorder.state)}</Card>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  };

  render() {
    const { workorder = {}, loading } = this.props;
    const { partitions, Workorder, interruptData } = this.state;

    console.log('workorder', Workorder);
    if (Workorder == null) {
      if (this.props.match.params._id == null) {
        this.props.history.push('/workorder/v/list');
      } else {
        return <div>{this.re()}</div>;
      }
    } else if (Workorder != null) {
      return <div>{this.re()}</div>;
    }
  }
}

export default ViewItem;
