/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

const useGoogleClient = (
  clientId: string,
  successCallback: (x: any) => void,
  errorCallback: ((x: any) => void) | undefined = undefined
) => {
  React.useEffect(() => {
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://accounts.google.com/gsi/client';
    scriptTag.async = true;
    scriptTag.defer = true;
    scriptTag.onerror = () => {
      alert('Could not initialize Gsi client');
    };

    scriptTag.onload = () => {
      (window as any).gclient = (
        window as any
      ).google?.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid profile email',
        callback: (resp: any) => {
          if (!resp.access_token) {
            alert('No access token');
            errorCallback && errorCallback(resp);
            return;
          }

          successCallback(resp);
        },
      });
    };

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);
};

export default useGoogleClient;
