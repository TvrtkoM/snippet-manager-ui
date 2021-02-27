import axios from 'axios';
import { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { RegisterFormData, MessageType } from '../models';
import Message from '../misc/Message';

const Register: FC<{ onSubmit: () => void }> = ({ onSubmit }) => {
  const [message, setMessage] = useState<{ message: string; type: MessageType }>();
  const [userData, setUserData] = useState<RegisterFormData>({
    email: '',
    password: '',
    passwordVerify: '',
  });

  const [submitDisabled, setSubmitDisabled] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (isValid()) {
      setSubmitDisabled(false);
    } else {
      setSubmitDisabled(true);
    }
  }, [userData]);

  function isValid(): boolean {
    const { email, password, passwordVerify } = userData;
    if (!(email && password && passwordVerify)) {
      return false;
    }
    if (password !== passwordVerify) {
      return false;
    }
    return true;
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    try {
      await axios.post(`${process.env['API_URL']}/auth/`, userData);
      history.push('/login');
      onSubmit();
    } catch (err) {
      if (err?.response?.data?.errorMessage) {
        setMessage({ message: err.response.data.errorMessage, type: 'danger' });
      } else {
        setMessage({ message: 'Unknown error occured.', type: 'danger' });
      }
    }
  }

  function change(e: ChangeEvent<HTMLInputElement>, field: keyof RegisterFormData) {
    setUserData((prevState) => {
      return { ...prevState, [field]: e.target.value };
    });
  }

  function renderMessage() {
    if (message == null) {
      return;
    }
    return <Message message={message.message} type={message.type} />;
  }

  return (
    <>
      <section className="container pt-4">
        <div className="row justify-content-center">
          <form id="registerForm" className="col-12 col-md-6 col-xl-4" onSubmit={submit}>
            {renderMessage()}
            <h3 className="mb-3">Register new account</h3>
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
            <div className="mb-3">
              <label htmlFor="passwordVerify" className="form-label">
                Verify Password
              </label>
              <input
                type="password"
                value={userData.passwordVerify}
                id="passwordVerify"
                className="form-control"
                onChange={(e) => change(e, 'passwordVerify')}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={submitDisabled}>
              Submit
            </button>
            <p className="mt-3">Already have an account? <Link to='/login'>Log in</Link> instead.</p>
          </form>
        </div>
      </section>
    </>
  );
};

export default Register;
