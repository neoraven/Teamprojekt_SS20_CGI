import React from 'react'
import CustomSlider from './CustomSlider';
import CustomRangeSlider from './CustomRangeSlider';
import './Preferences.css';
import { InputNumber } from 'antd';


class Preferences extends React.Component {
    state = {
        risk: 0,
        diversification: 0,
        slider3: 0,
        years: [2017, 2019],
        starting_capital: 10000,
    }

    onChange(value){
        this.setState({
            starting_capital: value
        })
    }

    render() {
        const value = this.state.starting_capital
        return (
            <div>
                <center> <h1 className='h1'>Welcome to our Simulation-Based Recommendation System</h1></center>
                <div className='description'>
                    <p>Our algorithm provides you with stock recommendations based on your preferences and an investing strategy of your choices.</p>
                    <p>What can you tell us about your preferences?</p>
                </div>
                <div className="page-layout">
                    <div className="slider-content">
                        <p>How much capital do you have in you Portfolio</p>
                        <InputNumber
                            defaultValue={value}
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value.replace(/\$\s?|(,*)/g, '')}
                            onChange={(value)=>this.onChange(value)}
                        />
                        <p> <b>Note: </b> You should have a minimum of $5000 to get proper results. Also, not all of the capital will be used to trade. You can always have some cash to spare in your portfoilio if you want to. The settings for this are further down on this page. </p>
                    </div>
                    <div className="slider-content">
                        <p>Do you like risk?</p>
                        <CustomSlider onUserAction={(risk) => (this.setState({ risk }))} />
                        <p> <b>Note: </b>Liking risk means that you prioritize the potential for a high return over preservation of capital. More risk means more and bigger swings in your Capital.</p>
                    </div>
                    <div className="slider-content">
                        <p>Do you want many stocks or just a few?</p>
                        <CustomSlider onUserAction={(diversification) => (this.setState({ diversification }))} />
                        <p><b>Note: </b>More companies in your Portfolio means less potentially less swings in your capital but also again usally a little less gains.</p>
                    </div>
                    <div className="slider-content">
                        <p>I will think about something</p>
                        <CustomSlider onUserAction={(slider3) => (this.setState({ slider3 }))} />
                        <p> <b>Note: </b> and give it a cool description</p>
                    </div>
                    <div className="slider-content">
                        <p>Which years would you like us to backtest?</p>
                        <CustomRangeSlider min={2005} max={2020} onUserAction={(years) => (this.setState({ years }))} />
                        <p> <b>Note: </b> If you want results for your current investing then you should set the end year to 2020. If however you want to see how your preferences would have performed in an earlier timeframe just select that.</p>
                        <p style={{ color: "red" }}> <b>Important</b>: The bigger the timeframe is that you select the longer the simulaten will take. Big simulations will show you the performance over a longer term and through many different market conditions but they will take <b>over 10 minutes </b>to calculate.</p>
                    </div>
                </div>

            </div>
        )
    }
}
export default Preferences