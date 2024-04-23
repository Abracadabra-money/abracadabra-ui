import { BigNumber } from "ethers";

export const LS_FARMS_LIST_KEY = "abracadabraFarmList";
export const LS_USER_POSITION_KEY = "abracadabraUserPositions";
export const LS_CAULDRONS_LIST_KEY = "abracadabraCauldronsList";
export const LS_BENTOBOX_DATA_KEY = "abracadabraBentoBoxData";
export const LS_SPELL_STAKE_KEY = "abracadabraSpellStakeData";
export const LS_MAGIC_LVL_STAKE_KEY = "abracadabraMagicLvlStakeData";
export const LS_MAGIC_LVL_STAKE_CHART_KEY = "abracadabraMagicLvlChartData";
export const LS_MAGIC_KLP_STAKE_KEY = "abracadabraMagicKlpStakeData";
export const LS_MAGIC_GLP_STAKE_KEY = "abracadabraMagicGlpStakeData";
export const LS_MAGIC_GLP_STAKE_CHART_KEY = "abracadabraMagicGlpChartData";

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
    return { data: [], isCreated: false };
  }

  const cauldronsList = JSON.parse(lsCauldronsList);
  const data = cauldronsList.map((item: any) => jsonBigNumberTransform(item));

  return { data, isCreated: true };
};

export const getAndParseUserPositions = () => {
  const lsUserPositions = localStorage.getItem(LS_USER_POSITION_KEY);

  if (!lsUserPositions) {
    return { data: [], isCreated: false };
  }

  const userPositions = JSON.parse(lsUserPositions);
  const data = userPositions.map((item: any) => jsonBigNumberTransform(item));

  return { data, isCreated: true };
};

export const getAndParseFarmsList = () => {
  const lsFarmList = localStorage.getItem(LS_FARMS_LIST_KEY);

  if (!lsFarmList) {
    return { data: [], isCreated: false };
  }

  const farmList = JSON.parse(lsFarmList);
  const data = farmList.map((item: any) => jsonBigNumberTransform(item));

  return { data, isCreated: true };
};

export const getAndParseBentoBoxData = () => {
  const lsBentoBoxData = localStorage.getItem(LS_BENTOBOX_DATA_KEY);

  if (!lsBentoBoxData) {
    return { data: [], isCreated: false };
  }

  const bentoBoxData = JSON.parse(lsBentoBoxData);
  const data = bentoBoxData.map((item: any) => jsonBigIntTransform(item));

  return { data, isCreated: true };
};

export const getAndParseSpellStakeData = () => {
  const lsSpellStakeData = localStorage.getItem(LS_SPELL_STAKE_KEY);

  if (!lsSpellStakeData) {
    return { data: [], isCreated: false };
  }

  const spellStakeData = JSON.parse(lsSpellStakeData);
  const data = spellStakeData.map((item: any) => jsonBigIntTransform(item));

  return { data, isCreated: true };
};

export const getAndParseMagicLvlStakeData = () => {
  const lsMagicLvlStakeData = localStorage.getItem(LS_MAGIC_LVL_STAKE_KEY);
  const lsMagicLvlChartData = localStorage.getItem(
    LS_MAGIC_LVL_STAKE_CHART_KEY
  );

  if (!lsMagicLvlStakeData) {
    return {
      data: [],
      isCreated: false,
      chartData: null,
    };
  }

  const magicLvlStakeData = JSON.parse(lsMagicLvlStakeData);
  const chartData = JSON.parse(lsMagicLvlChartData || "null");
  const data = magicLvlStakeData.map((item: any) => jsonBigIntTransform(item));

  return {
    data,
    chartData,
    isCreated: true,
  };
};

export const getAndParseMagicKlpStakeData = () => {
  const lsMagicKlpStakeData = localStorage.getItem(LS_MAGIC_KLP_STAKE_KEY);

  if (!lsMagicKlpStakeData) {
    return {
      data: [],
      isCreated: false,
      chartData: null,
    };
  }

  const magicKlpStakeData = JSON.parse(lsMagicKlpStakeData);
  const data = magicKlpStakeData.map((item: any) => jsonBigIntTransform(item));

  return {
    data,
    isCreated: true,
  };
};

export const getAndParseMagicGlpStakeData = () => {
  const lsMagicGlpStakeData = localStorage.getItem(LS_MAGIC_GLP_STAKE_KEY);
  const lsMagicGlpChartData = localStorage.getItem(
    LS_MAGIC_GLP_STAKE_CHART_KEY
  );

  if (!lsMagicGlpStakeData) {
    return {
      data: [],
      isCreated: false,
      chartData: null,
    };
  }

  const magicGlpStakeData = JSON.parse(lsMagicGlpStakeData);
  const chartData = JSON.parse(lsMagicGlpChartData || "null");
  const data = magicGlpStakeData.map((item: any) => jsonBigIntTransform(item));

  return {
    data,
    chartData,
    isCreated: true,
  };
};
