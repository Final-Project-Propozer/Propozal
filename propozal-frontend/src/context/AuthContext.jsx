import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const userRaw = localStorage.getItem("user");
    const user = userRaw ? JSON.parse(userRaw) : null;
    return accessToken ? { accessToken, refreshToken, user, role: user?.role } : null;
  });

  // 동시 401 시 리프레시 한 번만 수행하도록 락 & 큐
  const isRefreshingRef = useRef(false);
  const refreshWaitersRef = useRef([]);

  const setTokens = (accessToken, refreshToken) => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    axiosInstance.defaults.headers.Authorization = accessToken ? `Bearer ${accessToken}` : undefined;
  };

  useEffect(() => {
    if (auth?.accessToken) {
      axiosInstance.defaults.headers.Authorization = `Bearer ${auth.accessToken}`;
    } else {
      delete axiosInstance.defaults.headers.Authorization;
    }
  }, [auth?.accessToken]);

  const login = (accessToken, refreshToken, user) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken ?? "");
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ accessToken, refreshToken, user, role: user?.role });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAuth(null);
    delete axiosInstance.defaults.headers.Authorization;
  };

  // 액세스 토큰 갱신
  const refreshAccessToken = async () => {
    if (isRefreshingRef.current) {
      // 진행중이면 Promise를 큐에 넣고 결과 기다리기
      return new Promise((resolve, reject) => {
        refreshWaitersRef.current.push({ resolve, reject });
      });
    }
    isRefreshingRef.current = true;
    try {
      const currentRefresh = localStorage.getItem("refreshToken");
      if (!currentRefresh) throw new Error("NO_REFRESH_TOKEN");

      const res = await axiosInstance.post("/auth/refresh", { refreshToken: currentRefresh });
      const { accessToken: newAccess, refreshToken: newRefresh } = res.data || {};
      if (!newAccess) throw new Error("NO_ACCESS_IN_REFRESH_RESPONSE");

      setTokens(newAccess, newRefresh ?? currentRefresh);
      setAuth(prev => prev
        ? { ...prev, accessToken: newAccess, refreshToken: newRefresh ?? currentRefresh }
        : { accessToken: newAccess, refreshToken: newRefresh ?? currentRefresh, user: null, role: null });

      refreshWaitersRef.current.forEach(w => w.resolve(newAccess));
      refreshWaitersRef.current = [];
      return newAccess;
    } catch (e) {
      refreshWaitersRef.current.forEach(w => w.reject(e));
      refreshWaitersRef.current = [];
      logout(); // 리프레시 실패 시 세션 종료
      throw e;
    } finally {
      isRefreshingRef.current = false;
    }
  };

  const value = useMemo(() => ({
    auth, login, logout, refreshAccessToken
  }), [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}