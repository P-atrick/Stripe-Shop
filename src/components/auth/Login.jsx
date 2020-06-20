import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';

const Login = () => (
  <div>
    <section className='loginSection'>
      <LoginForm />
    </section>

    <section className='registerSection'>
      <div className='formTitle'>Need an account?</div>
      <div className='registerButtonContainer'>
        <Link
          className='registerButtonContainer'
          to='/register'
        >
          Register
        </Link>
      </div>
    </section>
  </div>
);

export default Login;
