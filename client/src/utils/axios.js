import axios from "axios";

const instance = axios.create();

instance.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = window.localStorage.getItem("token");
  return config;
});

export default instance;
