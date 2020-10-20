export interface HouseFromDB {
  house_id: string;
  name: string;
}

export interface HouseForClient {
  houseId: HouseFromDB["house_id"];
  name: HouseFromDB["name"];
}

export interface NewHouseProperties {
  accountId: string;
  name: string;
}

export interface HouseForDBInsert {
  account_id: NewHouseProperties["accountId"];
  name: NewHouseProperties["name"];
}
