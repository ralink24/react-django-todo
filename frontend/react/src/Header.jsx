import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from './AuthContext'

const Header = () => {
    let { user, logoutUser } = useContext(AuthContext)

    let authlink;
    if (user) {
        authlink = <p onClick={logoutUser}>Logout</p>
    } else {
        authlink = <Link to="/login">Login</Link>
    }

    let greeting = null;
    if (user) {
        greeting = <p>Hello {user.username}!</p>
    }

    return (
        <div>
            <Link to="/">Home</Link>
            <span> | </span>
            {authlink}
            {greeting}
        </div>
    );
}

export default Header