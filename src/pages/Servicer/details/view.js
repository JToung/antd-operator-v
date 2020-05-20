import React, { PureComponent } from 'react';
import {
  Descriptions,
  Select,
  Row,
  Col,
  Input,
  Badge,
  Card,
  Button,
  message,
  Modal,
  Upload,
  Form,
  Table,
} from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';
import { connect } from 'dva';
import DescriptionList from '@/components/DescriptionList';
import OPERATOR_USER from '@/utils/memoryUtils';
import { OPERATOR_URL } from '@/utils/Constants';
import moment from 'moment';
import Link from 'umi/link';

const statusMap = ['error', 'success'];
const status = ['未运行', '正在运行'];
@connect(({ servicer, loading }) => ({
  servicer,
  loading: loading.effects['servicer'],
  //model
}))
@Form.create()
class Center extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      contractViewVisible: false,
      newContractViewVisible: false,
      servicer: {},
      Item: [],
      Contract: {},
    };

    this.ItemColumns = [
      {
        title: '单品id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '单品名',
        dataIndex: 'itemName',
        key: 'itemName',
      },
      {
        title: '操作',
        render: record =>
          this.state.Item.length >= 1 ? (
            <Link to={`/item/v/view-item/${record.id}`}>查看单品详情</Link>
          ) : null,
      },
    ];
  }

  componentDidMount() {
    const { dispatch, match } = this.props;
    const { params } = match;
    // const { dispatch } = this.props;
    console.log('参数', localStorage.getItem('userId'));

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

    const params1 = {
      _id: this.props.match.params._id,
    };

    dispatch({
      type: 'servicer/queryServicer',
      payload: params1,
    }).then(res => {
      console.log(res);
      this.setState({ servicer: res.findResult[0] });
      if (res.findResult.length != 0) {
        res.findResult[0].servicerItem.map(id => {
          console.log('id', id);
          const params = {
            id: id,
          };
          dispatch({
            type: 'item/fetchByItem',
            payload: params,
          }).then(res => {
            console.log('ItemData', res);
            const ItemData = {
              id: res[0]._id,
              itemName: res[0].itemName,
            };
            console.log('ItemData', ItemData);
            const { Item } = this.state;
            this.setState({
              Item: [...Item, ItemData],
            });
          });
        });
      }
    });
    const params2 = {
      servicerID: this.props.match.params._id,
    };

    dispatch({
      type: 'servicer/queryContract',
      payload: params2,
    }).then(res => {
      console.log('queryContract', res);
      if (res.status == '1') {
        this.setState({ Contract: res.findResult[0] });
      } else {
        this.setState({ Contract: {} });
      }
    });
    console.log('servicer', this.state.servicer);
  }

  onServicerStatus(servicerStatus) {
    if (servicerStatus == 'true') {
      return <Badge status="success" text="运行中" />;
    } else {
      return <Badge status="error" text="已停止运行" />;
    }
  }

  onExamineState(examineState) {
    if (examineState == '1') {
      return <Badge status="success" text="已通过" />;
    } else if (examineState == '0') {
      return <Badge status="error" text="未通过" />;
    } else {
      return <Badge status="warning" text="审核中" />;
    }
  }
  /* 
  获取专才合约
  如果不存在，则是新建按钮
  */
  getContract = Contract => {
    if (Contract._id != null) {
      return (
        <div>
          <Link onClick={() => this.showContractViewModal()}>查看</Link>
          <Modal
            title="查看合约"
            visible={this.state.contractViewVisible}
            onOk={this.handleContractViewOk}
            onCancel={this.handleContractViewCancel}
            width={720}
          >
            <Descriptions bordered layout="vertical">
              <Descriptions.Item label="合约名称">{Contract.contractName}</Descriptions.Item>
              <Descriptions.Item label="合约等级">{Contract.grade}</Descriptions.Item>
              <Descriptions.Item label="合约状态">
                <Badge status={statusMap[Contract.state]} text={status[Contract.state]} />
              </Descriptions.Item>
              <Descriptions.Item label="专才ID">{Contract.servicerID}</Descriptions.Item>
              <Descriptions.Item label="运营商ID" span={2}>
                {Contract.operatorID}
              </Descriptions.Item>
              <Descriptions.Item label="专才分成">{Contract.shar}</Descriptions.Item>
              <Descriptions.Item label="约定最低平均用户评分">
                {Contract.minScore}
              </Descriptions.Item>
              <Descriptions.Item label="最短合作时间（单位：月）">
                {Contract.minCooperationTime}
              </Descriptions.Item>
              <Descriptions.Item label="约定每月最低接单数">{Contract.minOrder}</Descriptions.Item>
              <Descriptions.Item label="保证金额">{Contract.cashDeposit}</Descriptions.Item>
              <Descriptions.Item label="违约赔偿金额">
                {Contract.liquidatedDamages}
              </Descriptions.Item>
              <Descriptions.Item label="合约信息" span={3}>
                {Contract.content}
              </Descriptions.Item>
            </Descriptions>
          </Modal>
        </div>
      );
    } else {
      return (
        <div>
          <Link onClick={() => this.showNewContractViewModal()}>新建合约</Link>
          <Modal
            title="新建合约"
            visible={this.state.newContractViewVisible}
            onOk={this.handleNewContractViewOk}
            onCancel={this.handleNewContractViewCancel}
            width={720}
          >
            <Form layout="vertical">
              <Card bordered={false}>
                <Row gutter={16}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="合约名称">
                      {this.props.form.getFieldDecorator('contractName', {
                        rules: [{ required: true, message: '请输入合约名称' }],
                      })(<Input placeholder="请输入合约名称" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="合约等级">
                      {this.props.form.getFieldDecorator('grade', {
                        rules: [{ required: true, message: '请选择合约等级' }],
                      })(
                        <Select placeholder="请选择合约等级">
                          <Option value="A">A等级</Option>
                          <Option value="B">B等级</Option>
                          <Option value="C">C等级</Option>
                          <Option value="D">D等级</Option>
                          <Option value="E">E等级</Option>
                          <Option value="F">F等级</Option>
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="专才分成">
                      {this.props.form.getFieldDecorator('shar', {
                        rules: [{ required: true, message: '请输入专才分成' }],
                      })(<Input placeholder="请输入专才分成（例：0.5）" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="约定最低平均用户评分">
                      {this.props.form.getFieldDecorator('minScore', {
                        rules: [{ required: true, message: '请输入约定最低平均用户评分' }],
                      })(<Input placeholder="请输入约定最低平均用户评分（满分 5）" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="约定每月最低接单数">
                      {this.props.form.getFieldDecorator('minOrder', {
                        rules: [{ required: true, message: '请输入约定每月最低接单数' }],
                      })(<Input placeholder="请输入约定每月最低接单数" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="最短合作时间（单位：月）">
                      {this.props.form.getFieldDecorator('minCooperationTime', {
                        rules: [{ required: true, message: '请输入最短合作时间' }],
                      })(<Input placeholder="请输入最短合作时间" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="保证金额">
                      {this.props.form.getFieldDecorator('cashDeposit', {
                        rules: [{ required: true, message: '请输入保证金额' }],
                      })(<Input placeholder="请输入保证金额" />)}
                    </Form.Item>
                  </Col>
                  <Col lg={12} md={12} sm={24}>
                    <Form.Item label="违约赔偿金额">
                      {this.props.form.getFieldDecorator('liquidatedDamages', {
                        rules: [{ required: true, message: '请输入违约赔偿金额' }],
                      })(<Input placeholder="请输入违约赔偿金额" />)}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col lg={24} md={12} sm={24}>
                    <Form.Item label="合约详细信息">
                      {this.props.form.getFieldDecorator('content', {
                        rules: [
                          {
                            required: true,
                            message: '请输入合约详细信息',
                          },
                        ],
                      })(
                        <Input.TextArea
                          style={{ minHeight: 32 }}
                          placeholder="请输入合约详细信息"
                          rows={4}
                        />
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Form>
          </Modal>
        </div>
      );
    }
  };

  //查看合约
  handleContractViewOk = e => {
    console.log(e);
    this.setState({
      contractViewVisible: false,
    });
  };

  showContractViewModal = e => {
    console.log(e);
    this.setState({
      contractViewVisible: true,
    });
  };

  handleContractViewCancel = e => {
    console.log(e);
    this.setState({
      contractViewVisible: false,
    });
  };

  //新建合约
  handleNewContractViewOk = e => {
    const { dispatch } = this.props;
    this.props.form.validateFields((err, values) => {
      const data = {
        ...values,
        operatorID: localStorage.getItem('userId'),
        servicerID: this.props.match.params._id,
      };
      console.log('data', data);

      dispatch({
        type: 'servicer/addContract',
        payload: data,
      }).then(res => {
        console.log('res', res);
        if (res.status == '1') {
          message.success(res.information);
          location.reload(true);
        } else {
          message.error(res.information);
        }
      });
    });
    console.log(e);
    this.setState({
      newContractViewVisible: false,
    });
  };

  showNewContractViewModal = e => {
    console.log(e);
    this.setState({
      newContractViewVisible: true,
    });
  };

  handleNewContractViewCancel = e => {
    console.log(e);
    this.setState({
      newContractViewVisible: false,
    });
  };
  render() {
    const {
      contractViewVisible,
      newContractViewVisible,
      previewImage,
      servicer,
      Item,
      Contract,
    } = this.state;
    const { loading } = this.props;
    console.log('loading', loading);
    console.log('Item', Item);
    console.log('Contract', Contract);
    return (
      // 加头部
      <Card bordered={false}>
        <Descriptions title="专才基础信息管理" bordered loading={loading} layout="vertical">
          <Descriptions.Item label="专才ID">{servicer._id}</Descriptions.Item>
          <Descriptions.Item label="专才名">{servicer.servicerName}</Descriptions.Item>
          <Descriptions.Item label="专才账号">{servicer.servicerZhanghao}</Descriptions.Item>
          <Descriptions.Item label="专才凭证">
            <img
              alt="example"
              style={{ width: 70, height: 70 }}
              src={'http://47.103.1.149:7001' + servicer.servicerProfilePhoto}
            />
          </Descriptions.Item>
          <Descriptions.Item label="入驻时间">
            {moment(servicer.servicerRegistrationDate)
              .subtract(8, 'hours')
              .format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="专才合约">{this.getContract(Contract)}</Descriptions.Item>
          <Descriptions.Item label="运行状态" span={3}>
            {this.onServicerStatus(servicer.servicerStatus)}
          </Descriptions.Item>
          <Descriptions.Item label="专才身份信息">{servicer.servicerIDNo}</Descriptions.Item>
          <Descriptions.Item label="专才联系方式">{servicer.servicerPhone}</Descriptions.Item>
          <Descriptions.Item label="专才邮箱">{servicer.servicerEmail}</Descriptions.Item>
          <Descriptions.Item label="专才最高接单数" span={3}>
            {servicer.maxWorkOrder}
          </Descriptions.Item>
          <Descriptions.Item label="当前工单数" span={3}>
            {servicer.workordering}
          </Descriptions.Item>
          <Descriptions.Item label="可负责单品" span={3}>
            <Table bordered dataSource={Item} columns={this.ItemColumns} />
          </Descriptions.Item>
        </Descriptions>
        <Card>
          <Button
            type="primary"
            onClick={() => {
              this.props.history.push('/servicer/center/list');
            }}
            className={styles.ButtonCenter}
          >
            返回列表
          </Button>
        </Card>
      </Card>
    );
  }
}

export default Center;
