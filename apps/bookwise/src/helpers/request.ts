import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const env = import.meta.env;

if (env.DEV) {
  axios.defaults.baseURL = 'http://localhost:9999';
} else {
  axios.defaults.baseURL = 'http://localhost:9988';
}

export const createInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  return axios.create(config);
}

export const get = (url, config?: AxiosRequestConfig) => {
  const _instance = createInstance(config);

  return _instance.get(url, config).then((res: AxiosResponse) => {
    return res;
  });
}

export const request = {
  get
}