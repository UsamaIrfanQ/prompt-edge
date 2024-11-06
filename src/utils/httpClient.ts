import axios, { AxiosRequestConfig } from 'axios';

const Axios = axios.create({
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});
Axios.interceptors.request.use(async (config) => {
  // @ts-ignore
  //   config.headers = {
  //     ...config.headers,
  //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //   };
  return config;
});

// Change response data/error here
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response && error.response.status === 401) ||
      (error.response && error.response.status === 403) ||
      (error.response && error.response.data.message === 'Unauthorized')
    ) {
      //   Cookies.remove(AUTH_TOKEN_KEY);
    }
    return Promise.reject(error);
  },
);

export class HttpClient {
  static async get<T>(
    url: string,
    params?: unknown,
    options?: AxiosRequestConfig<T>,
  ) {
    const response = await Axios.get<T>(url, { params, ...options });
    return response.data;
  }

  static async post<T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig<T>,
  ) {
    const response = await Axios.post<T>(url, data, options);
    return response.data;
  }

  static async put<T>(
    url: string,
    data: unknown,
    options?: AxiosRequestConfig<T>,
  ) {
    const response = await Axios.put<T>(url, data, options);
    return response.data;
  }

  static async delete<T>(url: string, options?: AxiosRequestConfig<T>) {
    const response = await Axios.delete<T>(url, options);
    return response.data;
  }
}
