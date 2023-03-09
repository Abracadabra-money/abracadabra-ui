import { ethers, providers } from "ethers";
import { swap0xRequest } from "@/helpers/0x";
import { actions } from "@/helpers/cauldron/cook/actions";

import gmxVaultAbi from "@/helpers/glpTEST/abi/gmxVault";
import gmxLensAbi from "@/helpers/glpTEST/abi/gmxLens";
import { priceAbi } from "@/utils/farmPools/abi/priceAbi";
const gmxVaultAddress = "0x489ee077994B6658eAfA855C308275EAd8097C4A";
const gmxLensAddress = "0x9f8fB63ef774A496cd9aD3Cc29c1e81Ae947FC2e";
import store from "@/store";

const blacklist = [
  "0x17fc002b466eec40dae837fc4be5c67993ddbd6f", // FRAX
  "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a", // MIM
  "0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0", // UNI
];

const getMimOraclePrice = async () => {
  try {
    const defaultProvider = new providers.StaticJsonRpcProvider(
      "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"
    );

    const oracle = new ethers.Contract(
      "0x7A364e8770418566e3eb2001A96116E6138Eb32F",
      JSON.stringify(priceAbi),
      defaultProvider
    );

    return await oracle.latestAnswer();
  } catch (error) {
    console.log("getMimOraclePrice err:", error);
  }
};

const getNameFromAddress = (address) => {
  return {
    "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": "WBTC",
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": "WETH",
    "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": "USDC",
    "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4": "LINK",
    "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0": "UNI",
    "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": "USDT",
    "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A": "MIM",
    "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F": "FRAX",
    "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": "DAI",
  }[address];
};

const maxGlpAmount = (a, b) => {
  return +b.glpOutAmount - +a.glpOutAmount;
};

const maxBuyAmount = (a, b) => {
  return +a.buyAmount > +b.buyAmount ? a : b;
};

const getTokens = async (provider, lensContract) => {
  const mimOraclePrice = await getMimOraclePrice();

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
    if (blacklist.indexOf(address.toLowerCase()) === -1) {
      const maxAmountIn = await lensContract.getMaxAmountIn(address);
      const maxAmountInToMIM = maxAmountIn.div(mimOraclePrice).mul(1e8);
      tokens.push({
        address: address,
        maxAmountInToMIM: maxAmountInToMIM.gt(
          ethers.BigNumber.from("1000000000000000000000")
        )
          ? ethers.BigNumber.from("1000000000000000000000")
          : maxAmountInToMIM,
      });
    }
  }

  return tokens;
};

const getGlpLevData = async (
  cookData,
  provider,
  pool,
  sellAmount,
  chainId,
  slipage
) => {
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

  const tokensArr = await getTokens(provider, gmxLensContract);

  for (let token of tokensArr) {
    const { buyAmount, data } = await swap0xRequest(
      chainId,
      token.address,
      borrowToken.address,
      slipage,
      sellAmount
    );

    const resp = await gmxLensContract.getMintedGlpFromTokenIn(
      token.address,
      buyAmount
    );

    const getSwapDataEncode = ethers.utils.defaultAbiCoder.encode(
      ["bytes", "address"],
      [data, token.address]
    );

    results.push({
      ...token,
      tokenName: getNameFromAddress(token.address),
      token: token.address,
      glpOutAmount: resp[0].toString(),
      feesPoints: resp[1].toString(),
      swapDataEncode: getSwapDataEncode,
    });

    store.commit("updateRouteData", results);
  }

  const tokenInfoArray = results.sort(maxGlpAmount);

  let globalLimit = ethers.BigNumber.from(0);
  tokenInfoArray.forEach((item) => {
    globalLimit = globalLimit.add(item.maxAmountInToMIM);
  });
  console.log("globalLimit", globalLimit.toString());

  if (sellAmount.gt(globalLimit)) console.log("to much mim to swap"); // TODO: add notification

  let mimLeftToSwap = sellAmount;
  const cookInfo = [];

  for (let info of tokenInfoArray) {
    if (mimLeftToSwap.eq(0)) break;
    console.log("info", info);
    console.log("mimLeftToSwap", mimLeftToSwap.toString());
    console.log("maxAmountInToMIM", info.maxAmountInToMIM.toString());
    const itsAmountEnough =
      info.maxAmountInToMIM.gt(mimLeftToSwap) ||
      info.maxAmountInToMIM.eq(mimLeftToSwap);
    const awailableToSwap = itsAmountEnough
      ? mimLeftToSwap
      : info.maxAmountInToMIM;

    // add cook call info block
    if (itsAmountEnough && cookInfo.length === 0) {
      info.sellAmount = awailableToSwap;
      cookInfo.push(info);
    } else {
      const { data } = await swap0xRequest(
        chainId,
        info.address,
        borrowToken.address,
        slipage,
        awailableToSwap
      );

      const getSwapDataEncode = ethers.utils.defaultAbiCoder.encode(
        ["bytes", "address"],
        [data, info.address]
      );

      info.sellAmount = awailableToSwap;
      info.swapDataEncode = getSwapDataEncode;

      cookInfo.push(info);
    }
    //

    mimLeftToSwap = mimLeftToSwap.sub(awailableToSwap);
  }

  console.log("cookInfo", cookInfo);
  console.log("result", tokenInfoArray);

  for (let info of cookInfo) {
    const oracleExchangeRate = pool.oracleExchangeRate;

    const slippageBN = ethers.BigNumber.from(
      parseFloat(slipage * 1e10).toFixed(0)
    );

    const userAddr = store.getters.getAccount;
    const swapAmount = info.sellAmount;

    const expectedCollateral = swapAmount
      .mul(oracleExchangeRate)
      .div(String(1e18));

    const slippageAmount = expectedCollateral
      .div(100)
      .mul(slippageBN)
      .div(1e10);
    const minExpected = expectedCollateral.sub(slippageAmount);

    const swapData = info.swapDataEncode;
    const swapperAddres = pool.levSwapperContract.address;

    const swapStaticTx = await pool.levSwapperContract.populateTransaction.swap(
      userAddr,
      minExpected,
      swapAmount,
      swapData
    );

    cookData = await actions.call(
      cookData,
      swapperAddres,
      swapStaticTx.data,
      false,
      false,
      2
    );
  }

  console.log("cookData", cookData);

  return cookData;
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
  console.log("glpAmount", glpAmount.toString());
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
      resp[0].toString()
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
      sellAmount,
    });

    store.commit("updateRouteData", results);
  }

  const result = results.reduce(maxBuyAmount);

  const notification = {
    msg: `0x sell amount: ${result.sellAmount}; OutFromBurningGlp amount: ${result.tokenOutAmount}`,
    type: "warning",
  };
  await store.dispatch("notifications/new", notification);
  console.log("tokenOutAmount", result.tokenOutAmount);
  console.log("sellAmount", result.sellAmount.toString());
  return result;
};

export { getGlpLevData, getGlpLiqData };
