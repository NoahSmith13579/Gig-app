import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LogoutButton: React.FC = () => {
    const { login, logout } = useContext(AuthContext);

    const logoutSuccess = () => console.log('logged out');

    return <button onClick={() => logout()}>Sign Out</button>;
};

export default LogoutButton;
