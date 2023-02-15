import React, { useEffect, useState } from 'react';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';

import './App.css';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const onPageLoad = () => {
      setLoading(false);
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      onPageLoad();
    } else {
      window.addEventListener('load', onPageLoad);
      // Remove the event listener when component unmounts
      return () => window.removeEventListener('load', onPageLoad);
    }
  }, []);
  return loading ? (
    <div className='spinnerPageLoad'>
      <Spinner />
    </div>
  ) : (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
};

export default App;
