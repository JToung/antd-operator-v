import React, { memo } from 'react';
import { Table, Row, Col, Card, Tabs, DatePicker } from 'antd';
import DescriptionList from '@/components/DescriptionList';
import styles from './style.less';


const ListCardItem = memo(
    ({ rangePickerValue, salesData, isActive, handleRangePickerChange, loading, selectDate }) => (
        <Card title="专才列表" extra={<a href="/servicer/list">More</a>} style={{ marginTop: 16 }}>
        </Card>
    )
);

export default ListCardItem;
