import { Layout, Menu, Typography } from 'antd';
import React from 'react';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import './TestLayout2.css';
import logo from '../freeLogo.jpeg'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import * as actions from '../store/actions/auth'

const { Header, Content, Footer, Sider } = Layout;
const { Text } = Typography;

class RespoDemo extends React.Component {
    render() {
        return (
            <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <div className="logo" >
                        <a href='/'>
                            <img src={logo} className="t" alt="stonks" width="165" height="40" />
                        </a>
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                        <Menu.Item key="1" icon={<UserOutlined />} >
                       
                                    Stocks
                            
                        </Menu.Item>

                        {

                            this.props.isAuthenticated ?

                                <Menu.Item key="2" onClick={this.props.logout} icon={<UploadOutlined />}>
                                    Logout
                                </Menu.Item>

                                :

                                <Menu.Item key="2" icon={<UploadOutlined />}>
                                    <Link to='/login'>Login</Link>
                                </Menu.Item>

                        }

                        <Menu.Item key="3" icon={<UploadOutlined />}>
                            <Link to='/portfolio/'>Portfolio</Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<UserOutlined />}>
                            <Link to='/recommendations/'>Recommendations</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Content style={{ margin: '24px 16px 0' }}>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            {this.props.children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        <Link to='/impressum/'>Impressum</Link>
                    </Footer>
                </Layout>
            </Layout>
        )


    }

}

const mapDispatchToProps = dispatch => {
    return {
      logout: () => {
        dispatch(actions.logout())
      }
    }
};

export default connect(null, mapDispatchToProps)(RespoDemo);