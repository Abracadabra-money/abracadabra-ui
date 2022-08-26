// import { BigNumber, Contract, ethers } from "ethers";
import { BigNumber, Contract, ethers } from "ethers";
// import EACAggregatorProxyAbi from "./abi/EACAggregatorProxy";
import axios from "axios";

import { priceAbi } from "@/utils/farmPools/abi/priceAbi";

const getBigNumber = (amount = 0, decimals = 18) => {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
};

const query0x = async (sellToken, buyToken, slippage, amountSell) => {
  const query = `https://optimism.api.0x.org/swap/v1/quote?buyToken=${buyToken}&sellToken=${sellToken}&sellAmount=${amountSell.toString()}&slippagePercentage=${slippage}`;

  console.log(query);

  const response = await axios(query);

  const { data, buyAmount, sellAmount, estimatedGas } = response.data;

  return {
    data: data,
    buyAmount: BigNumber.from(buyAmount),
    sellAmount: BigNumber.from(sellAmount),
    estimatedGas: BigNumber.from(estimatedGas),
  };
};

const initializeProps = async (pool, provider) => {
  const MIM = pool.borrowToken.contract;
  const defaultProvider = await ethers.getDefaultProvider();

  const MimChainlink = await new Contract(
    "0x7A364e8770418566e3eb2001A96116E6138Eb32F",
    JSON.stringify(priceAbi),
    defaultProvider
  );

  const mimPriceInUsd = await MimChainlink.latestAnswer(); // 8  decimals

  const token0 = pool.token0.contract;

  const token0Chainlink = await new Contract(
    "0x0d276fc14719f9292d5c1ea2198673d1f4269246",
    JSON.stringify(priceAbi),
    provider
  );

  const token0PriceInUsd = await token0Chainlink.latestAnswer(); // 8  decimals

  const token1 = pool.token1.contract;

  const token1Chainlink = await new Contract(
    "0x8fffffd4afb6115b954bd326cbe7b4ba576818f6",
    JSON.stringify(priceAbi),
    defaultProvider
  );

  const token1PriceInUsd = await token1Chainlink.latestAnswer(); // 8  decimals

  const Pair = pool.lpLogic.lpContract;

  const { _reserve0: token0Reserve, _reserve1: token1Reserve } =
    await Pair.getReserves();

  return {
    MIM,
    mimPriceInUsd,
    token0,
    token0PriceInUsd,
    token1,
    token1PriceInUsd,
    token0Reserve,
    token1Reserve,
  };
};

