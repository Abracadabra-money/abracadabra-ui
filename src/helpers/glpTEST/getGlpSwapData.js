import { ethers, providers } from "ethers";
import { MulticallProvider } from "ethers-multicall-provider";
import { swap0xRequest } from "@/helpers/0x";
import { actions } from "@/helpers/cauldron/cook/actions";
import store from "@/store";
// import axios from "axios";

const staticProvider = new providers.StaticJsonRpcProvider(
  "https://arb1.arbitrum.io/rpc"
);

const multicalProvider = MulticallProvider.wrap(staticProvider);

import gmxVaultAbi from "@/helpers/glpTEST/abi/gmxVault";
import gmxLensAbi from "@/helpers/glpTEST/abi/gmxLens";
const gmxVaultAddress = "0x489ee077994B6658eAfA855C308275EAd8097C4A";
const gmxLensAddress = "0x9f8fB63ef774A496cd9aD3Cc29c1e81Ae947FC2e";

const gmxLensContract = new ethers.Contract(
  gmxLensAddress,
  JSON.stringify(gmxLensAbi),
  multicalProvider
);

const gmxVaultContract = new ethers.Contract(
  gmxVaultAddress,
  JSON.stringify(gmxVaultAbi),
  multicalProvider
);

const blacklist = [
  "0x17fc002b466eec40dae837fc4be5c67993ddbd6f", // FRAX
  "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a", // MIM
  "0xfa7f8980b0f1e64a2062791cc3b0871572f1f7f0", // UNI
];

// const getNameFromAddress = (address) => {
//   return {
//     "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f": "WBTC",
//     "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1": "WETH",
//     "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8": "USDC",
//     "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4": "LINK",
//     "0xFa7F8980b0f1E64A2062791cc3b0871572f1F7f0": "UNI",
//     "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9": "USDT",
//     "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A": "MIM",
//     "0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F": "FRAX",
//     "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1": "DAI",
//   }[address];
// };

const maxGlpAmount = (a, b) => {
  return +b.amountOut - +a.amountOut;
};

const maxBuyAmount = (a, b) => {
  return +a.buyAmount > +b.buyAmount ? a : b;
};

const getWhitelistedTokens = async () => {
  const testLimit = ethers.BigNumber.from("1000000000000000000000");

  const whitelistedTokensLength =
    await gmxVaultContract.allWhitelistedTokensLength();

  const tokensAddresses = await Promise.all(
    Array.from(Array(Number(whitelistedTokensLength)).keys()).map((_, idx) =>
      gmxVaultContract.allWhitelistedTokens(idx)
    )
  );

  const filteredTokens = tokensAddresses.filter(
    (token) => blacklist.indexOf(token.toLowerCase()) === -1
  );

  const maxAmountInArr = await Promise.all(
    filteredTokens.map((token) => gmxLensContract.getMaxAmountIn(token))
  );

  const tokensInfo = filteredTokens.map((token, idx) => {
    return {
      address: token,
      maxAmountIn: maxAmountInArr[idx].gt(testLimit)
        ? testLimit
        : maxAmountInArr[idx],
    };
  });

  return tokensInfo;
};

