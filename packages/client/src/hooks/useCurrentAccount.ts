import { AxiosError } from "axios";
import useSWR, { ConfigInterface } from "swr";
import { User } from "../utils/authClient";
import { fetcher } from "../utils/fetcher";

export const useCurrentAccount = (
  config: ConfigInterface<User | null, AxiosError>,
) => {
  const { data: user, ...swr } = useSWR<User | null, AxiosError>(
    "/accounts/current",
    {
      ...config,
      fetcher: (url) => fetcher(url).then(({ user }) => user),
    },
  );
  return { user, ...swr };
};
