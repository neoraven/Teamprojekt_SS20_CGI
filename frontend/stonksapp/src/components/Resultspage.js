import React from 'react'
import { Link } from 'react-router-dom';
import { RightSquareTwoTone, FundTwoTone } from '@ant-design/icons';
import { Table } from 'antd';
import { List, Avatar, Button, Skeleton } from 'antd';
import RecommendationsTabel from './RecommendationsTable'
import './Resultspage.css'
import api from '../utils/api'
import PreferencesTable from './PreferencesTable'






const Preftable = entry => {
    const columns = [
        {
            title: 'Preference',
            dataIndex: 'preference',
        },
        {
            title: 'Value',
            dataIndex: 'value',
        },
    ]

    const data = [
        {
            key: '1',
            preference: "Risk Affinity",
            value: entry.risk_affinity,
        },
        {
            key: '2',
            preference: 'Diversification',
            value: entry.diversification,
        },
        {
            key: '3',
            preference: 'Placeholder',
            value: entry.placeholder,
        },
    ]
    return <Table pagination={false} columns={columns} dataSource={data} size="small" />;
}

/*const RecsTable = entry => {
    console.log(entry)
    return (
        <List
            itemLayout="horizontal"
            dataSource={entry}
            renderItem={item => (
                <List.Item
                    actions={[<Button type="primary" > Add to Portfolio </Button>]}>

                    <List.Item.Meta
                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                        title={<a href="https://ant.design">{item.symbol}</a>}
                    />
                    <div>content</div>
                </List.Item>
            )}
        />
    )
}*/


class Resultspage extends React.Component {
    state = {
        data: {}, //current cash/sim_id 
        strategy: {},
        dates: {},
        preferences: {},
        evaluation_history: {},
        performance: {},
        recommendation: []
    }
    componentDidMount() {
        this.setState({
            strategy: this.props.data.input,
            dates: this.props.data.input.dates,
            preferences: this.props.data.input.preferences,
            evaluation_history: this.props.data.evaluation_history,
            performance: this.props.data.performance,
            recommendation: this.props.data.recommendation
        })
    }


    render() {
        if (this.state.data == {} || this.state.preferences.diversification == {} || this.state.recommendation == undefined) {
            return (<div></div>)
        } else {
            return (
                <div className="parent">
                    <center><h2>Results</h2></center>
                    <h1>Simulation Parameters</h1>
                    <div className="SimulationParameters">
                        <div className="years">
                            <p>Strategy: {this.state.strategy.strategy}</p>
                            <p > {this.state.dates.from} <RightSquareTwoTone style={{ fontSize: 22 }} /> {this.state.dates.to}</p>
                        </div>
                        <div className="PreferencesTable">
                            {Preftable(this.state.preferences)}
                        </div>
                    </div>
                    <div className="Gains">
                        <p style={{ textAlign: "center" }}>Starting Capital: ${this.state.performance.starting_capital} <FundTwoTone style={{ fontSize: 22 }} twoToneColor="#52c41a" /> Current Portfolio vaule: ${this.state.performance.current_portfolio_value}</p>
                    </div>
                    <h1>Evaluation History</h1>
                    <div className='Evaluation' style={{ textAlign: "justify" }}>
                        <center><p><b>-------GRAPH HERE---------</b></p></center>
                    </div>
                    <h1>Recommendations</h1>
                    <div className="Recommendations">
                        <RecommendationsTabel data={this.state.recommendation}/>
                    </div>
                </div>
            )
        }
    }
}
export default Resultspage;