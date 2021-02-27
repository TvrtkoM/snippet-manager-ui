import { createContext } from 'react';

export type IUserContext = null | {
  id: string;
};

const UserContext = createContext<IUserContext>(null);

export default UserContext;
