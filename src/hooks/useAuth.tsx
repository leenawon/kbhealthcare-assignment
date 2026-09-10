import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { setAccessTokenGetter } from '../api/client';
import { authApi } from '../api/auth';
import type { AuthTokenResponse } from '../types/api';

// 실제 서버에서는 httpOnly 쿠키로 set-cookie 응답을 내려주지만,
// mock 환경에서는 document.cookie로 동일한 동작을 시뮬레이션합니다.
const REFRESH_COOKIE = 'kb_refresh_token';

const refreshCookie = {
  get: (): string | null => {
    const match = document.cookie.match(new RegExp(`(?:^|; )${REFRESH_COOKIE}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  },
  set: (token: string) => {
    document.cookie = `${REFRESH_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Strict`;
  },
  remove: () => {
    document.cookie = `${REFRESH_COOKIE}=; path=/; max-age=0; SameSite=Strict`;
  },
};

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (tokens: AuthTokenResponse) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useLayoutEffect로 동기화해야 TanStack Query의 useEffect(쿼리 발사)보다
  // 먼저 실행되어 accessToken race condition을 방지합니다.
  useLayoutEffect(() => {
    setAccessTokenGetter(() => accessToken);
  }, [accessToken]);

  // 앱 최초 진입 시 refresh token 쿠키가 있으면 세션을 복구합니다.
  useEffect(() => {
    if (refreshCookie.get() === null) {
      setIsLoading(false);
      return;
    }

    authApi
      .refresh()
      .then((tokens) => {
        setAccessToken(tokens.accessToken);
        refreshCookie.set(tokens.refreshToken);
      })
      .catch(() => {
        refreshCookie.remove();
      })
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = (tokens: AuthTokenResponse) => {
    setAccessToken(tokens.accessToken);
    refreshCookie.set(tokens.refreshToken);
  };

  const signOut = () => {
    setAccessToken(null);
    refreshCookie.remove();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: accessToken !== null, isLoading, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
