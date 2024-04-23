import { BigNumber } from "ethers";

export const LS_FARMS_LIST_KEY = "abracadabraFarmList";
export const LS_USER_POSITION_KEY = "abracadabraUserPositions";
export const LS_CAULDRONS_LIST_KEY = "abracadabraCauldronsList";
export const LS_BENTOBOX_DATA_KEY = "abracadabraBentoBoxData";
export const LS_SPELL_STAKE_KEY = "abracadabraSpellStakeData";

export const bigintStringify = (payload: any) =>
  JSON.stringify(payload, (key, value) =>
    typeof value === "bigint"
      ? { type: "bigint", value: value.toString() }
      : value
  );

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

export const jsonBigIntTransform = (item: any) => {
  Object.keys(item).forEach((key) => {
    if (typeof item[key] === "object" && item[key] !== null) {
      if (item[key].type === "bigint") {
        item[key] = BigInt(item[key].value);
      } else {
        jsonBigIntTransform(item[key]);
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

export const getAndParseBentoBoxData = () => {
  const bentoBoxData = localStorage.getItem(LS_BENTOBOX_DATA_KEY);

  if (!bentoBoxData) {
    return {
      isCreated: false,
      data: [],
    };
  }

  const farmList = JSON.parse(bentoBoxData);
  const data = farmList
    .map((item: any) => jsonBigNumberTransform(item))
    .map((item: any) => jsonBigIntTransform(item));

  return {
    isCreated: true,
    data: data,
  };
};

export const getAndParseSpellStakeData = () => {
  const spellStakeData = localStorage.getItem(LS_SPELL_STAKE_KEY);

  if (!spellStakeData) {
    return {
      isCreated: false,
      data: [],
    };
  }

  const farmList = JSON.parse(spellStakeData);
  const data = farmList.map((item: any) => jsonBigIntTransform(item));

  return {
    isCreated: true,
    data: data,
  };
};
