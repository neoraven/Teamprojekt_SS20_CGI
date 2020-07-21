import React from 'react'
import Slider from '../components/Slider'
import Preferences from '../components/Preferences';
import { Steps, Button, message } from 'antd';
import { Link } from 'react-router-dom';


const { Step } = Steps;
const steps = [
    {
        title: 'Preferences',
        content: <Preferences></Preferences>,
    },
    {
        title: 'Strategies',
        content: <Preferences></Preferences>,
    },
    {
        title: 'Recommendations',
        content: <Preferences></Preferences>,
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
           
                 <Steps current={current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
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
            </>
        );


        /*return (
    <div>
        <h1>Welcome to our simulation-based recommendation system.</h1>
        <h2>Our algorithm provides you with stock recommendations based on your preferences and an investing strategy of your choices.</h2>
        <p>What can you tell us about your preferences?</p>
        <Steps current={1}>
            <Step title="Preferences" description="This is a description." />
            <Step title="Strategies" description="This is a description." />
            <Step title="Recommendations" description="This is a description." />
        </Steps>
        <div>
            <div>
                <p>Risk aversity slider</p>
                <Recommendation />
                <p>I am risk averse. Therefore, I am an investor who prioritizes the preservation of capital over the potential for a high return.</p>
            </div>
            <div>
                <p>Diversification slider</p>
                <Recommendation />
                <p>I prefer a diversified portfolio over a concentrated one.</p>
            </div>
            <div>
                <p>Diversification slider</p>
                <Recommendation />
                <p>I prefer a diversified portfolio over a concentrated one.</p>
            </div>
        </div>
    <Button ><Link to='/chose'>Next</Link></Button>
    </div>
)*/
    }
}
export default RecommendationView