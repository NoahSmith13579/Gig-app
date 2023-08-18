import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginButton: React.FC = () => {
  const { login } = useAuth();

  return <button onClick={() => login()}>Log-in</button>;
};

export default LoginButton;
