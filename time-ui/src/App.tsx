import React from 'react';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './App.css';

const App: React.FC = () => {
    return (
        <AuthProvider>
            {/* <GoogleOAuthProvider
                clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID!}
            > */}
                <Routes />
            {/* </GoogleOAuthProvider> */}
        </AuthProvider>
    );
};

export default App;
