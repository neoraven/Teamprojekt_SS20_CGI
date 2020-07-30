import React from 'react'
import Preferences from '../components/Preferences';
import { Steps, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import Strategies from '../components/Strategies';
import Recommendations from '../components/Recommendations';
import './RecommendationView.css';

const { Step } = Steps;



class RecommendationView extends React.Component {
    constructor(props) {
        super(props);
        this.preferencesRef = React.createRef();
        this.strategiesRef = React.createRef();
        this.state = {
            current: 0,
            risk: 0,
            diversification: 0,
            slider3: 0,
            strategy1: false,
            strategy2: false,
            strategy3: false,
        };
    }

    steps = [ //content here is not being used anymore. It has been integrated diretctly in the render function below
        {
            title: 'Preferences',
            content: <Preferences />,
        },
        {
            title: 'Strategies',
            content: <Strategies/>,
        },
        {
            title: 'Recommendations',
            content: <Recommendations/>,
        },
    ];

    next() {
        if(this.state.current === 0){
            this.setState({
                risk: this.preferencesRef.current.state.risk,
                diversification: this.preferencesRef.current.state.diversification,
                slider3: this.preferencesRef.current.state.slider3,
            })
        }
        if(this.state.current === 1){
            this.setState({
                strategy1: this.strategiesRef.current.state.checkbox1,
                strategy2: this.strategiesRef.current.state.checkbox2,
                strategy3: this.strategiesRef.current.state.checkbox3,
            })
        }
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    oc(){
        console.log(this.testRef)
    }

    render() {
        const { current } = this.state;
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
                            <div className="steps-content">
                                { current === 0 &&(
                                <Preferences ref={this.preferencesRef}/>
                                )}
                                { current === 1 &&(
                                <Strategies ref={this.strategiesRef}/>
                                )}
                                { current === 2 &&(
                                <Recommendations ref={this.preferencesRef}/>
                                )}
                                
                                
                                </div>
                            <div className="steps-action">
                                {current < this.steps.length - 1 && (
                                    <Button type="primary" onClick={() => this.next()}>
                                        Next
                                    </Button>
                                )}
                                {current === this.steps.length - 1 && (
                                    <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                        Done
                                    </Button>
                                )}
                                {current > 0 && (
                                    <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}>
                                        Previous
                                    </Button>
                                )}
                            </div>
                            
                        </div>

                        :

                        <p>Please <Link to='/login'>Login</Link> to gain access to your recomendations.</p>
                }


            </>
        );
    }
}
export default RecommendationView