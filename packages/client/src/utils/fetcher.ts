import Axios, { AxiosResponse } from "axios";

export const getAxiosInstance = () =>
  Axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL,
    withCredentials: true,
  });

export const fetcher = async <T = any>(url: string) =>
  getAxiosInstance()
    .get<any, AxiosResponse<T>>(url)
    .then((res) => res.data);
