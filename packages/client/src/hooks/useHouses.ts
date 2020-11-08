import Axios from "axios";
import useSWR from "swr";
import { House, NewHouseData } from "../types";

export const useHouses = () => {
  const housesEndpoint = `${process.env.REACT_APP_SERVER_URL}/houses`;

  const getHouses = async (): Promise<House[]> => {
    const response = await Axios.get(housesEndpoint, {
      withCredentials: true,
    });
    return response.data.houses;
  };

  const createHouse = async (newHouseData: NewHouseData) => {
    await Axios(`${housesEndpoint}/house`, {
      method: "post",
      data: {
        name: newHouseData.name,
      },
      withCredentials: true,
    });
  };

  const { data: houses, error } = useSWR<House[] | null>(
    housesEndpoint,
    getHouses,
  );
};
