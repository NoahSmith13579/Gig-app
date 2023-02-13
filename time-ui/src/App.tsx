import React from 'react';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';

import './App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
