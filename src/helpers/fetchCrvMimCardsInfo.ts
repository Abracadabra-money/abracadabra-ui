import axios from "axios";
const poolAddress = "0x4070C044ABc8d9d22447DFE4B032405970878d06";

export const fetchCrvMimCardsInfo = async () => {
  const cachedData = checkAndGetCachedData("MIM_CRV_CARD");

  if (cachedData) return cachedData;

  const curveData = await axios.get(
    `https://api.curve.fi/api/getPools/arbitrum/factory-stable-ng`
  );

  const poolData = curveData.data.data.poolData.find(
    (item: any) => item.address === poolAddress
  );

  const data = { tvl: poolData.usdTotal, apr: poolData.gaugeRewards[1].apy };

  saveToLocalStorage("MIM_CRV_CARD", data);

  return data;
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
