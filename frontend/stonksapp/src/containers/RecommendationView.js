import React from 'react'
import Recommendation from '../components/Recommendations'

class RecommendationView extends React.Component {
    render() {
        return (
            <div>
                <h1>Welcome to our simulation-based recommendation system.</h1>
                <h2>Our algorithm provides you with stock recommendations based on your preferences and an investing strategy of your choices.</h2>
                <p>What can you tell us about your preferences?</p>
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
                    <Recommendation />
                </div>
            </div>
        )
    }
}
export default RecommendationView