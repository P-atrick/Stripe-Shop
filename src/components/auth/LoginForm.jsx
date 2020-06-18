import React, { useState } from 'react';

const LoginForm = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
  }

  return (
    <div>
      <form
        id="myForm"
        onSubmit={handleSubmit}
      >
        <fieldset>
          <div className='formTitle'>Login</div>

          <div className='formItem'>
            <label
              htmlFor="email"
            >Email Address</label>
            <input
              id="email"
              type="text"
              placeholder="Email address"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className='formItem'>
            <label
              htmlFor="password"
            >Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

        <button
          form="myForm"
          key="submit"
          type="submit"
        >Login
        </button>

        </fieldset>
      </form>
    </div>
  );
};

export default LoginForm;
