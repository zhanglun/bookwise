import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const env = import.meta.env;

if (env.DEV) {
  axios.defaults.baseURL = 'http://localhost:9999/api';
} else {
  axios.defaults.baseURL = 'http://localhost:9988/api';
}

export const createInstance = (config: AxiosRequestConfig): AxiosInstance => {
  return axios.create(config);
}

export const get = (url: string, config?: AxiosRequestConfig) => {
  const _instance = createInstance(config || {});

  return _instance.get(url, config).then((res: AxiosResponse) => {
    return res;
  });
}

export const post = (url: string, data: any, config?: AxiosRequestConfig) => {
  const _instance = createInstance(config || {});

  return _instance.post(url, data, config).then((res: AxiosResponse) => {
    return res;
  });
}

export const _delete = (url: string, config?: AxiosRequestConfig) => {
  const _instance = createInstance(config || {});

  return _instance.delete(url, config).then((res: AxiosResponse) => {
    return res;
  });
}

export const request = {
  get,
  post,
  delete: _delete
}