import React from 'react'
import Recommendation from '../components/Recommendations'
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { Steps } from 'antd';

const { Step } = Steps;

class RecommendationView extends React.Component {
    render() {
        return (
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
        )
    }
}
export default RecommendationView