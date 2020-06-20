import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import Auth from '../../lib/Auth';
import { AppContext } from '../../Context';

const RegisterForm = () => {
  const [state, setState] = useContext(AppContext);
  const [form, setForm] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    Axios
      .post('/api/register', {
        form,
      })
      .then((res) => {
        Auth.setToken(res.data.token);
        setState({
          ...state,
          isAuthenticated: true,
        });
        history.push('/');
      })
      .catch((err) => setError(err.response.data.error));
  };

  return (
    <div>
      <form
        id="myForm"
        onSubmit={handleSubmit}
      >
        <fieldset>
          <div className='formTitle'>Register</div>

          <div className="formItem">
            <label
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              id="email"
              type="text"
              placeholder="Email address"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="formItem">
            <label
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="formItem">
            <label
              htmlFor="passwordConfirmation"
            >
              Password Confirmation
            </label>
            <input
              id="passwordConfirmation"
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, passwordConfirmation: e.target.value })}
            />
          </div>

        </fieldset>

        {
          error
            ? error.message : null
        }

        <button
          form="myForm"
          key="submit"
          type="submit"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
