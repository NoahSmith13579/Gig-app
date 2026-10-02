import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LogoutButton: React.FC = () => {
  const { logout, authState } = useContext(AuthContext);
  const isAnonymous = authState.isAnonymous;

  const handleLogout = () => {
    // If user is in anonymous mode, clear the local storage projects
    logout(isAnonymous);
  };

  return (
    <button onClick={handleLogout} style={{ color: 'black' }}>
      Sign Out
    </button>
  );
};

export default LogoutButton;