// tyt
const getLeverageData = async (mimAmount, pool, wallet, slipage = 0.01) => {
  const slippage = slipage / 100;

  const {
    MIM,
    mimPriceInUsd,
    token0,
    token0PriceInUsd,
    token1,
    token1PriceInUsd,
    token0Reserve,
    token1Reserve,
  } = await initializeProps(pool, wallet);

  const mimValueInUsd = mimAmount.mul(mimPriceInUsd); // 26 decimals

  // Both 18 decimals
  const token0ReserveTotalValueInUsd = token0Reserve.mul(token0PriceInUsd); // 36 decimals

  const token1ReserveTotalValueInUsd = token1Reserve
    .mul(token1PriceInUsd)
    .mul(BigNumber.from(10).pow(10)); // 26 -> 36 decimals

  const lpTotalValueInUsd = token0ReserveTotalValueInUsd.add(
    token1ReserveTotalValueInUsd
  ); // 36 decimals

  const lpFractionBuyingPower = mimValueInUsd
    .mul(BigNumber.from(10).pow(28))
    .div(lpTotalValueInUsd); // 18 decimals

  const token0BuyingPower = lpFractionBuyingPower
    .mul(token0Reserve)
    .div(BigNumber.from(10).pow(18)); // 18 decimals

  const token1BuyingPower = lpFractionBuyingPower
    .mul(token1Reserve)
    .div(BigNumber.from(10).pow(18)); // 18 decimals

  // Query 0x to get how much MIM you get from swapping token0 and token1. No slipage is used
  // so that we get the quote only.
  // sell token0BuyingPower => buy MIM

  const queryMimAmountFromToken0 = await query0x(
    token0.address,
    MIM.address,
    0,
    token0BuyingPower
  );

  //sell  token1BuyingPower => buy MIM

  const queryMimAmountFromToken1 = await query0x(
    token1.address,
    MIM.address,
    0,
    token1BuyingPower
  );

  // Now calculate how much % of the initial mim the returned mim value consist of
  // This extra step is just to make sure the total input amount of mim doesn't exceed
  // the `mimAmount`
  const mimAmountToSwapForToken0 = queryMimAmountFromToken0.buyAmount
    .mul(mimAmount)
    .div(mimAmount);

  const mimAmountToSwapForToken1 = queryMimAmountFromToken1.buyAmount
    .mul(mimAmount)
    .div(mimAmount);

  // sell MIM => buy token0BuyingPower
  const queryToken0AmountFromMim = await query0x(
    MIM.address,
    token0.address,
    slippage,
    mimAmountToSwapForToken0
  );

  // sell MIM => buy token1BuyingPower
  const queryToken1AmountFromMim = await query0x(
    MIM.address,
    token1.address,
    slippage,
    mimAmountToSwapForToken1
  );

  const totalMimAmountToSwap = queryToken0AmountFromMim.sellAmount.add(
    queryToken1AmountFromMim.sellAmount
  );

  console.log(
    `Total MIM amount to swap token0 : ${ethers.utils.formatEther(
      queryMimAmountFromToken0.buyAmount
    )}`
  );
  console.log(
    `Total MIM amount to swap token1: ${ethers.utils.formatEther(
      queryMimAmountFromToken1.buyAmount
    )}`
  );

  if (totalMimAmountToSwap.gt(mimAmount)) {
    throw new Error(
      `total mim amount to swap ${totalMimAmountToSwap.toString()} exceed ${mimAmount.toString()}`
    );
  }

  const minimumToken0ToSwapAgainForMoreLp = getBigNumber(1, 16);

  const minimumToken1ToSwapAgainForMoreLp = getBigNumber(1, 16);

  const data = ethers.utils.defaultAbiCoder.encode(
    ["bytes[]", "uint256", "uint256"],
    [
      [queryToken0AmountFromMim.data, queryToken1AmountFromMim.data],
      minimumToken0ToSwapAgainForMoreLp,
      minimumToken1ToSwapAgainForMoreLp,
    ]
  );

  return data;
};

// const getLiquidationData = async (lpAmount, pool, wallet, slippage = 0.01) => {
//   console.log("=== Liquidation ===");

//   const { Pair, MIM, token0, token1 } = await initializeProps(pool, wallet);

//   const totalSupply = await Pair.totalSupply();
//   const lpAmountToken0 = await token0.balanceOf(Pair.address);
//   const lpAmountToken1 = await token1.balanceOf(Pair.address);
//   const amount0 = lpAmount.mul(lpAmountToken0).div(totalSupply);
//   const amount1 = lpAmount.mul(lpAmountToken1).div(totalSupply);

//   const queryToken0ToMim = await query0x(
//     token0.address,
//     MIM.address,
//     slippage,
//     amount0
//   );

//   const queryToken1ToMim = await query0x(
//     token1.address,
//     MIM.address,
//     slippage,
//     amount1
//   );

//   let totalMimBuyAmount = queryToken0ToMim.buyAmount.add(
//     queryToken1ToMim.buyAmount
//   );

//   totalMimBuyAmount = totalMimBuyAmount.sub(totalMimBuyAmount.div(100)); // add 1% sippage

//   const data = ethers.utils.defaultAbiCoder.encode(
//     ["bytes[]"],
//     [[queryToken0ToMim.data, queryToken1ToMim.data]]
//   );

//   return data;
// };

// export { getLeverageData, getLiquidationData };
export { getLeverageData };
