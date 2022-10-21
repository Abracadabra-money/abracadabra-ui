import { BigNumber, ethers } from "ethers";
import axios from "axios";

const getBigNumber = (amount, decimals) => {
  return BigNumber.from(amount).mul(BigNumber.from(10).pow(decimals));
};

const query0x = async (
  buyToken,
  sellToken,
  slippage = 0,
  amountSell,
  takerAddress
) => {
  const slippagePercentage = slippage / 100;
  const url = "https://api.0x.org/swap/v1/quote";

  const params = {
    buyToken: buyToken,
    sellToken: sellToken,
    sellAmount: amountSell.toString(),
    slippagePercentage,
    skipValidation: true,
    takerAddress,
  };

  const response = await axios.get(url, { params: params });

  const { data, buyAmount, sellAmount, estimatedGas } = response.data;

  return {
    data: data,
    buyAmount: ethers.BigNumber.from(buyAmount),
    sellAmount: ethers.BigNumber.from(sellAmount),
    estimatedGas: ethers.BigNumber.from(estimatedGas),
  };
};

const initializeProps = async (pool) => {
  const Pair = pool.cauldronInfo.token.contract;
  const MIM = pool.cauldronInfo.pairTokenContract;
  const MimChainlink = pool.cauldronInfo.chainLinksContract.mim;
  const mimPriceInUsd = await MimChainlink.latestAnswer();
  const token0 = pool.token0.contractInstance;
  const token0Chainlink = pool.cauldronInfo.chainLinksContract.token0;
  const token0PriceInUsd = await token0Chainlink.latestAnswer();
  const { _reserve0: token0Reserve, _reserve1: token1Reserve } =
    await Pair.getReserves();
  const token1 = pool.token1.contractInstance;
  const token1Chainlink = pool.cauldronInfo.chainLinksContract.token1;
  const token1PriceInUsd = await token1Chainlink.latestAnswer();

  return {
    Pair,
    MIM,
    mimPriceInUsd,
    token0,
    token0PriceInUsd,
    token0Reserve,
    token1Reserve,
    token1,
    token1PriceInUsd,
  };
};

const getLevZeroXswapperData = async (mimAmount, pool, slipage = 1) => {
  const {
    MIM,
    mimPriceInUsd,
    token0,
    token0PriceInUsd,
    token0Reserve,
    token1Reserve,
    token1,
    token1PriceInUsd,
  } = await initializeProps(pool);

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
    slipage,
    mimAmountToSwapForToken0
  );

  // sell MIM => buy token1BuyingPower
  const queryToken1AmountFromMim = await query0x(
    MIM.address,
    token1.address,
    slipage,
    mimAmountToSwapForToken1
  );

  const totalMimAmountToSwap = queryToken0AmountFromMim.sellAmount.add(
    queryToken1AmountFromMim.sellAmount
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

const getLiqZeroXswapperData = async (lpAmount, pool, slipage = 1) => {
  const { Pair, MIM, token0, token1 } = await initializeProps(pool);

  const totalSupply = await Pair.totalSupply();
  const lpAmountToken0 = await token0.balanceOf(Pair.address);
  const lpAmountToken1 = await token1.balanceOf(Pair.address);
  const amount0 = lpAmount.mul(lpAmountToken0).div(totalSupply);
  const amount1 = lpAmount.mul(lpAmountToken1).div(totalSupply);

  const queryToken0ToMim = await query0x(
    token0.address,
    MIM.address,
    slipage,
    amount0
  );

  const queryToken1ToMim = await query0x(
    token1.address,
    MIM.address,
    slipage,
    amount1
  );

  const data = ethers.utils.defaultAbiCoder.encode(
    ["bytes[]"],
    [[queryToken0ToMim.data, queryToken1ToMim.data]]
  );

  return data;
};

const getSwapStaticToken = async (
  { levSwapperContract, collateralToken, borrowToken },
  slipage,
  amount,
  userAddr,
  minExpected
) => {
  const swapperAddres = levSwapperContract.address;

  const response = await query0x(
    collateralToken.address,
    borrowToken.address,
    slipage,
    amount,
    levSwapperContract.address
  );

  const swapData = response.data;

  const swapStaticTx = await levSwapperContract.populateTransaction.swap(
    userAddr,
    minExpected,
    amount,
    swapData,
    {
      gasLimit: 10000000,
    }
  );
  const swapByte = swapStaticTx.data;

  //30
  const callEncode = ethers.utils.defaultAbiCoder.encode(
    ["address", "bytes", "bool", "bool", "uint8"],
    [swapperAddres, swapByte, false, false, 2]
  );

  return { swapByte, callEncode };
};

export { getLevZeroXswapperData, getLiqZeroXswapperData, getSwapStaticToken };
