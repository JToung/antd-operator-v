import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import numeral from 'numeral';
import styles from './Home.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};

const getflag = simpleRatio => {
  if (simpleRatio > 0) {
    return 'up';
  } else {
    return 'down';
  }
};

const IntroduceRow = memo(
  ({
    loading,
    visitData,
    Totalamout,
    simpleRatioSale,
    SaleOneDay,
    Volume,
    simpleRatioVolume,
    VolumeOneDay,
    Profit,
    simpleRatioProfit,
    ProfitOneDay,
    simpleRatioDebt,
    Debt,
    DebtOneDay
  }) => (
    <Row gutter={24}>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="app.analysis.total-sales" defaultMessage="Total Sales" />}
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={() => <Yuan>{Totalamout}</Yuan>}
          footer={
            <Field
              label={<FormattedMessage id="app.analysis.day-sales" defaultMessage="Daily Sales" />}
              value={`￥${numeral(SaleOneDay).format('0,0')}`}
            />
          }
          contentHeight={46}
        >
          {/* <Trend flag="up" style={{ marginRight: 16 }}>
          <FormattedMessage id="app.analysis.week" defaultMessage="Weekly Changes" />
          <span className={styles.trendText}>12%</span>
        </Trend> */}
          <Trend flag={getflag(simpleRatioSale)}>
            <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
            <span className={styles.trendText}>{simpleRatioSale}%</span>
          </Trend>
        </ChartCard>
      </Col>

      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title={<FormattedMessage id="app.analysis.volume" defaultMessage="Volume" />}
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          total={numeral(Volume).format('0,0')}
          footer={
            <Field
              label={
                <FormattedMessage id="app.analysis.day-volume" defaultMessage="Daily Volume" />
              }
              value={numeral(VolumeOneDay).format('0,0')}
            />
          }
          contentHeight={46}
        >
          <MiniArea color="#975FE4" data={visitData} />
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="app.analysis.receivable" defaultMessage="Receivable" />}
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={() => <Yuan>{Profit}</Yuan>}
          footer={
            <Field
              label={
                <FormattedMessage
                  id="app.analysis.day-receivable"
                  defaultMessage="Daily Receivable"
                />
              }
              value={`￥${numeral(ProfitOneDay).format('0,0')}`}
            />
          }
          contentHeight={46}
        >
          <Trend flag={getflag(simpleRatioProfit)}>
            <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
            <span className={styles.trendText}>{simpleRatioProfit}%</span>
          </Trend>
        </ChartCard>
      </Col>
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title={<FormattedMessage id="app.analysis.payable" defaultMessage="Payable" />}
          action={
            <Tooltip
              title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
            >
              <Icon type="info-circle-o" />
            </Tooltip>
          }
          loading={loading}
          total={() => <Yuan>{Debt}</Yuan>}
          footer={
            <Field
              label={
                <FormattedMessage id="app.analysis.day-payable" defaultMessage="Daily Payable" />
              }
              value={`￥${numeral(DebtOneDay).format('0,0')}`}
            />
          }
          contentHeight={46}
        >
          <Trend flag={getflag(simpleRatioDebt)}>
            <FormattedMessage id="app.analysis.day" defaultMessage="Daily Changes" />
            <span className={styles.trendText}>{simpleRatioDebt}%</span>
          </Trend>
        </ChartCard>
      </Col>
    </Row>
  )
);

export default IntroduceRow;
