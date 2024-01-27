export interface User {
  id?: string;
  email?: string;
  username: string;
  authorities: string[];
}

export interface UserFull extends User {
  password: string;
  confirmPassword: string;
  role: string;
}
