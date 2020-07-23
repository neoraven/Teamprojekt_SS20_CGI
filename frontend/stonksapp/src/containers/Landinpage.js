import React from 'react'
import { Link } from 'react-router-dom';

class Landingpage extends React.Component {
    render() {
        return (
            <div>
                <p>Welcome to our App. When I am less tired a decent Welcome & Marketing Text will show up here.</p>
                <p>Since you wont be able to do anything around here without an account, why dont you go ahead and <Link to ='/signup/'>sign up?</Link></p>
                <p>Already have an account? Great! Just Log In <Link to ='/login/'>here.</Link></p>




            </div>
        )
    }
}
export default Landingpage;