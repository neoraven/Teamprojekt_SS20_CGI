import React from 'react'
import Slider from './CustomSlider';
import { Button, Layout } from 'antd';
import './Preferences.css';



const { Header, Content, Footer, Sider } = Layout;

class Preferences extends React.Component {
    render() {
        return (
            <div>

                <center> <h1 className='h1'>Welcome to our Simulation-Based Recommendation System</h1></center>
                <div className='description'>
                    <p>Our algorithm provides you with stock recommendations based on your preferences and an investing strategy of your choices.</p>
                    <p>What can you tell us about your preferences?</p>
                </div>
                <div className="page-layout">
                    <div className="slider-content">
                        <p>Do you like risk?</p>
                        <Slider />
                        <p> <b>Note: </b>Liking risk means that you prioritizes the the potential for a high return over preservation of capital. More risk means more and bigger swings in your Capital.</p>
                    </div>
                    <div className="slider-content">
                        <p>Do you want many stocks or just a few?</p>
                        <Slider />
                        <p><b>Note: </b>More companys in your Portfolio means less potentially less swings in your capital but also again usally a little less gains.</p>
                    </div>
                    <div className="slider-content">
                        <p>I will think about something</p>
                        <Slider />
                        <p> <b>Note: </b> and give it a cool description</p>
                    </div>
                </div>

            </div>
        )
    }
}
export default Preferences