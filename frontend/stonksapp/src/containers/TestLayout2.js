import { Layout, Menu, Typography, Button } from 'antd';
import React from 'react';
import './TestLayout2.css';
import logo from '../stonks_logo_whateveriwant.svg'
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
                            <img src={logo} className="t" alt="stonks" width="165" />
                        </a>
                    </div>
                    <Menu theme="dark" mode="inline" >

                        {

                            this.props.isAuthenticated ?

                                <Menu.Item key="1" onClick={this.props.logout}>
                                    <Button type="primary" danger>
                                        Logout
                                     </Button>
                                </Menu.Item>

                                :

                                <Menu.Item key="1" >
                                    <Button type="primary"><Link to='/login'>Login</Link></Button>
                                </Menu.Item>

                        }




                        <Menu.Item key="2" >
                            <Link to='/stocks/'>
                                Stocks
                            </Link>
                        </Menu.Item>



                        <Menu.Item key="3" >
                            <Link to='/portfolio/'>
                                Portfolio
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="4" >
                            <Link to='/recommendations/' >Recommendations</Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout >
                    <Content style={{ margin: '24px 16px 0', minHeight:  'calc(100vh - 70px)'}}>
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