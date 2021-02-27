import axios from 'axios';
import { FC, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import UserContext from '../../UserContext';

const Navbar: FC<{onPathChange: (p: string) => void}> = ({ onPathChange }) => {
  const user = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen((loc) => {
      onPathChange(loc.pathname);
    });
    return unlisten;
  }, [history]);

  const logout = async () => {
    try {
      await axios.get(`${process.env['API_URL']}/auth/logout`);
      history.push('/');
    } catch (e) {
      console.log(e);
    }
  }

  const renderAuthButtons = () => {
    if (user == null) {
      return (
        <>
          <li className="nav-item">
            <Link to="/login" className="nav-link">
              Log in
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </li>
        </>
      );
    }
    return <li className="nav-item">
      <Link to="/" className="btn btn-primary" onClick={() => logout()}>
        Log out
      </Link>
    </li>;
  }

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark bg-gradient mb-2">
      <Link to="/" className="navbar-brand">
        Snippet manager
      </Link>
      <ul className="navbar-nav">
        {renderAuthButtons()}
      </ul>
    </nav>
  );
}

export default Navbar;
