import React, { memo } from 'react';
import { Table, Row, Col, Card, Tabs, DatePicker } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import styles from './Home.less';
import { Bar } from '@/components/Charts';
import moment from 'moment';
import DescriptionList from '@/components/DescriptionList';
import TestECharst from '@/components/TestECharts/TestECharts';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: formatMessage({ id: 'app.analysis.test' }, { no: i }),
    total: 323234,
  });
}

const columns = [
  {
    title: '时间',
    dataIndex: 'updatedAt',
    sorter: true,
    render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
  },
  {
    title: '成交金额',
    dataIndex: 'userPayable',
    key: 'userPayable',
  },
  {
    title: '运营商应收款',
    dataIndex: 'operatorReceivable',
    key: 'operatorReceivable',
  },
  {
    title: '专才应收款',
    dataIndex: 'serverReceivable',
    key: 'serverReceivable',
  },
];

const dataCS = [
  {
    key: '1',
    updatedAt: 1573803368608,
    userPayable: 1000,
    operatorReceivable: 500,
    serverReceivable: 400,
  },
  {
    key: '2',
    updatedAt: 1573803368608,
    userPayable: 1000,
    operatorReceivable: 500,
    serverReceivable: 400,
  },
  {
    key: '3',
    updatedAt: 1573803368608,
    userPayable: 1000,
    operatorReceivable: 500,
    serverReceivable: 400,
  },
];

const SalesCard = memo(
  ({ rangePickerValue, salesData, isActive, handleRangePickerChange, loading, selectDate }) => (
    <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.salesCard}>
        <Tabs
          tabBarExtraContent={
            <div className={styles.salesExtraWrap}>
              <div className={styles.salesExtra}>
                <a className={isActive('today')} onClick={() => selectDate('today')}>
                  <FormattedMessage id="app.analysis.all-day" defaultMessage="All Day" />
                </a>
                <a className={isActive('week')} onClick={() => selectDate('week')}>
                  <FormattedMessage id="app.analysis.all-week" defaultMessage="All Week" />
                </a>
                <a className={isActive('month')} onClick={() => selectDate('month')}>
                  <FormattedMessage id="app.analysis.all-month" defaultMessage="All Month" />
                </a>
                <a className={isActive('year')} onClick={() => selectDate('year')}>
                  <FormattedMessage id="app.analysis.all-year" defaultMessage="All Year" />
                </a>
              </div>
              <RangePicker
                value={rangePickerValue}
                onChange={handleRangePickerChange}
                style={{ width: 256 }}
              />
            </div>
          }
          size="large"
          tabBarStyle={{ marginBottom: 24 }}
        >
          <TabPane
            tab={<FormattedMessage id="app.analysis.sales" defaultMessage="Sales" />}
            key="sales"
          >
            <Row>
              <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesBar}>
                  <TestECharst
                    data={{
                      xdata: [ '1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月',],
                      ydata: {
                        ydata1:[2000,4090,7000,23020,25060,76070,135060,162002,3206,20000,6004,3003,],
                        ydata2:[1800,3000,5000,20020,2504,76014,131460,161102,206,27000,1004,703,],
                        ydata3:[1900,2000,2000,3020,25040,76001,6060,16002,3006,2500,5004,2303,],
                      }
                    }}
                    DataName={['销售额','平台收账款','应付账款']}
                    legend={['销售额','平台收账款','应付账款']}
                    echartsTitle='趋势图'
                    key="volume"
                  />
                </div>
              </Col>
              <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>
                    <FormattedMessage
                      id="app.analysis.sales-ranking"
                      defaultMessage="Sales Ranking"
                    />
                  </h4>
                  <ul className={styles.rankingList}>
                    {rankingListData.map((item, i) => (
                      <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                        <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                        <span className={styles.rankingItemValue}>
                          {numeral(item.total).format('0,0')}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        <Card>
          <DescriptionList size="large" title="详细数据" style={{ marginBottom: 32 }}>
            <Table columns={columns} dataSource={dataCS} style={{ padding: 10 }} />
          </DescriptionList>
        </Card>
      </div>
    </Card>
  )
);

export default SalesCard;
