import { BigNumber } from "ethers";
import { bigNumberify, expandDecimals } from "../fee/expandDecials";
import { sub } from "date-fns";
import { gql, ApolloClient, InMemoryCache } from "@apollo/client";
import { fetchIncentiveStats } from "./getIncentiveStats";
import { getMarketsPoolValueInfoMin } from "../getMarketInfo";
import { fetchTokenPrices } from "../fetchTokenPrices";

import {
  GM_ARB,
  GM_SOL,
  GM_ETH,
  GM_BTC,
  DAYS_CONSIDERED,
  MARKET_FEES_URL,
} from "@/constants/gm";

const marketFeesQuery = (marketAddress) => {
  return `
        _${marketAddress}_lte_start_of_period_: collectedMarketFeesInfos(
            orderBy:timestampGroup
            orderDirection:desc
            where: {
              marketAddress: "${marketAddress.toLowerCase()}"
              period: "1h"
              timestampGroup_lte: ${Math.floor(
                sub(new Date(), { days: DAYS_CONSIDERED }).valueOf() / 1000
              )}
            },
            first: 1
        ) {
            cumulativeFeeUsdPerPoolValue
        }

        _${marketAddress}_recent: collectedMarketFeesInfos(
          orderBy: timestampGroup
          orderDirection: desc
          where: {
            marketAddress: "${marketAddress.toLowerCase()}"
            period: "1h"
          },
          first: 1
      ) {
          cumulativeFeeUsdPerPoolValue
      }
    `;
};

const getIncentivesBonusApr = async (provider) => {
  const rawIncentivesStats = await fetchIncentiveStats();
  const marketAddresses = [GM_ARB, GM_SOL, GM_ETH, GM_BTC];

  const tokenPricesResponse = await fetchTokenPrices();
  const marketsPoolValueInfoMin = await getMarketsPoolValueInfoMin(
    provider,
    tokenPricesResponse,
    marketAddresses
  );

  const arbPrices = tokenPricesResponse.find(
    (item) => item.tokenSymbol === "ARB"
  );
  const arbitrumTokenPrice = BigNumber.from(arbPrices.minPrice).mul(
    expandDecimals(1, 18)
  );

  return marketAddresses.reduce((acc, marketAddress) => {
    const arbTokensAmount = BigNumber.from(
      rawIncentivesStats.lp.rewardsPerMarket[marketAddress] ?? 0
    );
    const yearMultiplier = Math.floor(
      (365 * 24 * 60 * 60) / rawIncentivesStats.lp.period
    );
    const poolValue = marketsPoolValueInfoMin.find(
      (marketInfo) => marketInfo.market === marketAddress
    )[1].poolValue;
    let incentivesApr = BigNumber.from(0);

    if (poolValue?.gt(0)) {
      incentivesApr = arbTokensAmount
        .mul(arbitrumTokenPrice)
        .div(poolValue)
        .mul(yearMultiplier)
        .div(expandDecimals(1, 14));
    }

    return {
      ...acc,
      [marketAddress.toLowerCase()]: incentivesApr.toString(),
    };
  }, {});
};

export const getMarketsApr = async (provider) => {
  const cachedData = checkAndGetCachedData();
  if(cachedData) return cachedData;

  const graphClient = new ApolloClient({
    uri: MARKET_FEES_URL,
    cache: new InMemoryCache(),
  });

  const marketAddresses = [GM_ARB, GM_SOL, GM_ETH, GM_BTC];
  const query = marketAddresses.reduce(
    (acc, marketAddress) => acc + marketFeesQuery(marketAddress),
    ""
  );

  const { data } = await graphClient.query({
    query: gql(`{${query}}`),
    fetchPolicy: "no-cache",
  });

  const marketsTokensAPRData = marketAddresses.reduce((acc, marketAddress) => {
    const lteStartOfPeriodFees = data[`_${marketAddress}_lte_start_of_period_`];
    const recentFees = data[`_${marketAddress}_recent`];

    const x1 =
      bigNumberify(lteStartOfPeriodFees[0].cumulativeFeeUsdPerPoolValue) ??
      BigNumber.from(0);
    const x2 = bigNumberify(recentFees[0].cumulativeFeeUsdPerPoolValue);

    if (!x2) {
      acc[marketAddress.toLowerCase()] = BigNumber.from(0);
      return acc;
    }

    const incomePercentageForPeriod = x2.sub(x1);
    const yearMultiplier = Math.floor(365 / DAYS_CONSIDERED);
    const apr = incomePercentageForPeriod
      .mul(yearMultiplier)
      .div(expandDecimals(1, 26));

    acc[marketAddress.toLowerCase()] = apr.toString();

    return acc;
  }, {});

  const avgMarketsAPR = Object.values(marketsTokensAPRData)
    .reduce((acc, apr) => {
      return acc.add(apr);
    }, BigNumber.from(0))
    .div(marketAddresses.length)
    .toString();

  const marketsTokensIncentiveAprData = await getIncentivesBonusApr(provider);

  const marketsApr = {
    marketsTokensIncentiveAprData,
    marketsTokensAPRData,
    avgMarketsAPR,
  };

  // save to ls
  const time = new Date().getTime();
  localStorage.setItem(
    "GM_APRS",
    JSON.stringify({
      marketsApr,
      time,
    })
  );

  return marketsApr;
};

const checkAndGetCachedData = () => {
  const cachedData = localStorage.getItem("GM_APRS");
  const allowedTime = 5; // 5 min

  if(!cachedData) return false;

  try {
    const { marketsApr, time } = JSON.parse(cachedData);

    const currentTime = new Date().getTime();
    const timeDiff = currentTime - time;
    const minutes = Math.floor(timeDiff / 1000 / 60);
    console.log(minutes)
    if(minutes > allowedTime) return false;

    return marketsApr;
  } catch (error) {
    console.log("checkAndGetCachedData err:", error);
    return false;
  }
};
