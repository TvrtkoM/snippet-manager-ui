import {Reducer} from "react";

export interface UserState {
  id: string;
  loading?: boolean;
  errorMessage?: string;
}

export interface Action {
  type: 'login' | 'logout' | 'wait' | 'error';
  data?: {[key: string]: unknown};
}

const AuthReducer: Reducer<UserState, Action> = (state: UserState, action: Action) => {
  if (action.type === 'logout') {
    return { id: '', loading: false };
  }
  if (action.type === 'wait') {
    return { ...state, loading: true };
  }
  if (action.type === 'login' && action.data) {
    return { ...state, id: action.data['id'] as string, loading: false };
  }
  if (action.type === 'error' && action.data) {
    return { ...state, errorMessage: action.data['errorMessage'] as string };
  }
  throw 'Invalid Action';
};

export default AuthReducer;
