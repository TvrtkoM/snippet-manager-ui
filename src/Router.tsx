import { FC, useState } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Home from './components/home/Home';
import Navbar from './components/misc/Navbar';

const Router: FC<{ getUser: () => void }> = ({ getUser }) => {
  const [userMessage, setUserMessage] = useState<string[]>([]);

  const pathChanged = (p: string) => {
    if (p === '/') {
      getUser();
    }
    setUserMessage([...userMessage.slice(-1)]);
  };

  return (
    <HashRouter>
      <Navbar onPathChange={pathChanged} />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/login">
          <Login onSubmit={() => {}} message={userMessage[0]} />
        </Route>
        <Route path="/register">
          <Register onSubmit={() => setUserMessage([...userMessage, 'Welcome. You can now log in here.'])} />
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default Router;
