import React from 'react';
import api from '../utils/api';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Simulation from '../components/Simulation';

const menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                1st menu item
      </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                2nd menu item
      </a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                3rd menu item
      </a>
        </Menu.Item>
        <Menu.Item danger>a danger item</Menu.Item>
    </Menu>
);




class Simulations extends React.Component {
    state = {
        sims: []
    }
    componentDidMount() {
        api.get('/api/sim/list/')
            .then(res => {
                this.setState({
                    sims: res.data
                })
            })
    }

    render() {
        return (
            <div>
                <Simulation data={this.state.sims}/>
            </div>
        )
    }

}

export default Simulations;