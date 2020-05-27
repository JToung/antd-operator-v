import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown, message } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './style.less';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));
const CashFlowCard = React.lazy(() => import('./CashFlowCard'));
const TopSearch = React.lazy(() => import('./TopSearch'));
const ProportionSales = React.lazy(() => import('./ProportionSales'));
const OfflineData = React.lazy(() => import('./OfflineData'));

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class ItemHome extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
    //总额
    workorderTotal: 0,
    BadWorkorderTotal: 0,
    GoodWorkorderTotal: 0,
    //日增长率
    simpleRatioTotal: 0,
    simpleRatioBadTotal: 0,
    simpleRatioGoodTotal: 0,
    //日额
    TotalOneDay: 0,
    BadTotalOneDay: 0,
    GoodTotalOneDay: 0,
    //趋势图
    Data: {},
    //单品分区排行
    PartitonRank: [],
  };

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
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'chart/fetch',
      });
    });

    const payload = {
      id: localStorage.getItem('userId'),
    };

    //获取总工单数
    dispatch({
      type: 'workorder/queryTotalWorkorder',
      payload: payload,
    }).then(res => {
      this.setState({ workorderTotal: res[0].count });
    });
    //成交额总量
    dispatch({
      type: 'workorder/queryVolume',
      payload: payload,
    }).then(res => {
      this.setState({ Volume: res });
    });
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.reqRef);
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  handleTabChange = key => {
    this.setState({
      currentTabKey: key,
    });
  };

  handleRangePickerChange = rangePickerValue => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue,
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  selectDate = type => {
    const { dispatch } = this.props;
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });

    dispatch({
      type: 'chart/fetchSalesData',
    });
  };

  isActive = type => {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }
    return '';
  };

  render() {
    const {
      rangePickerValue,
      salesType,
      currentTabKey,
      workorderTotal,
      BadWorkorderTotal,
      GoodWorkorderTotal,
      //日增长率
      simpleRatioTotal,
      simpleRatioBadTotal,
      simpleRatioGoodTotal,
      //日额
      TotalOneDay,
      BadTotalOneDay,
      GoodTotalOneDay,
      //趋势图
      Data,
      //单品分区排行
      PartitonRank,
    } = this.state;
    const { chart, loading } = this.props;
    const {
      visitData,
      visitData2,
      salesData,
      searchData,
      offlineData,
      offlineChartData,
      salesTypeData,
      salesTypeDataOnline,
      salesTypeDataOffline,
    } = chart;
    let salesPieData;
    if (salesType === 'all') {
      salesPieData = salesTypeData;
    } else {
      salesPieData = salesType === 'online' ? salesTypeDataOnline : salesTypeDataOffline;
    }
    const menu = (
      <Menu>
        <Menu.Item>操作一</Menu.Item>
        <Menu.Item>操作二</Menu.Item>
      </Menu>
    );

    const dropdownGroup = (
      <span className={styles.iconGroup}>
        <Dropdown overlay={menu} placement="bottomRight">
          <Icon type="ellipsis" />
        </Dropdown>
      </span>
    );

    const activeKey = currentTabKey || (offlineData[0] && offlineData[0].name);

    return (
      <GridContent>
        <Suspense fallback={<PageLoading />}>
          <IntroduceRow
            loading={loading}
            visitData={visitData}
            simpleRatioTotal={simpleRatioTotal}
            simpleRatioBadTotal={simpleRatioBadTotal}
            simpleRatioGoodTotal={simpleRatioGoodTotal}
            workorderTotal={workorderTotal}
            BadWorkorderTotal={BadWorkorderTotal}
            GoodWorkorderTotal={GoodWorkorderTotal}
            TotalOneDay={TotalOneDay}
            BadTotalOneDay={BadTotalOneDay}
            GoodTotalOneDay={GoodTotalOneDay}
          />
        </Suspense>
        <Suspense fallback={null}>
          <SalesCard
            rangePickerValue={rangePickerValue}
            salesData={salesData}
            isActive={this.isActive}
            handleRangePickerChange={this.handleRangePickerChange}
            loading={loading}
            selectDate={this.selectDate}
            Data={Data}
            PartitonRank={PartitonRank}
          />
        </Suspense>
      </GridContent>
    );
  }
}

export default ItemHome;
