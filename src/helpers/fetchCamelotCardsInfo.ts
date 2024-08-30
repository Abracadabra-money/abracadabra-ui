import axios from "axios";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";

const storageKeys = {
  CAMELOT_ARB_CARD: "CAMELOT_ARB_CARD",
  CAMELOT_USDC_CARD: "CAMELOT_USDC_CARD",
};

export const fetchCamelotArbInfo = async () => {
  const cachedData = checkAndGetCachedData(storageKeys.CAMELOT_ARB_CARD);

  if (cachedData) return cachedData;

  const nitroRes = await axios.get(`https://api.camelot.exchange/nitros/`);
  const rangeRes = await axios.get(`https://api.camelot.exchange/nft-pools/`);
  const strategyRes = await axios.get(
    `https://wire2.gamma.xyz/camelot/arbitrum/hypervisors/allData`
  );

  const nitroApr =
    nitroRes.data.data.nitros["0x4B081b3600B3B1bcE242cDc291f85e475532B0B4"]
      .incentivesApr;

  const strategyApr =
    strategyRes.data["0x1164191754f726edb85466f84ae5f14f43c111a9"].returns.daily
      .feeApr * 100;

  const { minIncentivesApr, maxIncentivesApr, tvlUSD } =
    rangeRes.data.data.nftPools["0xDe6f99A9e63a8528fF43C3c1f13A07F541f761e5"];

  const minApr = minIncentivesApr + nitroApr + strategyApr;
  const maxApr = maxIncentivesApr + nitroApr + strategyApr;

  const camelotArbData = { tvl: tvlUSD, apr: { min: minApr, max: maxApr } };

  saveToLocalStorage(storageKeys.CAMELOT_ARB_CARD, camelotArbData);

  return camelotArbData;
};

export const fetchCamelotUsdcInfo = async () => {
  const cachedData = checkAndGetCachedData(storageKeys.CAMELOT_USDC_CARD);

  try {
    if (cachedData) return cachedData;

    const camelotPool = "0x0e7AC13617Cc1A289B222E4602BdAaA53ea4dc61";

    const poolsInfo = await axios.get(
      "https://api.angle.money/v2/merkl?chainIds[]=42161"
    );
    const liquidityV3Data = await axios.get(
      "https://api.camelot.exchange/v2/liquidity-v3-data"
    );

    const { tvl, meanAPR } =
      poolsInfo.data[ARBITRUM_CHAIN_ID].pools[camelotPool];

    const { activeTvlAverageAPR } =
      liquidityV3Data.data.data.pools[camelotPool];

    const apr = meanAPR + activeTvlAverageAPR;

    const camelotUsdcData = { tvl: tvl, apr };

    saveToLocalStorage(storageKeys.CAMELOT_USDC_CARD, camelotUsdcData);

    return camelotUsdcData;
  } catch (error) {
    console.log("fetchCamelotUsdcInfo error: ", error);

    return { tvl: 0, apr: 0 };
  }
};

const checkAndGetCachedData = (storageKey: string, allowedTime = 5) => {
  // default time 5 min

  const cachedData = localStorage.getItem(storageKey);
  if (!cachedData) return false;

  try {
    const { data, time } = JSON.parse(cachedData);

    const currentTime = new Date().getTime();
    const timeDiff = currentTime - time;
    const minutes = Math.floor(timeDiff / 1000 / 60);
    if (minutes > allowedTime) return false;

    return data;
  } catch (error) {
    console.log("checkAndGetCachedData err:", error);
    return false;
  }
};

const saveToLocalStorage = (storageKey: string, data: any) => {
  // save to ls
  const time = new Date().getTime();
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      data,
      time,
    })
  );
};