const getGlpLevData = async (
  cookData,
  provider,
  pool,
  sellAmount,
  chainId,
  slipage
) => {
  // store.commit("updateRouteData", []);
  // store.commit("setPopupState", {
  //   type: "test",
  //   isShow: true,
  // });

  const { borrowToken, collateralToken } = pool;

  const tokensArr = await getWhitelistedTokens();

  // 0x to many request
  // const initialRequestsArr = await axios.all(
  //   tokensArr.map((token) =>
  //     swap0xRequest(
  //       chainId,
  //       token.address,
  //       borrowToken.address,
  //       slipage,
  //       sellAmount
  //     )
  //   )
  // );

  const initialRequestsArr = [];

  for (let token of tokensArr) {
    initialRequestsArr.push(
      await swap0xRequest(
        chainId,
        token.address,
        borrowToken.address,
        slipage,
        sellAmount
      )
    );
  }

  const mintedGlpFromTokenInArr = await Promise.all(
    initialRequestsArr.map((resp) =>
      gmxLensContract.getMintedGlpFromTokenIn(resp.buyToken, resp.buyAmount)
    )
  );

  const initialResults = initialRequestsArr.map((resp, idx) => {
    return {
      ...resp,
      ...mintedGlpFromTokenInArr[idx],
    };
  });

  const tokenInfoArray = initialResults.sort(maxGlpAmount);

  store.commit("updateRouteData", tokenInfoArray);

  let globalLimit = ethers.BigNumber.from(0);
  tokenInfoArray.forEach((item) => {
    globalLimit = globalLimit.add(item.maxAmountIn);
  });

  if (sellAmount.gt(globalLimit)) console.log("to much mim to swap"); // TODO: add notification

  let mimLeftToSwap = sellAmount;
  const cookInfo = [];

  for (let info of tokenInfoArray) {
    if (mimLeftToSwap.eq(0)) break;

    const itsAmountEnough =
      info.maxAmountIn.gt(mimLeftToSwap) || info.maxAmountIn.eq(mimLeftToSwap);
    const awailableToSwap = itsAmountEnough ? mimLeftToSwap : info.maxAmountIn;

    if (itsAmountEnough && cookInfo.length === 0) {
      cookInfo.push(info);
    } else {
      const { data, buyAmount, sellAmount } = await swap0xRequest(
        chainId,
        info.buyToken,
        borrowToken.address,
        slipage,
        awailableToSwap
      );

      info.data = data;
      info.buyAmount = buyAmount;
      info.sellAmount = sellAmount;

      cookInfo.push(info);
    }

    mimLeftToSwap = mimLeftToSwap.sub(awailableToSwap);
  }

  const mintedGlpFromTokenInArrFinal = await Promise.all(
    cookInfo.map((info) =>
      gmxLensContract.getMintedGlpFromTokenIn(info.buyToken, info.buyAmount)
    )
  );
  const minExpectedArr = await Promise.all(
    mintedGlpFromTokenInArrFinal.map((mintedGlpFromTokenIn) =>
      collateralToken.contract.convertToShares(mintedGlpFromTokenIn.amountOut)
    )
  );
  const swapperAddres = pool.levSwapperContract.address;
  const userAddr = store.getters.getAccount;

  for (let info of cookInfo) {
    const swapAmount = info.sellAmount;
    const minExpected = minExpectedArr[cookInfo.indexOf(info)];
    const swapData = ethers.utils.defaultAbiCoder.encode(
      ["bytes", "address"],
      [info.data, info.buyToken]
    );

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

  return cookData;
};

const getGlpLiqData = async (provider, pool, amount, chainId, slipage) => {
  // store.commit("updateRouteData", []);
  // store.commit("setPopupState", {
  //   type: "test",
  //   isShow: true,
  // });

  const { borrowToken, collateralToken } = pool;

  const mGlpAmount = await pool.masterContractInstance.toAmount(
    collateralToken.address,
    amount,
    false
  );
  const glpAmount = await collateralToken.contract.convertToAssets(mGlpAmount);

  const tokensArr = await getWhitelistedTokens();

  const tokenOutFromBurningGlpArr = await Promise.all(
    tokensArr.map((token) =>
      gmxLensContract.getTokenOutFromBurningGlp(token.address, glpAmount)
    )
  );

  const respArr = [];

  for (let token of tokensArr) {
    respArr.push(
      await swap0xRequest(
        chainId,
        borrowToken.address,
        token.address,
        slipage,
        tokenOutFromBurningGlpArr[tokensArr.indexOf(token)].amount
      )
    );
  }

  const results = respArr.map((resp, idx) => {
    return {
      ...tokensArr[idx],
      ...resp,
      ...tokenOutFromBurningGlpArr[idx],
      swapDataEncode: ethers.utils.defaultAbiCoder.encode(
        ["bytes", "address"],
        [resp.data, resp.selToken]
      ),
    };
  });

  const result = results.reduce(maxBuyAmount);
  return result;
};

export { getGlpLevData, getGlpLiqData };
