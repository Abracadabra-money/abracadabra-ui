const getBuyGlpFromAmount = require("./helpers/get-buy-glp-from-amount");
const getSellGlpToAmount = require("./helpers/get-sell-glp-to-amount");

const {
  tokens,
  GLP_DECIMALS,
  ARB_URL,
  USD_DECIMALS,
  BASIS_POINTS_DIVISOR,
  MAX_PRICE_DEVIATION_BASIS_POINTS,
  DEFAULT_MAX_USDG_AMOUNT
} = require("./constants");
const { providers, Contract, Wallet, BigNumber } = require("ethers");
const bigNumberify = require("./utils/big-numberify");
const expandDecimals = require("./utils/expand-decimals");
const { default: axios } = require("axios");

const { abi: GlpManagerAbi } = require("./abis/glpManager.json");
const { abi: ReaderAbi } = require("./abis/Reader.json");
const { abi: VaultAbi } = require("./abis/Vault.json");
const { abi: VaultReaderAbi } = require("./abis/VaultReader.json");

const provider = new providers.StaticJsonRpcProvider(ARB_URL);

const glpManager = new Contract(
  "0x3963FfC9dff443c2A94f21b129D429891E32ec18",
  GlpManagerAbi,
  provider
);
const reader = new Contract(
  "0x2b43c90D1B727cEe1Df34925bcd5Ace52Ec37694",
  ReaderAbi,
  provider
);
const vault = new Contract(
  "0x489ee077994B6658eAfA855C308275EAd8097C4A",
  VaultAbi,
  provider
);
const vaultReader = new Contract(
  "0xfebB9f4CAC4cD523598fE1C5771181440143F24A",
  VaultReaderAbi,
  provider
);

const USDG_ADDRESS = "0x45096e7aA921f27590f8F19e457794EB09678141";

function getInfoTokens(
  tokens,
  tokenBalances,
  whitelistedTokens,
  vaultTokenInfo,
  fundingRateInfo,
  vaultPropsLength,
  indexPrices,
  nativeTokenAddress
) {
  if (!vaultPropsLength) {
    vaultPropsLength = 15;
  }
  const fundingRatePropsLength = 2;
  const infoTokens = {};

  for (let i = 0; i < tokens.length; i++) {
    const token = JSON.parse(JSON.stringify(tokens[i]));

    if (tokenBalances) {
      token.balance = tokenBalances[i];
    }

    if (token.address === USDG_ADDRESS) {
      token.minPrice = expandDecimals(1, USD_DECIMALS);
      token.maxPrice = expandDecimals(1, USD_DECIMALS);
    }

    infoTokens[token.address] = token;
  }

  for (let i = 0; i < whitelistedTokens.length; i++) {
    const token = JSON.parse(JSON.stringify(whitelistedTokens[i]));

    if (vaultTokenInfo) {
      token.poolAmount = vaultTokenInfo[i * vaultPropsLength];
      token.reservedAmount = vaultTokenInfo[i * vaultPropsLength + 1];
      token.availableAmount = token.poolAmount.sub(token.reservedAmount);
      token.usdgAmount = vaultTokenInfo[i * vaultPropsLength + 2];
      token.redemptionAmount = vaultTokenInfo[i * vaultPropsLength + 3];
      token.weight = vaultTokenInfo[i * vaultPropsLength + 4];
      token.bufferAmount = vaultTokenInfo[i * vaultPropsLength + 5];
      token.maxUsdgAmount = vaultTokenInfo[i * vaultPropsLength + 6];
      token.globalShortSize = vaultTokenInfo[i * vaultPropsLength + 7];
      token.maxGlobalShortSize = vaultTokenInfo[i * vaultPropsLength + 8];
      token.maxGlobalLongSize = vaultTokenInfo[i * vaultPropsLength + 9];
      token.minPrice = vaultTokenInfo[i * vaultPropsLength + 10];
      token.maxPrice = vaultTokenInfo[i * vaultPropsLength + 11];
      token.guaranteedUsd = vaultTokenInfo[i * vaultPropsLength + 12];
      token.maxPrimaryPrice = vaultTokenInfo[i * vaultPropsLength + 13];
      token.minPrimaryPrice = vaultTokenInfo[i * vaultPropsLength + 14];

      // save minPrice and maxPrice as setTokenUsingIndexPrices may override it
      token.contractMinPrice = token.minPrice;
      token.contractMaxPrice = token.maxPrice;

      token.maxAvailableShort = bigNumberify(0);

      token.hasMaxAvailableShort = false;
      if (token.maxGlobalShortSize.gt(0)) {
        token.hasMaxAvailableShort = true;
        if (token.maxGlobalShortSize.gt(token.globalShortSize)) {
          token.maxAvailableShort = token.maxGlobalShortSize.sub(
            token.globalShortSize
          );
        }
      }

      if (token.maxUsdgAmount.eq(0)) {
        token.maxUsdgAmount = DEFAULT_MAX_USDG_AMOUNT;
      }

      token.availableUsd = token.isStable
        ? token.poolAmount
            .mul(token.minPrice)
            .div(expandDecimals(1, token.decimals))
        : token.availableAmount
            .mul(token.minPrice)
            .div(expandDecimals(1, token.decimals));

      token.maxAvailableLong = bigNumberify(0);
      token.hasMaxAvailableLong = false;
      if (token.maxGlobalLongSize.gt(0)) {
        token.hasMaxAvailableLong = true;

        if (token.maxGlobalLongSize.gt(token.guaranteedUsd)) {
          const remainingLongSize = token.maxGlobalLongSize.sub(
            token.guaranteedUsd
          );
          token.maxAvailableLong = remainingLongSize.lt(token.availableUsd)
            ? remainingLongSize
            : token.availableUsd;
        }
      } else {
        token.maxAvailableLong = token.availableUsd;
      }

      token.maxLongCapacity =
        token.maxGlobalLongSize.gt(0) &&
        token.maxGlobalLongSize.lt(token.availableUsd.add(token.guaranteedUsd))
          ? token.maxGlobalLongSize
          : token.availableUsd.add(token.guaranteedUsd);

      token.managedUsd = token.availableUsd.add(token.guaranteedUsd);
      token.managedAmount = token.managedUsd
        .mul(expandDecimals(1, token.decimals))
        .div(token.minPrice);

      setTokenUsingIndexPrices(token, indexPrices, nativeTokenAddress);
    }

    if (fundingRateInfo) {
      token.fundingRate = fundingRateInfo[i * fundingRatePropsLength];
      token.cumulativeFundingRate =
        fundingRateInfo[i * fundingRatePropsLength + 1];
    }

    if (infoTokens[token.address]) {
      token.balance = infoTokens[token.address].balance;
    }

    infoTokens[token.address] = token;
  }

  return infoTokens;
}

