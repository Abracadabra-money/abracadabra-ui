import { getCoingeckoPrice } from "@/helpers/stake/magicGlp/subgraph/getChartData/getCoingeckoPrice";

const getImpermanentLoss = (change: any) => {
  return (2 * Math.sqrt(change)) / (1 + change) - 1;
};

export const getGlpPerformanceData = async (
  glpData: any,
  feesData: any,
  { from, chainId = 42161 }: any
) => {
  const btcPrices = await getCoingeckoPrice("BTC", { from });
  const ethPrices = await getCoingeckoPrice("ETH", { from });
  const avaxPrices = await getCoingeckoPrice("AVAX", { from });

  const glpDataById = glpData.reduce((memo: any, item: any) => {
    memo[item.timestamp] = item;
    return memo;
  }, {});

  const feesDataById = feesData.reduce((memo: any, item: any) => {
    memo[item.timestamp] = item;
    return memo;
  });

  let BTC_WEIGHT = 0;
  let ETH_WEIGHT = 0;
  let AVAX_WEIGHT = 0;

  if (chainId === 43114) {
    BTC_WEIGHT = 0.166;
    ETH_WEIGHT = 0.166;
    AVAX_WEIGHT = 0.166;
  } else {
    BTC_WEIGHT = 0.25;
    ETH_WEIGHT = 0.25;
  }

  const STABLE_WEIGHT = 1 - BTC_WEIGHT - ETH_WEIGHT - AVAX_WEIGHT;
  const GLP_START_PRICE = glpDataById[btcPrices[0].timestamp]?.glpPrice || 1.19;

  const btcFirstPrice = btcPrices[0]?.value;
  const ethFirstPrice = ethPrices[0]?.value;
  const avaxFirstPrice = avaxPrices[0]?.value;

  let indexBtcCount = (GLP_START_PRICE * BTC_WEIGHT) / btcFirstPrice;
  let indexEthCount = (GLP_START_PRICE * ETH_WEIGHT) / ethFirstPrice;
  let indexAvaxCount = (GLP_START_PRICE * AVAX_WEIGHT) / avaxFirstPrice;
  let indexStableCount = GLP_START_PRICE * STABLE_WEIGHT;

  const lpBtcCount = (GLP_START_PRICE * 0.5) / btcFirstPrice;
  const lpEthCount = (GLP_START_PRICE * 0.5) / ethFirstPrice;
  const lpAvaxCount = (GLP_START_PRICE * 0.5) / avaxFirstPrice;

  const ret = [];
  let cumulativeFeesPerGlp = 0;
  let lastGlpItem;
  let lastFeesItem;

  let prevEthPrice = 3400;
  let prevAvaxPrice = 1000;
  for (let i = 0; i < btcPrices.length; i++) {
    const btcPrice = btcPrices[i].value;
    const ethPrice = ethPrices[i]?.value || prevEthPrice;
    const avaxPrice = avaxPrices[i]?.value || prevAvaxPrice;
    prevAvaxPrice = avaxPrice;
    prevEthPrice = ethPrice;

    const timestampGroup =
      parseInt((btcPrices[i].timestamp / 86400).toString()) * 86400;

    const glpItem: any = glpDataById[timestampGroup] || lastGlpItem;
    lastGlpItem = glpItem;

    const glpPrice = glpItem?.glpPrice;
    const glpSupply = glpItem?.glpSupply;

    const feesItem: any = feesDataById[timestampGroup] || lastFeesItem;
    lastFeesItem = feesItem;

    const dailyFees = feesItem?.all;

    const syntheticPrice =
      indexBtcCount * btcPrice +
      indexEthCount * ethPrice +
      indexAvaxCount * avaxPrice +
      indexStableCount;

    // rebalance each day. can rebalance each X days
    if (i % 1 == 0) {
      indexBtcCount = (syntheticPrice * BTC_WEIGHT) / btcPrice;
      indexEthCount = (syntheticPrice * ETH_WEIGHT) / ethPrice;
      indexAvaxCount = (syntheticPrice * AVAX_WEIGHT) / avaxPrice;
      indexStableCount = syntheticPrice * STABLE_WEIGHT;
    }

    const lpBtcPrice =
      (lpBtcCount * btcPrice + GLP_START_PRICE / 2) *
      (1 + getImpermanentLoss(btcPrice / btcFirstPrice));
    const lpEthPrice =
      (lpEthCount * ethPrice + GLP_START_PRICE / 2) *
      (1 + getImpermanentLoss(ethPrice / ethFirstPrice));
    const lpAvaxPrice =
      (lpAvaxCount * avaxPrice + GLP_START_PRICE / 2) *
      (1 + getImpermanentLoss(avaxPrice / avaxFirstPrice));

    if (dailyFees && glpSupply) {
      const INCREASED_GLP_REWARDS_TIMESTAMP = 1635714000;
      const GLP_REWARDS_SHARE =
        timestampGroup >= INCREASED_GLP_REWARDS_TIMESTAMP ? 0.7 : 0.5;
      const collectedFeesPerGlp = (dailyFees / glpSupply) * GLP_REWARDS_SHARE;
      cumulativeFeesPerGlp += collectedFeesPerGlp;
    }

    let glpPlusFees = glpPrice;
    if (glpPrice && glpSupply && cumulativeFeesPerGlp) {
      glpPlusFees = glpPrice + cumulativeFeesPerGlp;
    }

    let glpApr;
    let glpPlusDistributedUsd;
    let glpPlusDistributedEth;
    let glpApy;

    if (glpItem) {
      if (glpItem.cumulativeDistributedUsdPerGlp) {
        glpPlusDistributedUsd =
          glpPrice + glpItem.cumulativeDistributedUsdPerGlp;

        if (chainId === 42161) {
          glpApr = (glpItem.distributedUsdPerGlp / glpPrice) * 365 * 100; // incorrect?
        } else {
          glpApr =
            (((glpItem.distributedUsdPerGlp / 100) * avaxPrice) / glpPrice) *
            365 *
            100;
        }

        // let glpComponded = glpItem.distributedUsdPerGlp * glpPrice;
        // let UsdPerCompound = glpComponded * glpItem.distributedUsdPerGlp;
        glpApy = (Math.pow(1 + glpApr / 100 / 730, 730) - 1) * 100;
      }
      if (glpItem.cumulativeDistributedEthPerGlp) {
        glpPlusDistributedEth =
          glpPrice + glpItem.cumulativeDistributedEthPerGlp * ethPrice;
      }
    }

    ret.push({
      timestamp: btcPrices[i].timestamp,
      syntheticPrice,
      lpBtcPrice,
      lpEthPrice,
      lpAvaxPrice,
      glpPrice,
      btcPrice,
      ethPrice,
      glpPlusFees,
      glpPlusDistributedUsd,
      glpPlusDistributedEth,

      indexBtcCount,
      indexEthCount,
      indexAvaxCount,
      indexStableCount,

      BTC_WEIGHT,
      ETH_WEIGHT,
      AVAX_WEIGHT,
      STABLE_WEIGHT,

      performanceLpEth: ((glpPrice / lpEthPrice) * 100).toFixed(2),
      performanceLpEthCollectedFees: ((glpPlusFees / lpEthPrice) * 100).toFixed(
        2
      ),
      performanceLpEthDistributedUsd: (
        (glpPlusDistributedUsd / lpEthPrice) *
        100
      ).toFixed(2),
      performanceLpEthDistributedEth: (
        (glpPlusDistributedEth / lpEthPrice) *
        100
      ).toFixed(2),

      performanceLpBtcCollectedFees: ((glpPlusFees / lpBtcPrice) * 100).toFixed(
        2
      ),

      performanceLpAvaxCollectedFees: (
        (glpPlusFees / lpAvaxPrice) *
        100
      ).toFixed(2),

      performanceSynthetic: ((glpPrice / syntheticPrice) * 100).toFixed(2),
      performanceSyntheticCollectedFees: (
        (glpPlusFees / syntheticPrice) *
        100
      ).toFixed(2),
      performanceSyntheticDistributedUsd: (
        (glpPlusDistributedUsd / syntheticPrice) *
        100
      ).toFixed(2),
      performanceSyntheticDistributedEth: (
        (glpPlusDistributedEth / syntheticPrice) *
        100
      ).toFixed(2),

      glpApr,
      glpApy,
    });
  }

  return ret;
};
