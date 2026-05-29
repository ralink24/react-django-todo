import { useState, useContext } from 'react'
import AuthContext from './AuthContext'

import './App.css'

function LoginPage(){
    const { loginUser } = useContext(AuthContext);
    
    return (
    <main>
      <h1>Login Page</h1>
      <form onSubmit={loginUser}>
        <input
            name="username"
            id="username-input"
            type="text"
            placeholder="Username"
        />
        <input
            name="password"
            id="password-input"
            type="password"
            placeholder="Password"
        />
        <input type="submit"/>
      </form>
    </main>
  );
}

export default LoginPage