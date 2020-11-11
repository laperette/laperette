import { AxiosError } from "axios";
import useSWR, { ConfigInterface } from "swr";
import { User } from "../utils/authClient";

export const useCurrentAccount = (
  config: ConfigInterface<User | null, AxiosError>,
) => useSWR<User | null, AxiosError>("/accounts/current", config);
