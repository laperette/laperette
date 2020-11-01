import Axios, { AxiosResponse } from "axios";

export const axios = Axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true,
});

export const fetcher = <T = any>(url: string) =>
  axios.get<any, AxiosResponse<T>>(url).then((res) => res.data);
