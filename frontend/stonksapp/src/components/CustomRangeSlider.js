import React from 'react'
import { Slider } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import './CustomSlider.css';



class CustomRangeSlider extends React.Component {

    state = {
        value: [2019,2019],
    };


    onChange = value => {
        this.setState({ value });
        this.props.onUserAction(value)
      }
      
    onAfterChange = value => {
        this.setState({ value });
        this.props.onUserAction(value)
      }
      

    render() {
        const min = this.props.min;
        const max = this.props.max;
        const { value } = this.state;
        return (
            <Slider
            min = {min}
            max={max}
            range
            step={1}
            onChange={this.onChange}
            onAfterChange={this.onAfterChange}
            value={value}
          />
          
          
          
        );
    }
}



export default CustomRangeSlider