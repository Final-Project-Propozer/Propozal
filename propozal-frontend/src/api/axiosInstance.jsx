import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",  // 백엔드 주소
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true  // 쿠키 포함 여부 (로그인 유지할 때 필요)
});

export default axiosInstance;
