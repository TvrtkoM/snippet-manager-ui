import axios from 'axios';
import { FC, useState, useEffect, useReducer } from 'react';
import Router from './Router';
import UserContext, {IUserContext} from './UserContext';
import AuthReducer from './components/auth/AuthReducer';

const App: FC = () => {
  const [user, dispatchUserAction] = useReducer<typeof AuthReducer>(AuthReducer, { id: '', loading: true });
  const [userContext, setUserContext] = useState<IUserContext>(null);

  const getUser = async () => {
    try {
      dispatchUserAction({ type: 'wait' });
      const id = await axios.get<string | null>(`${process.env['API_URL']}/auth/who`);
      if (id.data) {
        dispatchUserAction({ type: 'login', data: { id: id.data } })
      } else {
        dispatchUserAction({ type: 'logout' });
      }
    } catch (e) {
      dispatchUserAction({ type: 'error', data: { errorMessage: e } });
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user.id === '') {
      return setUserContext(null);
    }
    setUserContext({ id: user.id });
  }, [user]);

  return (
    <>
        <UserContext.Provider value={userContext}>
          <Router getUser={getUser} />
        </UserContext.Provider>
      {user.loading === true && <div className="overlay"></div>}
    </>
  );
}

export default App;
