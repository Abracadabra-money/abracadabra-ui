import { BigNumber } from "ethers";

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

  const data = cauldronsList.map((item: any) => {
    const keys = Object.keys(item);
    const configIndex = keys.indexOf("config");
    keys.splice(configIndex, 1);
    return jsonBigNumberTransform(item);
  });

  return {
    isCreated: true,
    data: data,
  };
};
