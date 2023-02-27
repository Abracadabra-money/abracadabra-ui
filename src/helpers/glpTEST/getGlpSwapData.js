import { ethers } from "ethers";
import axios from "axios";
import gmxVaultAbi from "@/helpers/glpTEST/abi/gmxVault";
import gmxLensAbi from "@/helpers/glpTEST/abi/gmxLens";
const gmxVaultAddress = "0x489ee077994B6658eAfA855C308275EAd8097C4A";
const gmxLensAddress = "0xe121904194eB69e5b589b58EDCbc5B74069787C3";

const blacklis = [
  "0x17fc002b466eec40dae837fc4be5c67993ddbd6f",
  "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a",
  // "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f", // wbtc
  // "0x82af49447d8a07e3bd95bd0d56f35241523fbab1", // weth
  // "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8", // usdc
  // "0xf97f4df75117a78c1a5a0dbb814af92458539fb4", // link
  // "0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0", // uni
  // "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", // usdt
  // "0xda10009cbd5d07dd0cecc66161fc93d7c9000da1", // dai
];

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

const query0x = async (buyToken, sellToken, sellAmount, chainId, slipage) => {
  const slippagePercentage = slipage / 100;
  const url = getBaseUrl(chainId);
  const params = {
    buyToken: buyToken,
    sellToken: sellToken,
    sellAmount: sellAmount.toString(),
    slippagePercentage
  };

  const { data } = await axios.get(url, { params: params });

  return data;
};

const getBaseUrl = (chainId) => {
  switch (chainId) {
    case 1:
      return "https://api.0x.org/swap/v1/quote";
    case 137:
      return "https://polygon.api.0x.org/swap/v1/quote";
    case 42161:
      return "https://arbitrum.api.0x.org/swap/v1/quote";
    case 10:
      return "https://optimism.api.0x.org/swap/v1/quote";
    case 250:
      return "https://fantom.api.0x.org/swap/v1/quote";
    case 56:
      return "https://bsc.api.0x.org/swap/v1/quote";
    case 43114:
      return "https://avalanche.api.0x.org/swap/v1/quote";
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
};

const getGlpLevData = async (provider, pool, sellAmount, chainId, slipage) => {
  const results = [];
  const { borrowToken } = pool;

  const gmxLensContract = await new ethers.Contract(
    gmxLensAddress,
    JSON.stringify(gmxLensAbi),
    provider
  );

  for (let token of await getTokens(provider)) {
    const { buyAmount, data } = await query0x(
      token,
      borrowToken.address,
      sellAmount,
      chainId,
      slipage
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
      token,
      glpOutAmount: resp[0].toString(),
      feesPoints: resp[1].toString(),
      swapDataEncode: getSwapDataEncode,
    });
  }
  const result = results.reduce(maxGlpAmount);
  console.log("result", result)
  return result;
};

const getGlpLiqData = async (provider, pool, amount, chainId, slipage) => {
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
    const { buyAmount, data } = await query0x(
      borrowToken.address,
      token,
      resp[0].toString(),
      chainId,
      slipage
    );

    console.log("outAmount", resp[0].toString())
    console.log("buyAmount", buyAmount)
    console.log("feesPoints", resp[1].toString())

    const getSwapDataEncode = ethers.utils.defaultAbiCoder.encode(
      ["bytes", "address"],
      [data, token]
    );

    results.push({
      token,
      tokenOutAmount: resp[0].toString(),
      buyAmount,
      feesPoints: resp[1].toString(),
      swapDataEncode: getSwapDataEncode,
    });
  }

  const result = results.reduce(maxBuyAmount);
  console.log("result", result)
  return result;
};

export { getGlpLevData, getGlpLiqData };
