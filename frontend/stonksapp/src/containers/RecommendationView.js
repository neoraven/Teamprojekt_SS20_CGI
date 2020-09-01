import React from 'react'
import Preferences from '../components/Preferences';
import { Steps, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import Strategies from '../components/Strategies';
import Recommendations from '../components/Recommendations';
import './RecommendationView.css';
import api from '../utils/api';
import Loadingpage from '../components/Loadingpage'
import Resultspage from '../components/Resultspage'

const { Step } = Steps;
//ToDo:
// Slider start & end year; field for starting capital


class RecommendationView extends React.Component {
    constructor(props) {
        super(props);
        this.preferencesRef = React.createRef();
        this.strategiesRef = React.createRef();
        this.state = {
            current: 0,

            risk: 50,
            diversification: 0,
            slider3: 100,
            years: [2019, 2019],
            starting_capital: 10000,
            strategy: "",
            topnstocks: 10
        };
    }

    steps = [ //content here is not being used anymore. It has been integrated diretctly in the render function below
        {
            title: 'Preferences',
            content: <Preferences />,
        },
        {
            title: 'Strategies',
            content: <Strategies />,
        },
        {
            title: 'Recommendations',
            content: <Recommendations />,
        },
    ];

    next() {
        if (this.state.current === 0) {
            this.setState({
                starting_capital: this.preferencesRef.current.state.starting_capital,
                risk: this.preferencesRef.current.state.risk,
                diversification: this.preferencesRef.current.state.diversification,
                slider3: this.preferencesRef.current.state.slider3,
                years: this.preferencesRef.current.state.years,
            })
        }
        if (this.state.current === 1) {
            this.setState({
                strategy: this.strategiesRef.current.state.strategy,
                topnstocks: this.strategiesRef.current.state.topnstocks
            })
        }
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    oc() {
        console.log(this.testRef)
    }

    onDone() {
        this.setState({ loading: true, lastpage: true }, () => {
            api.post('/api/sim/start/', {
                risk_affinity: this.state.risk,
                diversification: this.state.diversification,
                placeholder: this.state.slider3,
                strategy: this.state.strategy,
                starting_capital: this.state.starting_capital,
                end_year: this.state.years[1],
                starting_year: this.state.years[0],
                strategy_kwargs: {
                    top_n_stocks: this.state.topnstocks,
                },
                subset_stocks: 20
            }).then(result => this.setState({
                loading: false,
                data: result.data,
            },
                console.log(result.data)))



        })

    }

    render() {
        const { current, loading, lastpage, data } = this.state;
        return (
            <>
                {
                    this.props.isAuthenticated ?



                        <div>
                            <div className="steps">
                                <Steps current={current}>
                                    {this.steps.map(item => (
                                        <Step key={item.title} title={item.title} />
                                    ))}
                                </Steps>
                            </div>


                            {loading ?

                                <Loadingpage />

                                :
                                <div>
                                    {lastpage ?
                                        <Resultspage data={data} />
                                        :

                                        <div><div className="steps-content">
                                            {current === 0 && (
                                                <Preferences ref={this.preferencesRef} />
                                            )}
                                            {current === 1 && (
                                                <Strategies ref={this.strategiesRef} />
                                            )}
                                            {current === 2 && (
                                                <Recommendations ref={this.preferencesRef} />
                                            )}


                                        </div>


                                            <div className="steps-action">
                                                {current < this.steps.length - 1 && (
                                                    <Button type="primary" onClick={() => this.next()}>
                                                        Next
                                                    </Button>
                                                )}
                                                {current === this.steps.length - 1 && (
                                                    <Button type="primary" onClick={() => this.onDone()}>
                                                        Simulate!
                                                    </Button>
                                                )}
                                                {current > 0 && (
                                                    <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}>
                                                        Previous
                                                    </Button>
                                                )}
                                            </div></div>
                                    }


                                </div>



                            }

                        </div>

                        :

                        <p>Please <Link to='/login'>Login</Link> to gain access to your recomendations.</p>
                }


            </>
        );
    }
    //() => message.success('Processing complete!')
}
export default RecommendationView