function setTokenUsingIndexPrices(token, indexPrices, nativeTokenAddress) {
  if (!indexPrices) {
    return;
  }

  const tokenAddress = token.isNative ? nativeTokenAddress : token.address;

  const indexPrice = indexPrices[tokenAddress];

  if (!indexPrice) {
    return;
  }

  const indexPriceBn = bigNumberify(indexPrice);

  if (indexPriceBn.eq(0)) {
    return;
  }

  const spread = token.maxPrice.sub(token.minPrice);
  const spreadBps = spread
    .mul(BASIS_POINTS_DIVISOR)
    .div(token.maxPrice.add(token.minPrice).div(2));

  if (spreadBps.gt(MAX_PRICE_DEVIATION_BASIS_POINTS - 50)) {
    // only set one of the values as there will be a spread between the index price and the Chainlink price
    if (indexPriceBn.gt(token.minPrimaryPrice)) {
      token.maxPrice = indexPriceBn;
    } else {
      token.minPrice = indexPriceBn;
    }
    return;
  }

  const halfSpreadBps = spreadBps.div(2).toNumber();
  token.maxPrice = indexPriceBn
    .mul(BASIS_POINTS_DIVISOR + halfSpreadBps)
    .div(BASIS_POINTS_DIVISOR);
  token.minPrice = indexPriceBn
    .mul(BASIS_POINTS_DIVISOR - halfSpreadBps)
    .div(BASIS_POINTS_DIVISOR);
}

async function bootstrap() {
  const isBuying = true;
  const account = Wallet.createRandom().address;
  const tokenAddresses = tokens.map((token) => token.address);

  const tokenBalances = await reader.getTokenBalances(account, tokenAddresses);
  console.log("1: tokenBalances");
  const vaultTokenInfo = await vaultReader.getVaultTokenInfoV4(
    "0x489ee077994B6658eAfA855C308275EAd8097C4A",
    "0xb87a436B93fFE9D75c5cFA7bAcFff96430b09868",
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    expandDecimals(1, 18),
    tokenAddresses
  );
  console.log("2: vaultTokenInfo");
  const { data: indexPrices } = await axios.get(
    "https://gmx-server-mainnet.uw.r.appspot.com/prices"
  );
  console.log("3: indexPrices");

  const infoTokens = getInfoTokens(
    tokens,
    tokenBalances,
    tokens,
    vaultTokenInfo,
    undefined,
    undefined,
    indexPrices,
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
  );

  const glpAmount = BigNumber.from("10000000000000000000"); // 10 GLP

  const aums = await glpManager.getAums();
  console.log("4: aums");
  const balancesAndSupplies = await reader.getTokenBalancesWithSupplies(
    account,
    [
      "0x1aDDD80E6039594eE970E5872D247bf0414C8903",
      "0x45096e7aA921f27590f8F19e457794EB09678141",
    ]
  );
  console.log("5: balancesAndSupplies");
  const totalTokenWeights = await vault.totalTokenWeights();
  console.log("6: totalTokenWeights");

  const glpSupply = balancesAndSupplies
    ? balancesAndSupplies[1]
    : bigNumberify(0);
  const usdgSupply = balancesAndSupplies
    ? balancesAndSupplies[3]
    : bigNumberify(0);

  let aum;
  if (aums && aums.length > 0) {
    aum = isBuying ? aums[0] : aums[1];
  }

  const glpPrice =
    aum && aum.gt(0) && glpSupply.gt(0)
      ? aum.mul(expandDecimals(1, GLP_DECIMALS)).div(glpSupply)
      : expandDecimals(1, USD_DECIMALS);

  const tokenList = tokens.filter((t) => !t.isWrapped);
  const visibleTokens = tokenList.filter((t) => !t.isTempHidden);

  for (const token of visibleTokens) {
    if (isBuying) {
      const { feeBasisPoints } = getBuyGlpFromAmount(
        glpAmount,
        token.address,
        infoTokens,
        glpPrice,
        usdgSupply,
        totalTokenWeights
      );
      console.log({ token, feeBasisPoints: feeBasisPoints / 100 });
    } else {
      const { feeBasisPoints } = getSellGlpToAmount(
        glpAmount,
        token.address,
        infoTokens,
        glpPrice,
        usdgSupply,
        totalTokenWeights
      );
      console.log({ token, feeBasisPoints: feeBasisPoints / 100 });
    }
  }
}

// bootstrap();

export { bootstrap };
