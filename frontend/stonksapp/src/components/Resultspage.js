import React from 'react'
import { Link } from 'react-router-dom';
import { RightSquareTwoTone, FundTwoTone } from '@ant-design/icons';
import { Table } from 'antd';
import { List, Avatar, Button, Skeleton } from 'antd';
import RecommendationsTabel from './RecommendationsTable'
import './Resultspage.css'



const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
];
const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
    },
]



class Resultspage extends React.Component {
    render() {
        return (
            <div className="parent">
                    <center><h2>Results</h2></center>
                    <h1>Simulation Parameters</h1>
                    <div className="SimulationParameters">
                        <div className="years">
                            <p>Strategey: Dogs of the Stocks</p>
                            <p >2017 <RightSquareTwoTone style={{ fontSize: 22 }} /> 2019</p>
                        </div>
                        <div className="PreferencesTable">
                            <Table pagination={false} columns={columns} dataSource={data} size="small" />
                        </div>
                    </div>
                    <div className="Gains">
                        <p style={{ textAlign: "center" }}>Starting Capital: $10000 <FundTwoTone style={{ fontSize: 22 }} twoToneColor="#52c41a" /> Current Portfolio vaule: $13,337</p>
                    </div>
                    <h1>Evaluation History</h1>
                    <div className='Evaluation' style={{ textAlign: "justify" }}>
                        <center><p><b>-------GRAPH HERE---------</b></p></center>
                    </div>
                    <h1>Recommendations</h1>
                    <div className="Recommendations">
                        <RecommendationsTabel />
                    </div>
                </div>
        )
    }
}
export default Resultspage;