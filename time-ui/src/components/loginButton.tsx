import React, { useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { AuthContext, useAuth } from '../contexts/AuthContext';

const LoginButton: React.FC = () => {
    const { login, logout } = useAuth();

    return (
        <div>
            <button onClick={() => login()}>Log-in.</button>
        </div>
    );
};

export default LoginButton;
