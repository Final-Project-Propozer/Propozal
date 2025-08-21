import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

let isRetrying = false;

axiosInstance.interceptors.response.use(
  res => res,
  async (error) => {
    const status = error?.response?.status;
    const original = error?.config;

    if (status === 401 && !original?._retry) {
      original._retry = true;

      if (isRetrying) {
        await new Promise(r => setTimeout(r, 250));
        return axiosInstance(original);
      }
      isRetrying = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("NO_REFRESH_TOKEN");

        const refreshRes = await axiosInstance.post("/auth/refresh", { refreshToken });
        const { accessToken: newAccess, refreshToken: newRefresh } = refreshRes.data || {};
        if (!newAccess) throw new Error("NO_ACCESS_IN_REFRESH_RESPONSE");

        localStorage.setItem("accessToken", newAccess);
        if (newRefresh) localStorage.setItem("refreshToken", newRefresh);

        original.headers = { ...(original.headers || {}), Authorization: `Bearer ${newAccess}` };
        return axiosInstance(original);
      } catch (e) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.replace("/login");
        return Promise.reject(e);
      } finally {
        isRetrying = false;
      }
    }

    if (status === 403) {
      window.location.replace("/forbidden");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;