import { AxiosError } from "axios";
import useSWR from "swr";
import { House } from "../types";
import { fetcher } from "../utils/fetcher";

export const useHouses = () => {
  const { error, data, ...swrResult } = useSWR<House[] | null, AxiosError>(
    "/houses",
    {
      fetcher: (url) => fetcher(url).then(({ houses }) => houses),
    },
  );
  if (error) {
    throw error;
  }
  return { houses: data, ...swrResult };
};
