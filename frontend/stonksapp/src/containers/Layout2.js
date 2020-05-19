import { Layout, Menu, Breadcrumb } from 'antd';
import React from 'react';
import logo from '../logo.jpg'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import * as actions from '../store/actions/auth'

const { Header, Content, Footer } = Layout;

class SecondLayout extends React.Component {
  render() {
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
          
           <Menu.Item key="0" disabled="true"> 
              <img src = {logo} alt="stonks" width="200" height="57"/>
            </Menu.Item>
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



          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content">{this.props.children}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
      </Layout>
    );

  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(actions.logout())
  }
};



export default connect(null, mapDispatchToProps)(SecondLayout);
