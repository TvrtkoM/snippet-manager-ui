import axios from 'axios';
import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { LoginFormData } from '../models';
import Message from '../misc/Message';
import { MessageType } from '../models';

const Login: FC<{ onSubmit: () => void, message?: string }> = ({ onSubmit, message }) => {
  const [userData, setUserData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<{ message: string; type: MessageType }>();

  const history = useHistory();

  useEffect(() => {
    if (isValid()) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [userData]);

  function isValid(): boolean {
    const { email, password } = userData;
    if (!(email && password)) {
      return false;
    }
    return true;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await axios.post(`${process.env['API_URL']}/auth/login/`, userData);

      onSubmit();
      history.push('/');
    } catch (err) {
      if (err.response.data.errorMessage) {
        setErrorMessage({ message: err.response.data.errorMessage, type: 'danger' });
      } else {
        setErrorMessage({ message: 'Unknown error occured.', type: 'danger' });
      }
    }
  }

  function renderMessage() {
    const m = message || errorMessage?.message;
    const type = errorMessage?.type || 'info';
    if (m == null) {
      return;
    }
    return <Message message={m} type={type} />;
  }

  function change(e: ChangeEvent<HTMLInputElement>, field: keyof LoginFormData) {
    setUserData((prevState) => {
      return { ...prevState, [field]: e.target.value };
    });
  }

  return (
    <>
      <section className="container pt-4">
        <div className="row justify-content-center">
          <form id="registerForm" className="col-12 col-md-6 col-xl-4" onSubmit={submit}>
            {renderMessage()}
            <h3 className="mb-3">Log in</h3>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
              <input
                type="email"
                value={userData.email}
                id="email"
                className="form-control"
                onChange={(e) => change(e, 'email')}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                value={userData.password}
                id="password"
                className="form-control"
                onChange={(e) => change(e, 'password')}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitDisabled}>
              Submit
            </button>
            <p className="mt-3">
              Do not have an account? <Link to="/register">Register</Link> instead.
            </p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Login;
