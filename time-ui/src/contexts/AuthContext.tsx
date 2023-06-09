import React from 'react';
import { doRequest } from '../helpers/apiHelper';
import makeLog from '../helpers/makeLog';
import useLocalStorage from '../helpers/useLocalStorage';
import { decodeJwt } from '../helpers/tokenHelper';
import useGoogleClient from '../helpers/useGoogleClient';
import { toast } from 'react-toastify';

var GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID as string;

interface AuthState {
  userid: string | null;
  email: string | null;
  name: string | null;
  loggedIn: boolean;
  token: string | null;
}
interface Token {
  email: string;
  exp: number;
  iat: number;
  name: string;
  sub: string;
}

interface AuthContextContainer {
  authState: AuthState;
  login(): Promise<string>;
  logout(): void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const getUnauthstate = (): AuthState => ({
  userid: null,
  loggedIn: false,
  email: null,
  name: null,
  token: null,
});

const AuthContext = React.createContext<AuthContextContainer>({
  authState: getUnauthstate(),
  login: async () => 'default',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
});

const REFRESH_TIMEOUT = 2 * 60 * 1000;

const useAuth = (): AuthContextContainer => React.useContext(AuthContext);

const parseJwt = (token: string): Token => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
};

const getAuthHeaders = (
  token: string,
  old: Headers | undefined = undefined
) => {
  const heads = old ?? new Headers();
  debug(`getAuthHeaders ${token}`);
  heads.set('Authorization', `Bearer ${token}`);

  return heads;
};

const { log, debug, error } = makeLog('auth');

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useLocalStorage<AuthState>(
    'authState',
    getUnauthstate()
  );

  React.useEffect(() => {
    debug(`${JSON.stringify(authState)}`);
  }, [authState]);

  React.useEffect(() => {
    log(`Queued refresh for ${REFRESH_TIMEOUT}ms`);
    if (authState.token) {
      const { exp } = parseJwt(authState.token);
      if (Date.now() / 1000 > exp) {
        setAuthState(getUnauthstate());
      }
    }
    let handle = setInterval(() => {
      if (handle === -1) return; // prevent noop. Cheap unsubscribe cop-out
      handleRefresh();
    }, REFRESH_TIMEOUT) as unknown as number;
    return () => {
      clearTimeout(handle);
      handle = -1;
    };
  }, []);
  //TODO: Rewrite. Low Priority
  const handleRefresh = async () => {
    if (!authState.loggedIn || !authState.token) {
      return;
    }

    debug('Refreshing token');
    debug(JSON.stringify(authState));

    const headers = getAuthHeaders(authState.token);
    let resp;

    try {
      resp = await doRequest<string>('/auth/renew', {
        headers,
        method: 'POST',
      });
    } catch (err) {
      error(err as string);
      toast.error(
        'Unable to stay logged in. Please re-enter your credentials.',
        { toastId: 'doRequestError' }
      );
      logout();
      return;
    }

    const newToken = resp.content;
    setAuthState({
      ...authState,
      token: newToken,
      loggedIn: true,
    });
    debug('Refreshed token, ' + newToken);
  };

  const handleLogin = async (creds: any) => {
    log('Getting user-info...');

    const response = await doRequest<string>('/auth/google', {
      body: JSON.stringify(creds),
      method: 'POST',
    });

    if (!response.success || !response.content) {
      console.error('Get userinfo failed');
      setAuthState(getUnauthstate());
      return response.message;
    }

    const content = response.content;
    log('Server said: ' + content);

    const payload = decodeJwt(content as string);
    log('payload is: ' + JSON.stringify(payload));

    const { sub: userid, name, email } = payload;

    log('Logged in as ' + name);
    const newState: AuthState = {
      ...authState,
      userid,
      name,
      email,
      token: content,
      loggedIn: true,
    };
    setAuthState(newState);
    return 'Success!';
  };

  const doGoogleLogin = (input: any) => {
    log('logging in');
    handleLogin(input.access_token);
  };

  useGoogleClient(GOOGLE_CLIENT_ID, doGoogleLogin);

  const login = async (): Promise<string> => {
    (window as any).gclient.requestAccessToken({});
    return '';
  };

  const logout = () => {
    setAuthState(getUnauthstate());
    toast.error('Logged out...', { toastId: 'LoggedOut' });
  };

  return (
    <AuthContext.Provider value={{ authState, login: login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth, getUnauthstate, AuthContext, AuthProvider, getAuthHeaders };
export type { AuthState, AuthContextContainer };
