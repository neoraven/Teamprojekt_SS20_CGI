import React from 'react'
import { Link } from 'react-router-dom';
//import './Landingpage.css';
import logo from '../stonks_logo_small.svg'



class Landingpage extends React.Component {


    render() {
        return (
            <div className='content'>
                <div style={{ marginBottom: 20 }}>
                    <center>
                        <img src={logo} width="20%" height="20%" />
                    </center>
                </div>
                <div className='text' style={{ textAlign: "justify" }}>
                    <center><p><b>Welcome to our App</b></p></center>
                    <p>With us you are able to get informations about any company that is listed in the S&P 500 index. You are also able to create your own portfolio of stocks based on realtime prices. Our newest feature will help you to find stocks that you like. You can input your investing preferences and the app will make stock recommendations based on your individual ideas.</p>
                    <p>Since you wont be able to do anything around here without an account, why dont you go ahead and <Link to='/signup/'>sign up?</Link></p>
                    <p>Already have an account? Great! Just Log In <Link to='/login/'>here.</Link></p>
                </div>
            </div>
        )
    }
}
export default Landingpage;