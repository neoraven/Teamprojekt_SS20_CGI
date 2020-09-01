import React from 'react'
import { Link } from 'react-router-dom';
import { RightSquareTwoTone, FundTwoTone } from '@ant-design/icons';
import { Table } from 'antd';
import { List, Avatar, Button, Skeleton } from 'antd';
import RecommendationsTabel from './RecommendationsTable'
import './Resultspage.css'
import api from '../utils/api'
import PreferencesTable from './PreferencesTable'
import ResultsChart from './ResultsChart/ResultsChart'






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

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

const geld = entry => {
    entry = formatter.format(entry)
    return entry
}


class HistoricalResultspage extends React.Component {
    state = {
        data: {}, //current cash/sim_id 
        strategy: {},
        dates: {},
        preferences: {},
        evaluation_history: [],
        performance: {},
        recommendation: [],
        evaluation_array: []
    }
    componentDidMount() {
        const simid = this.props.match.params.simId
        console.log(simid)
        api.get(`/api/sim/${simid}/`)
            .then(res => {
                this.setState({
                    strategy: res.data.input,
                    dates: res.data.input.dates,
                    preferences: res.data.input.preferences,
                    evaluation_history: res.data.evaluation_history,
                    performance: res.data.performance,
                    recommendation: res.data.recommendations
                })
                this.state.evaluation_history.map(score => {
                    this.state.evaluation_array.push([
                        new Date(score.date).getTime(),
                        score.score
                    ])
                })
                this.setState({
                    chart :  <ResultsChart  strategy={this.state.strategy}
                                            evaluation_history={this.state.evaluation_array} 
                    />
                })
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
                            <p >Timeframe: {this.state.dates.from} <RightSquareTwoTone style={{ fontSize: 22 }} /> {this.state.dates.to}</p>
                        </div>
                        <div className="PreferencesTable">
                            {Preftable(this.state.preferences)}
                        </div>
                    </div>
                    <div className="Gains">
                        <p style={{ textAlign: "center" }}>Starting Capital: {geld(this.state.performance.starting_capital)} <FundTwoTone style={{ fontSize: 22 }} twoToneColor="#52c41a" /> Current Portfolio vaule: {geld(this.state.performance.current_portfolio_value)}</p>
                    </div>
                    <h1>Evaluation History</h1>
                    <div className="Evaluation" id="results-chart-container">
                        {this.state.chart}
                    </div>
                    <h1>Recommendations</h1>
                    <p>The recommendations are being displayed as a combination of the symbol of the stock and the percentage allocation of your starting capital in that stock that the simulation recommends. 
                        The 'Add to portfolio' button will instantly add the recommended amount of the stock to your portfolio. <br></br>
                        If you click it multiple times, the amount will be added multiple times. </p>
                    <div className="Recommendations">
                        <RecommendationsTabel data={this.state.recommendation} capital={this.state.performance.starting_capital} />
                    </div>
                </div>
            )
        }
    }
}
export default HistoricalResultspage;