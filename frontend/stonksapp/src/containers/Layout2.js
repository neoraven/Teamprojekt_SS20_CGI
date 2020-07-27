import { Layout, Menu, Breadcrumb, Typography } from 'antd';
import React from 'react';
import logo from '../freeLogo.jpeg'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import * as actions from '../store/actions/auth'
import './layout.css';

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

class SecondLayout extends React.Component {
  render() {
    return (
      <Layout className="layout">
        <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
          <a href='/'>
            <img src={logo} className="logo" alt="stonks" width="200" height="57" />
          </a>
          {

            this.props.isAuthenticated ?

              <div className='user'>
                Logged in as {localStorage.getItem('user')}
              </div>

              :

              <div></div>
          }
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>


            <Menu.Item key="1" >
              <Link to='/'>Stocks</Link>
            </Menu.Item>

            {

              this.props.isAuthenticated ?

                <Menu.Item key="2" onClick={this.props.logout}>
                  Logout
                </Menu.Item>

                :

                <Menu.Item key="2">
                  <Link to='/login'>Login</Link>
                </Menu.Item>

            }
            <Menu.Item key="3" >
              <Link to='/portfolio/'>Portfolio</Link>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to='/recommendations/'>Recommendations</Link>
            </Menu.Item>
          </Menu>

        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item><Link to='/'>Home</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to='/'>List</Link></Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content">{this.props.children}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <Link to='/impressum/'>Impressum</Link>
        </Footer>
      </Layout>
    );

  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(actions.logout())
    }
  }
};



export default connect(null, mapDispatchToProps)(SecondLayout);
