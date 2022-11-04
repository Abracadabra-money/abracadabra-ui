import { BigNumber, ethers } from "ethers";
import axios from "axios";
import EACAggregatorProxyAbi from "@/utils/abi/EACAggregatorProxy";

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
  // const url = "https://api.0x.org/swap/v1/quote";
  const url = "https://optimism.api.0x.org/swap/v1/quote";

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
  const MIM = pool.borrowToken.contract;
  const Pair = pool.lpLogic.lpContract;
  const { _reserve0: token0Reserve, _reserve1: token1Reserve } =
    await Pair.getReserves();

  const token0Contract = pool.token0.contract;
  const token0Desimals = await token0Contract.decimals();
  const token0ChainlinkContract = pool.chainlinks.token0;
  const token0PriceInUsd = await token0ChainlinkContract.latestAnswer();
  const token0PriceDesimals = await token0ChainlinkContract.decimals();
  // todo decimals price

  const token1Contract = pool.token1.contract;
  const token1Desimals = await token1Contract.decimals();
  const token1ChainlinkContract = pool.chainlinks.token1;
  const token1PriceInUsd = await token1ChainlinkContract.latestAnswer();
  const token1PriceDesimals = await token1ChainlinkContract.decimals();

  const token00 = {
    contract: token0Contract,
    decimals: token0Desimals,
    priceInUsd: token0PriceInUsd,
    priceDesimals: token0PriceDesimals,
    reserve: token0Reserve,
  };

  const token11 = {
    contract: token1Contract,
    decimals: token1Desimals,
    priceInUsd: token1PriceInUsd,
    priceDesimals: token1PriceDesimals,
    reserve: token1Reserve,
  };

  return {
    MIM,
    Pair,
    token00,
    token11,
    // DELETE
    token0: token0Contract,
    token0PriceInUsd,
    token0Reserve,
    token1Reserve,
    token1: token1Contract,
    token1PriceInUsd,
  };
};

const getMimAmountInUsd = async (pool, mimAmount) => {
  let mimPriceInUsd, mimPriceDecimals;

  if (pool.chainlinks.mim) {
    const mimChainlinkContract = pool.chainlinks.mim;
    mimPriceInUsd = await mimChainlinkContract.latestAnswer();
    mimPriceDecimals = await mimChainlinkContract.decimals();
  } else {
    const mimChainlinkContract = new ethers.Contract(
      "0x7a364e8770418566e3eb2001a96116e6138eb32f",
      JSON.stringify(EACAggregatorProxyAbi),
      ethers.getDefaultProvider()
    );

    mimPriceInUsd = await mimChainlinkContract.latestAnswer();
    mimPriceDecimals = await mimChainlinkContract.decimals();
  }

  return mimAmount
    .mul(mimPriceInUsd)
    .div(BigNumber.from(10).pow(mimPriceDecimals));
};

const getTokenValue = (decimals0, decimals1, value0, value1) => {
  const totalDesimals = decimals0 + decimals1;

  if (totalDesimals < 18) {
    return value0.mul(value1).mul(BigNumber.from(10).pow(18 - totalDesimals));
  } else if (totalDesimals > 18) {
    return value0.mul(value1).div(BigNumber.from(10).pow(totalDesimals - 18));
  } else {
    return value0.mul(value1).div(BigNumber.from(10).pow(decimals1)); // 18 decimals
  }
};

const getLevZeroXswapperData = async (mimAmount, pool, slipage = 1) => {
  const { MIM, token00, token11 } = await initializeProps(pool);

  const mimValueInUsd = await getMimAmountInUsd(pool, mimAmount); // 18 decimals

  const token0ReserveTotalValueInUsd = getTokenValue(
    token00.decimals,
    token00.priceDesimals,
    token00.reserve,
    token00.priceInUsd
  ); // 18 decimals

  const token1ReserveTotalValueInUsd = getTokenValue(
    token11.decimals,
    token11.priceDesimals,
    token11.reserve,
    token11.priceInUsd
  ); // 18 decimals

  const lpTotalValueInUsd = token0ReserveTotalValueInUsd.add(
    token1ReserveTotalValueInUsd
  ); // 18 decimals

  const lpFractionBuyingPower = mimValueInUsd
    .mul(BigNumber.from(10).pow(18))
    .div(lpTotalValueInUsd); // 18 decimals

  const token0BuyingPower = getTokenValue(
    18,
    token00.decimals,
    lpFractionBuyingPower,
    token00.reserve
  ); // 18 decimals

  const token1BuyingPower = getTokenValue(
    18,
    token11.decimals,
    lpFractionBuyingPower,
    token11.reserve
  );

  // Query 0x to get how much MIM you get from swapping token0 and token1. No slipage is used
  // so that we get the quote only.
  // sell token0BuyingPower => buy MIM
  const queryMimAmountFromToken0 = await query0x(
    token00.contract.address,
    MIM.address,
    0,
    token0BuyingPower
  );

  //sell  token1BuyingPower => buy MIM
  const queryMimAmountFromToken1 = await query0x(
    token11.contract.address,
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
    token00.contract.address,
    slipage,
    mimAmountToSwapForToken0
  );

  // sell MIM => buy token1BuyingPower
  const queryToken1AmountFromMim = await query0x(
    MIM.address,
    token11.contract.address,
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
