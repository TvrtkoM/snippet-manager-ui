export type MessageType = 'warning' | 'info' | 'danger';

export interface ISnippet {
  title?: string;
  description?: string;
  code?: string;
  _id: string;
  createdAt: string;
}

export type SnippetFormData = Partial<ISnippet>;

export interface IUser {
  _id: string;
  createdAt: string;
  email: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  passwordVerify: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

