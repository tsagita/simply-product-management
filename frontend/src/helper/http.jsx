import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

http.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("userToken");
    console.log(userToken);
    if (config.url === "login") {
      return config;
    }

    if (!userToken) {
      window.location.href = "/";
    }

    config.headers.Authorization = `Bearer ${userToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
