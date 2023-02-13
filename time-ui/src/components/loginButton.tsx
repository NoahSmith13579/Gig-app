import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginButton: React.FC = () => {
  const { login } = useAuth();

  return (
    <div>
      <button onClick={() => login()}>Log-in.</button>
    </div>
  );
};

export default LoginButton;
