import React, { PureComponent } from 'react';
import { Table, Tag, Descriptions, Badge, Card, Modal, Button, Divider } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import memoryUtils from '@/utils/memoryUtils';
import moment from 'moment';
import Link from 'umi/link';
import { OPERATOR_URL } from '@/utils/Constants';


@connect(({ item, loading }) => ({
  item,
  loading: loading.effects['item'],
  //model
}))
class ViewItem extends PureComponent {
  constructor(props) {
    super(props);
    this.interruptColumns = [
      {
        title: 'id',
        dataIndex: '_id',
        key: '_id',
      },
      {
        title: '中断最小节点',
        dataIndex: 'stage_from',
        key: 'stage_from',
      },
      {
        title: '中断最大节点',
        dataIndex: 'stage_end',
        key: 'stage_end',
      },
      {
        title: '收取的比例',
        dataIndex: 'receivable',
        key: 'receivable',
      },
    ];

    this.partitionColumns = [
      {
        title: '单品分区名称',
        dataIndex: 'name',
        key: 'name',
        align:'center',
      },
      {
        title: '单品分区价格',
        dataIndex: 'price',
        key: 'price',
        align:'center',
      },
      {
        title: '单品应用场景',
        dataIndex: 'applicable',
        key: 'applicable',
        align:'center',
      },
      {
        title: '操作',
        align:'center',
        render: (text, record) =>
          this.state.partitions.length >= 1 ? (
            <div>
              {console.log('view', this.state.View)}
              {console.log('record', record)}
              <Link onClick={() => this.showPartitionViewModal(record)}>查看</Link>
              {this.reM()}
              <Divider type="vertical" />
            </div>
          ) : null,
      },
    ];

    this.taskInstance = [
      {
        title: '顺序',
        dataIndex: 'order',
      },
      {
        title: '任务名',
        dataIndex: 'name',
      },
      {
        title: '任务内容',
        dataIndex: 'introduction',
      },
      {
        title: '执行条件',
        dataIndex: 'conditions',
      },
      {
        title: '最长执行任务时间',
        dataIndex: 'maxCompletionTime',
      },
      {
        title: '任务通过条件',
        dataIndex: 'passageConditions',
      },
    ];

    this.state = {
      //存储单品
      Item: {},
      //存储单品中断处理表状态
      interruptData: [],
      //存储分区汇总
      partitions: [],
      partitionViewVisible: false,
      //存储单个分区
      partitionsDG: {},
      View: {},
      keyView: '',
      Task: [],
      //品类名
      categoryName: '',
      //单个单品分区任务表汇总
      task: [],
      //所属品类名
      categoryName: '',
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;

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

    const params = {
      id: this.props.match.params._id,
    };
    dispatch({
      type: 'item/fetchByItem',
      payload: params,
    }).then(res => {
      const Item = res[0];
      const interruptData = res[0].interrupt;
      const partitions = res[0].partition;
      const payload = {
        _id: Item.categoryID,
      };
      console.log('this.state.Item.categoryID', Item.categoryID);
      dispatch({
        type: 'category/fetchCategory',
        payload,
      }).then(res => {
        if (res.res.length != 0) {
          const categoryName = res.res[0].categoryName;
          this.setState({ categoryName: categoryName });
          console.log('categoryName', this.state.categoryName);
        } else {
          this.setState({ categoryName: '品类可能被删除' });
        }
      });
      console.log('res:', Item);
      console.log('res:', interruptData);
      console.log('res:', partitions);
      this.setState({ Item: Item, interruptData: interruptData, partitions: partitions });
    });
  }

  onItemState(state) {
    if (state == '1') {
      return <Badge status="success" text="已上架" />;
    } else {
      return <Badge status="error" text="未上架" />;
    }
  }

  //查看单品分区
  reM = () => {
    const { partitionsDG } = this.state;
    return (
      <Modal
        title="查看单品分区"
        visible={this.state.partitionViewVisible}
        onOk={this.handlePartitionViewOk}
        onCancel={this.handlePartitionViewCancel}
        width={720}
      >
        <Descriptions bordered layout="vertical">
          <Descriptions.Item label="单品分区名">{partitionsDG.name}</Descriptions.Item>
          <Descriptions.Item label="价格">{partitionsDG.price}</Descriptions.Item>
          <Descriptions.Item label="单品应用场景">{partitionsDG.applicable}</Descriptions.Item>
          <Descriptions.Item label="风格">{partitionsDG.style}</Descriptions.Item>
          <Descriptions.Item label="行业">{partitionsDG.industry}</Descriptions.Item>
          <Descriptions.Item label="类型">{partitionsDG.type}</Descriptions.Item>
          <Descriptions.Item label="单品分区简介" span={3}>
            {partitionsDG.introduction}
          </Descriptions.Item>
          <Descriptions.Item label="细节" span={3}>
            {partitionsDG.detail}
          </Descriptions.Item>
          <Descriptions.Item label="单品任务" span={3}>
            <Table bordered dataSource={this.state.Task} columns={this.taskInstance} />
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    );
  };

  handlePartitionViewOk = e => {
    console.log(e);
    this.setState({
      partitionViewVisible: false,
    });
  };

  showPartitionViewModal = View => {
    this.setState({ keyView: View._id });
    console.log('keyEditor', View);
    const { dispatch } = this.props;

    const params = {
      id: View._id,
    };
    dispatch({
      type: 'item/fetchTask',
      payload: params,
    }).then(res => {
      const Task = res.findResult;
      this.setState({ Task: Task });
    });

    this.setState({
      partitionsDG: View,
      partitionViewVisible: true,
    });
  };

  handlePartitionViewCancel = e => {
    console.log(e);
    this.setState({
      partitionViewVisible: false,
    });
  };

  re = () => {
    const { item = {}, loading } = this.props;
    const { partitions, Item, interruptData } = this.state;
    return (
      // 加头部
      <PageHeaderWrapper title={<FormattedMessage id="app.categoty.basic.title" />}>
        <Card bordered={false}>
          <Descriptions title="服务单品包信息" bordered loading={loading} layout="vertical">
            <Descriptions.Item label="单品包ID">{Item._id}</Descriptions.Item>
            <Descriptions.Item label="单品包名">{Item.itemName}</Descriptions.Item>
            <Descriptions.Item label="单品包添加时间">
              {moment(Item.itemAddTime)
                .subtract(8, 'hours')
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="单品包状态">
              {this.onItemState(Item.itemState)}
            </Descriptions.Item>
            <Descriptions.Item label="所属品类名" span={2}>
              {this.state.categoryName}
            </Descriptions.Item>

            <Descriptions.Item label="单品包介绍" span={3}>
              {Item.itemIntroduction}
            </Descriptions.Item>
            <Descriptions.Item label="单品包图片" span={3}>
              <span>
                {Item.imgList &&
                  Item.imgList.map(img => (
                    <img style={{ width: 150, height: 150 }} key={img} src={OPERATOR_URL + img} alt="img" />
                  ))}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="单品分区" span={3}>
              <Table bordered dataSource={partitions} columns={this.partitionColumns} />
            </Descriptions.Item>
            <Descriptions.Item label="单品中断处理" span={3}>
              <Table bordered dataSource={interruptData} columns={this.interruptColumns} />
            </Descriptions.Item>
          </Descriptions>
          <div>
            <Card bordered={false}>
              <Button
                type="primary"
                onClick={() => {
                  this.props.history.push('/item/v/list');
                }}
                className={styles.ButtonCenter}
              >
                返回
              </Button>
            </Card>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  };

  render() {
    const { item = {}, loading } = this.props;
    const { partitions, Item, interruptData } = this.state;

    console.log('Item', Item);
    if (Item[0] == null) {
      if (this.props.match.params._id == null) {
        this.props.history.push('/item/v/list');
      } else {
        return <div>{this.re()}</div>;
      }
    } else if (Item[0] != null) {
      return <div>{this.re()}</div>;
    } else {
      return <div />;
    }
  }
}

export default ViewItem;
