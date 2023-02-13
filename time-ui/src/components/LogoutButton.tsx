import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LogoutButton: React.FC = () => {
  const { logout } = useContext(AuthContext);

  return <button onClick={() => logout()}>Sign Out</button>;
};

export default LogoutButton;
