import React from 'react'
import Preferences from '../components/Preferences';
import { Steps, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import Strategies from '../components/Strategies';
import Recommendations from '../components/Recommendations';
import './RecommendationView.css';

const { Step } = Steps;
const steps = [
    {
        title: 'Preferences',
        content: <Preferences></Preferences>,
    },
    {
        title: 'Strategies',
        content: <Strategies></Strategies>,
    },
    {
        title: 'Recommendations',
        content: <Recommendations></Recommendations>,
    },
];


class RecommendationView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
        };
    }

    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
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
                                    {steps.map(item => (
                                        <Step key={item.title} title={item.title} />
                                    ))}
                                </Steps>
                            </div>
                            <div className="steps-content">{steps[current].content}</div>
                            <div className="steps-action">
                                {current < steps.length - 1 && (
                                    <Button type="primary" onClick={() => this.next()}>
                                        Next
                                    </Button>
                                )}
                                {current === steps.length - 1 && (
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

                        <p>Please <Link to='/login'>Login</Link> to gain access to Your recomendations.</p>
                }


            </>
        );
    }
}
export default RecommendationView