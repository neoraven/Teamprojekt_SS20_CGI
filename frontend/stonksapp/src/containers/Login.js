import React from 'react'

import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux'
import * as actions from '../store/actions/auth'
//import { Router, Route, Link, BrowserRouter} from 'react-router-dom';


class NormalLoginForm extends React.Component {

  onFinish = values => {
    console.log(values.username, values.password)
    this.props.onAuth(values.username, values.password);
    this.props.history.push('/')
  };

  render() {
    console.log(this.props);
    return (
      <div>

        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>


          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button> Or
            <NavLink
              to='/signup/'> signup
            </NavLink>
          </Form.Item>
        </Form>

      </div>

    )
  }
};



const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (username, password) => { dispatch(actions.authLogin(username, password)) }
  }
};

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error
  }
};



export default connect(mapStateToProps, mapDispatchToProps)(NormalLoginForm);
