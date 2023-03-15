import { ethers, providers } from "ethers";
import { MulticallProvider } from "ethers-multicall-provider";
import { swap0xRequest } from "@/helpers/0x";
import { actions } from "@/helpers/cauldron/cook/actions";
import store from "@/store";

const staticProvider = new providers.StaticJsonRpcProvider(
  "https://arb1.arbitrum.io/rpc"
);

const multicalProvider = MulticallProvider.wrap(staticProvider);

import gmxVaultAbi from "@/helpers/glpData/abi/gmxVault";
import gmxLensAbi from "@/helpers/glpData/abi/gmxLens";
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

const maxGlpAmount = (a, b) => {
  return +b.amountOut - +a.amountOut;
};

const maxBuyAmount = (a, b) => {
  return +a.buyAmount > +b.buyAmount ? a : b;
};

const getWhitelistedTokens = async () => {
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
      maxAmountIn: maxAmountInArr[idx],
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
  store.commit("updateRouteData", []);
  store.commit("setPopupState", {
    type: "mglp-route",
    isShow: true,
  });

  const { borrowToken, collateralToken } = pool;

  const tokensArr = await getWhitelistedTokens();

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
      ...tokensArr[idx],
    };
  });

  const tokenInfoArray = initialResults.sort(maxGlpAmount);

  let globalLimit = ethers.BigNumber.from(0);
  tokenInfoArray.forEach((item) => {
    globalLimit = globalLimit.add(item.maxAmountIn);
  });

  if (ethers.BigNumber.from(sellAmount).gt(globalLimit))
    console.log("to much mim to swap"); // TODO: add notification

  let mimLeftToSwap = ethers.BigNumber.from(sellAmount);
  let cookInfo = [];

  for (let info of tokenInfoArray) {
    if (mimLeftToSwap.eq(ethers.BigNumber.from(0))) break;

    const itsAmountEnough =
      info.maxAmountIn.gt(mimLeftToSwap) || info.maxAmountIn.eq(mimLeftToSwap);
    const awailableToSwap = itsAmountEnough ? mimLeftToSwap : info.maxAmountIn;

    if (itsAmountEnough && cookInfo.length === 0) {
      cookInfo.push(info);
    } else {
      const { data, buyAmount, sellAmount, buyAmountWithSlippage } =
        await swap0xRequest(
          chainId,
          info.buyToken,
          borrowToken.address,
          slipage,
          awailableToSwap
        );

      info.data = data;
      info.buyAmount = buyAmount;
      info.buyAmountWithSlippage = buyAmountWithSlippage;
      info.sellAmount = sellAmount;

      cookInfo.push(info);
    }

    mimLeftToSwap = mimLeftToSwap.sub(awailableToSwap);
  }

  const mintedGlpFromTokenInArrFinal = await Promise.all(
    cookInfo.map((info) =>
      gmxLensContract.getMintedGlpFromTokenIn(
        info.buyToken,
        info.buyAmountWithSlippage
      )
    )
  );
  const minExpectedArr = await Promise.all(
    mintedGlpFromTokenInArrFinal.map((mintedGlpFromTokenIn) =>
      collateralToken.contract.convertToShares(mintedGlpFromTokenIn.amountOut)
    )
  );

  cookInfo = cookInfo.map((info) => {
    return {
      ...info,
      minExpected: minExpectedArr[cookInfo.indexOf(info)],
    };
  });

  store.commit(
    "updateRouteData",
    cookInfo.map((item) => {
      return {
        address: item.address,
        feeBasisPoints: item.feeBasisPoints,
        amount: item.minExpected,
      };
    })
  );

  const swapperAddres = pool.levSwapperContract.address;
  const userAddr = store.getters.getAccount;

  for (let info of cookInfo) {
    const swapAmount = info.sellAmount;
    const minExpected = info.minExpected;
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

    const infoIndex = cookInfo.indexOf(info);
    const itsLast = infoIndex === cookInfo.length - 1

    if (!itsLast) {
      cookData = await actions.addCollateral(cookData, "-2", userAddr, false);
    }
  }

  return cookData;
};

const getGlpLiqData = async (provider, pool, amount, chainId, slipage) => {
  store.commit("updateRouteData", []);
  store.commit("setPopupState", {
    type: "mglp-route",
    isShow: true,
  });

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
        [resp.data, resp.sellToken]
      ),
    };
  });

  store.commit(
    "updateRouteData",
    results
      .sort(maxBuyAmount)
      .reverse()
      .map((item) => {
        return {
          address: item.address,
          feeBasisPoints: item.feeBasisPoints,
          amount: item.buyAmount,
        };
      })
  );

  const result = results.reduce(maxBuyAmount);

  console.log("result", result);
  return result;
};

export { getGlpLevData, getGlpLiqData };
