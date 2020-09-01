import React from 'react'
import { Collapse, Checkbox, InputNumber } from 'antd';
import './Strategies.css';


const { Panel } = Collapse;




class Strategies extends React.Component {
    state = {
        strategy: "DogsOfTheStocks",
        topnstocks: 10,
        checked1: true,
        checked2: false,
        checked3: false,
    }

    onChange = (e) => {
        if (e === undefined) {
            return
        }
        console.log(e.target)
        switch (e.target.id) {
            case 1:
                this.setState({
                    strategy: "DogsOfTheStocks",
                    checked1: true,
                    checked2: false,
                    checked3: false,
                })
                break;
            case 2:
                this.setState({
                    strategy: "Yolo",
                    checked1: false,
                    checked2: true,
                    checked3: false,
                })
                break;

            case 3:
                this.setState({
                    strategy: "Markowitz",
                    checked1: false,
                    checked2: false,
                    checked3: true,
                })
                break;

            default:
                console.log("default")
                break;
        }
    }
    onNumber = value => {

        this.setState({
            topnstocks: value
        })
    }

    render() {
        return (

            <div className="content">
                <div className='description'>
                    <p>
                        Here you can select a strategy on which we will use to recommend stocks to you.
                        We will apply your preferences to this strategy and after a quick historical backtest the stocks with the highest potential will be recommended to you.
                        If you are unsure what which one you should select, we have recommended one for you.
                    </p>
                </div>
                <Collapse defaultActiveKey={['1']} style={{ textAlign: "justify" }}>
                    <Panel header="Dogs of the Stocks" key="1"
                        extra={
                            <Checkbox id={1} onChange={this.onChange} checked={this.state.checked1} defaultChecked="true">Use this! (recommended)</Checkbox>
                        }
                    >
                        <p>
                            The 'Dogs of the Stocks' Strategy is an adaptation of the well known 'Dogs of the Dow' Strategy.
                            Under this model, an investor annually reinvesting in high-yield companies has the potential to out-perform the overall market.
                            The data from Dogs of the Dow suggests that this has been the case since the turn of the century.
                            The logic behind this is that a high-dividend yield suggests both that the stock is oversold and that management
                            believes in its company's prospects and is willing to back that up by paying out a relatively high dividend.
                            Investors are thereby hoping to benefit from both above-average stock-price gains as well as a relatively high quarterly dividend.
                     </p>

                        <InputNumber
                            id={1}
                            style={{ width: 220 }}
                            placeholder="Top N different stocks to buy"
                            min={0}
                            max={25}
                            onChange={this.onNumber}
                        />


                    </Panel>
                    <Panel header="Exponential moving averages" key="2"
                        extra={
                            <Checkbox id={2} checked={this.state.checked2} onChange={this.onChange}>Use this!</Checkbox>
                        }
                    >
                        <p>can i has cheezburger?</p>
                    </Panel>
                    <Panel header="Markowitz Diversification" key="3" extra={
                        <Checkbox id={3} checked={this.state.checked3} onChange={this.onChange}>Use this!</Checkbox>
                    }
                    >
                        <p></p>
                    </Panel>
                </Collapse>
            </div>
        )
    }
}
export default Strategies