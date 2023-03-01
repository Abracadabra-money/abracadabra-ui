import { ethers } from "ethers";
import { swap0xRequest } from "@/helpers/0x";

import gmxVaultAbi from "@/helpers/glpTEST/abi/gmxVault";
import gmxLensAbi from "@/helpers/glpTEST/abi/gmxLens";
const gmxVaultAddress = "0x489ee077994B6658eAfA855C308275EAd8097C4A";
const gmxLensAddress = "0xe121904194eB69e5b589b58EDCbc5B74069787C3";

import store from "@/store";

const blacklis = [
  "0x17fc002b466eec40dae837fc4be5c67993ddbd6f",
  "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a",
];

const getNameFromAddress = (address) => {
  return {
    '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f': 'WBTC',
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1': 'WETH',
    '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8': 'USDC',
    '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4': 'LINK',
    '0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0': 'UNI',
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9': 'USDT',
    '0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A': 'MIM',
    '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F': 'FRAX',
    '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1': 'DAI',
  }[address];
}

const maxGlpAmount = (a, b) => {
  return +a.glpOutAmount > +b.glpOutAmount ? a : b;
};

const maxBuyAmount = (a, b) => {
  return +a.buyAmount > +b.buyAmount ? a : b;
};

const getTokens = async (provider) => {
  const gmxVaultContract = await new ethers.Contract(
    gmxVaultAddress,
    JSON.stringify(gmxVaultAbi),
    provider
  );

  const whitelistedTokensLength =
    await gmxVaultContract.allWhitelistedTokensLength();

  const tokens = [];
  for (let i = 0; i < whitelistedTokensLength; i++) {
    const address = await gmxVaultContract.allWhitelistedTokens(i);
    // Exclude FRAX and MIM.
    if (blacklis.indexOf(address.toLowerCase()) === -1) tokens.push(address);
  }

  return tokens;
};

const getGlpLevData = async (provider, pool, sellAmount, chainId, slipage) => {
  store.commit("updateRouteData", []);
  store.commit("setPopupState", {
    type: "test",
    isShow: true,
  });

  const results = [];
  const { borrowToken } = pool;

  const gmxLensContract = await new ethers.Contract(
    gmxLensAddress,
    JSON.stringify(gmxLensAbi),
    provider
  );

  for (let token of await getTokens(provider)) {
    const { buyAmount, data } = await swap0xRequest(
      chainId,
      token,
      borrowToken.address,
      slipage,
      sellAmount,
    );

    const resp = await gmxLensContract.getMintedGlpFromTokenIn(
      token,
      buyAmount
    );

    console.log("outAmount", resp[0].toString())
    console.log("feesPoints", resp[1].toString())

    const getSwapDataEncode = ethers.utils.defaultAbiCoder.encode(
      ["bytes", "address"],
      [data, token]
    );

    results.push({
      tokenName: getNameFromAddress(token),
      token,
      glpOutAmount: resp[0].toString(),
      feesPoints: resp[1].toString(),
      swapDataEncode: getSwapDataEncode,
    });

    store.commit("updateRouteData", results);
  }
  const result = results.reduce(maxGlpAmount);

  const notification = {
    msg: `Token: ${getNameFromAddress(result.token)}; feesPoints: ${result.feesPoints}`,
    type: "warning",
  };
  await store.dispatch("notifications/new", notification);

  return result;
};

const getGlpLiqData = async (provider, pool, amount, chainId, slipage) => {
  store.commit("updateRouteData", []);
  store.commit("setPopupState", {
    type: "test",
    isShow: true,
  });

  const { borrowToken, collateralToken } = pool;
  const gmxLensContract = await new ethers.Contract(
    gmxLensAddress,
    JSON.stringify(gmxLensAbi),
    provider
  );

  const results = [];
  const mGlpAmount = await pool.masterContractInstance.toAmount(
    collateralToken.address,
    amount,
    false
  );
  const glpAmount = await collateralToken.contract.convertToAssets(mGlpAmount);
  console.log("glpAmount", glpAmount.toString())
  for (let token of await getTokens(provider)) {
    const resp = await gmxLensContract.getTokenOutFromBurningGlp(
      token,
      glpAmount
    );

    const { buyAmount, sellAmount, data } = await swap0xRequest(
      chainId,
      borrowToken.address,
      token,
      slipage,
      resp[0].toString(),
    );

    // console.log("outAmount", resp[0].toString())
    // console.log("buyAmount", buyAmount)
    // console.log("feesPoints", resp[1].toString())

    const getSwapDataEncode = ethers.utils.defaultAbiCoder.encode(
      ["bytes", "address"],
      [data, token]
    );

    results.push({
      tokenName: getNameFromAddress(token),
      token,
      tokenOutAmount: resp[0].toString(),
      buyAmount,
      feesPoints: resp[1].toString(),
      swapDataEncode: getSwapDataEncode,
      sellAmount
    });

    store.commit("updateRouteData", results);
  }

  const result = results.reduce(maxBuyAmount);

  const notification = {
    msg: `0x sell amount: ${result.sellAmount}; OutFromBurningGlp amount: ${result.tokenOutAmount}`,
    type: "warning",
  };
  await store.dispatch("notifications/new", notification);
  console.log("tokenOutAmount", result.tokenOutAmount)
  console.log("sellAmount", result.sellAmount.toString())
  return result;
};

export { getGlpLevData, getGlpLiqData };
