import React from 'react'
import { Slider } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import './CustomSlider.css';



class CustomSlider extends React.Component {

    state = {
        value: 0,
    };

    handleChange = value => {
        this.setState({ value });
        this.props.onUserAction(value)
    };

    render() {
        const { max, min } = this.props;
        const deffo = this.props.defaultValue;
        
        const { value } = this.state;
        const mid = ((max - min) / 2).toFixed(5);
        const preColorCls = value >= mid ? '' : 'icon-wrapper-active';
        const nextColorCls = value >= mid ? 'icon-wrapper-active' : '';
        return (
            <div className="icon-wrapper">
                <FrownOutlined className={preColorCls} />
                <Slider {...this.props} onChange={this.handleChange} defaultValue={deffo} step="10" />
                <SmileOutlined className={nextColorCls} />
            </div>
        );
    }
}



export default CustomSlider