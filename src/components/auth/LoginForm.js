import React, { useState } from 'react';
import { KeyOutlined, MailOutlined } from '@ant-design/icons';

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
          <div className="row">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="text"
              placeholder="email@gmail.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="*****"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

        </fieldset>
        <button
          form="myForm"
          key="submit"
          type="submit"
        >Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
