import { AxiosError } from "axios";
import useSWR from "swr";
import { v4 as uuidv4 } from "uuid";
import { House, NewHouseData } from "../types";
import { fetcher, getAxiosInstance } from "../utils/fetcher";

export const useHouses = ({
  revalidateOnMount = true,
}: {
  revalidateOnMount?: boolean;
} = {}) => {
  const housesEndpoint = "/houses";
  const { data: houses, error, mutate, revalidate } = useSWR<
    House[],
    AxiosError
  >(housesEndpoint, {
    fetcher: (url) => fetcher(url).then(({ houses }) => houses),
    initialData: [],
    revalidateOnMount,
  });

  const createHouse = async (newHouseData: NewHouseData) =>
    getAxiosInstance().post(`${housesEndpoint}/house`, {
      name: newHouseData.name,
    });

  const handleHouseCreation = async (
    newHouseData: NewHouseData,
  ): Promise<void> => {
    const temporaryHouseId = uuidv4();

    const newHouse = {
      name: newHouseData.name,
      houseId: temporaryHouseId,
    };

    let newHouseList;
    if (houses?.length) {
      newHouseList = [...houses, newHouse];
    } else {
      newHouseList = [newHouse];
    }

    await mutate(newHouseList, false);
    await createHouse(newHouseData);
    await revalidate();
  };

  return { houses, error, handleHouseCreation };
};
