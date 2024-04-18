import { BigNumber } from "ethers";

export const LS_FARMS_LIST_KEY = "abracadabraFarmList";
export const LS_USER_POSITION_KEY = "abracadabraUserPositions";
export const LS_CAULDRONS_LIST_KEY = "abracadabraCauldronsList";

export const jsonBigNumberTransform = (item: any) => {
  Object.keys(item).forEach((key) => {
    if (typeof item[key] === "object" && item[key] !== null) {
      if (item[key].type === "BigNumber") {
        item[key] = BigNumber.from(item[key]);
      } else {
        jsonBigNumberTransform(item[key]);
      }
    }
  });

  return item;
};

export const getAndParseCaldronsList = () => {
  const lsCauldronsList = localStorage.getItem(LS_CAULDRONS_LIST_KEY);

  if (!lsCauldronsList) {
    return {
      isCreated: false,
      data: [],
    };
  }

  const cauldronsList = JSON.parse(lsCauldronsList);
  const data = cauldronsList.map((item: any) => jsonBigNumberTransform(item));

  return {
    isCreated: true,
    data: data,
  };
};

export const getAndParseUserPositions = () => {
  const lsUserPositions = localStorage.getItem(LS_USER_POSITION_KEY);

  if (!lsUserPositions) {
    return {
      isCreated: false,
      data: [],
    };
  }

  const userPositions = JSON.parse(lsUserPositions);
  const data = userPositions.map((item: any) => jsonBigNumberTransform(item));

  return {
    isCreated: true,
    data: data,
  };
};

export const getAndParseFarmsList = () => {
  const lsFarmList = localStorage.getItem(LS_FARMS_LIST_KEY);

  if (!lsFarmList) {
    return {
      isCreated: false,
      data: [],
    };
  }

  const farmList = JSON.parse(lsFarmList);
  const data = farmList.map((item: any) => jsonBigNumberTransform(item));

  return {
    isCreated: true,
    data: data,
  };
};
