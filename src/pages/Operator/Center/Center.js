import React, { PureComponent } from 'react';
import { Descriptions, Badge, Card, Button, message, Modal, Upload } from 'antd';
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
@connect(({ operator, loading }) => ({
  operator,
  loading: loading.effects['operator/fetchOperator'],
  //model
}))
class Center extends PureComponent {
  state = {
    previewVisible: false,
    operatorProofVisible: false,
    legalPersonPhotoVisible: false,
    Contract: {},
    operator: {},
    contractViewVisible: false,
  };

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

    dispatch({
      type: 'operator/fetchOperator',
      payload: params.id || localStorage.getItem('userId'),
    }).then(res => {
      console.log('res', res);
      this.setState({ operator: res });
    });

    const params2 = {
      operatorID: localStorage.getItem('userId'),
    };

    dispatch({
      type: 'operator/queryContract',
      payload: params2,
    }).then(res => {
      console.log('queryContract', res);
      if (res.status == '1') {
        this.setState({ Contract: res.findResult[0] });
      } else {
        this.setState({ Contract: {} });
      }
    });
    // console.log('this.props.data',this.props.data);
  }

  onOperatorState(operatorState) {
    if (operatorState == '1') {
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
  获取运营商合约
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
              <Descriptions.Item label="运营商ID" span={3}>
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
          <Link disabled>不存在合约</Link>
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

  //运营凭证查看
  showProofModal = () => {
    this.setState({
      operatorProofVisible: true,
    });
  };

  handleProofOk = e => {
    // console.log(e);
    this.setState({
      operatorProofVisible: false,
    });
  };

  handleProofCancel = e => {
    // console.log(e);
    this.setState({
      operatorProofVisible: false,
    });
  };

  //证件照查看

  showPersonPhotoModal = () => {
    this.setState({
      legalPersonPhotoVisible: true,
    });
  };

  handlePersonPhotoOk = e => {
    // console.log(e);
    this.setState({
      legalPersonPhotoVisible: false,
    });
  };

  handlePersonPhotoCancel = e => {
    // console.log(e);
    this.setState({
      legalPersonPhotoVisible: false,
    });
  };

  Out = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
    });
  };

  render() {
    const {
      previewVisible,
      previewImage,
      Contract,
      operator,
      operatorProofVisible,
      legalPersonPhotoVisible,
    } = this.state;
    const { loading } = this.props;
    console.log('loading', loading);
    // console.log('operator.date',operator);
    if (operator == null) {
      return (
        // 加头部
        <Card bordered={false}>
          <Button type="danger" onClick={() => this.Out()} className={styles.ButtonCenter}>
            退出登录
          </Button>
        </Card>
      );
    } else {
      return (
        // 加头部
        <Card bordered={false}>
          <Descriptions title="运营商基础信息管理" bordered loading={loading} layout="vertical">
            <Descriptions.Item label="运营商ID">{operator._id}</Descriptions.Item>
            <Descriptions.Item label="运营商名">{operator.operatorName}</Descriptions.Item>
            <Descriptions.Item label="运营商合约">{this.getContract(Contract)}</Descriptions.Item>
            <Descriptions.Item label="运营商凭证">
              <img
                alt="example"
                style={{ width: 70, height: 70 }}
                src={OPERATOR_URL + operator.operatorProof}
                onClick={this.showProofModal}
              />
              <Modal
                title="运营商凭证"
                visible={operatorProofVisible}
                footer={null}
                onCancel={this.handleProofCancel}
                onOk={this.handleProofOk}
              >
                <img
                  alt="example"
                  style={{ width: '100%' }}
                  src={OPERATOR_URL + operator.operatorProof}
                />
              </Modal>
            </Descriptions.Item>
            <Descriptions.Item label="入驻时间" span={2}>
              {moment(operator.operatorAddTime)
                .subtract(8, 'hours')
                .format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="运营商简介" span={3}>
              {operator.introduction}
            </Descriptions.Item>
            <Descriptions.Item label="运营商介绍" span={3}>
              {operator.content}
            </Descriptions.Item>
            <Descriptions.Item label="运行状态" span={3}>
              {this.onOperatorState(operator.operatorState)}
            </Descriptions.Item>
            <Descriptions.Item label="运营商法人">{operator.legalPerson}</Descriptions.Item>
            <Descriptions.Item label="法人身份信息">{operator.legalPersonIdNo}</Descriptions.Item>
            <Descriptions.Item label="法人联系方式">{operator.legalPersonPhone}</Descriptions.Item>
            <Descriptions.Item label="法人证件照">
              <img
                alt="example"
                style={{ width: 70, height: 70 }}
                src={OPERATOR_URL + operator.legalPersonPhoto}
                onClick={this.showPersonPhotoModal}
              />
              <Modal
                title="法人证件照"
                visible={legalPersonPhotoVisible}
                footer={null}
                onCancel={this.handlePersonPhotoCancel}
                onOk={this.handlePersonPhotoOk}
              >
                <img
                  alt="example"
                  style={{ width: '100%' }}
                  src={OPERATOR_URL + operator.legalPersonPhoto}
                />
              </Modal>
            </Descriptions.Item>
            <Descriptions.Item label="法人邮箱">{operator.legalPersonEmail}</Descriptions.Item>
            <Descriptions.Item label="法人地址">{operator.legalPersonAdress}</Descriptions.Item>
            <Descriptions.Item label="审核状态" span={3}>
              {this.onExamineState(operator.operatorState)}
            </Descriptions.Item>
          </Descriptions>
          <Card>
            <Button
              type="primary"
              onClick={() => {
                this.props.history.push('/operator/center/update');
              }}
              className={styles.ButtonCenter}
            >
              修改运营商信息
            </Button>
          </Card>
        </Card>
      );
    }
  }
}

export default Center;
