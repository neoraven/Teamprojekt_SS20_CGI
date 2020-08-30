import React from 'react'
import { Link } from 'react-router-dom';
import { RightSquareTwoTone, FundTwoTone } from '@ant-design/icons';
import { Table } from 'antd';
import { List, Avatar, Button, Skeleton } from 'antd';
import RecommendationsTabel from './RecommendationsTable'
import './Resultspage.css'
import api from '../utils/api';



class PreferencesTable extends React.Component {
    columns = [
        {
            title: 'Preference',
            dataIndex: 'preference',
        },
        {
            title: 'Value',
            dataIndex: 'value',
        },
    ];
    data = [
        {
            key: '1',
            preference: "Risk Affinity",
            value: this.props.data.risk_affinity,
        },
        {
            key: '2',
            preference: 'Diversification',
            value: this.props.data.diversification,
        },
        {
            key: '3',
            preference: 'Placeholder',
            value: this.props.data.placeholder,
        },
    ]



    render() {

            return (
                <Table pagination={false} columns={this.columns} dataSource={this.state.data} size="small" />
            )
        
    }
}

export default PreferencesTable