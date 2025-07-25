import axios from "axios";
import type { Address } from "viem";

export type TokenPrice = {
  address: Address;
  price: number;
};

type DefiLlamaPricesResponse = {
  coins: {
    [key: string]: {
      confidence: number;
      decimals: number;
      price: number;
      symbol: string;
      timestamp: number;
    };
  };
};

type DefiLlamaPricesEmptyResponse = {
  coins: {};
};

const domain = "https://coins.llama.fi";

const defiLlamaChainsKeys = {
  1: "ethereum",
  10: "optimism",
  56: "bsc",
  137: "polygon",
  250: "fantom",
  1285: "moonriver",
  2222: "kava",
  8453: "base",
  43114: "avalanche",
  42161: "arbitrum",
  43120: "moonriver",
  59144: "linea",
  80084: "berachain",
  80094: "berachain-bera",
  81457: "blast",
  168587773: "blast",
  6900: "nibiru",
};

const coingeckoNativeTokensIds = {
  1: "ethereum",
  42161: "ethereum",
  2222: "kava",
  43114: "avalanche-2",
  10: "optimism",
  250: "fantom",
  56: "binancecoin",
  137: "matic-network",
  1285: "moonriver",
  8453: "ethereum",
  59144: "ethereum",
  81457: "ethereum",
  80094: "berachain-bera",
  6900: "nibiru",
};

// this config is used to get coin prices if there no results by chainId
const coingeckoCoinsIds = [
  {
    id: "magic-internet-money-arbitrum",
    addresses: ["0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1"],
  },
  {
    id: "magic-internet-money-arbitrum",
    addresses: ["0x471EE749bA270eb4c1165B5AD95E614947f6fCeb"],
  },
  {
    id: "magic-internet-money-arbitrum",
    addresses: ["0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A"],
  },
  {
    id: "magic-internet-money-arbitrum",
    addresses: ["0xfCfc58685101e2914cBCf7551B432500db84eAa8"],
  },
  {
    id: "usdt0",
    addresses: ["0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"],
  },
  {
    id: "spell-token",
    addresses: ["0x55be39c912621606683dee44c4ab2dde083bc925"],
  },
  {
    id: "spell-token",
    addresses: ["0xd621b380daf82566b9d41ab71f29d5140a7595fa"],
  },
  {
    id: "usd-coin",
    addresses: ["0x0829F361A05D993d5CEb035cA6DF3446b060970b"],
  },
  {
    id: "nibiru",
    addresses: ["0x1429B38e58b97de646ACd65fdb8a4502c2131484"],
  },
];

export const getNativeTokensPrice = async (chainIds: number[]) => {
  const ids = chainIds.map(
    (chainId) =>
      `coingecko:${
        coingeckoNativeTokensIds[
          chainId as keyof typeof coingeckoNativeTokensIds
        ]
      }`
  );

  const idsString = ids.join(",");

  const finalUrl = `${domain}/prices/current/${idsString}`;

  try {
    const response = await axios.get(finalUrl);
    const data: DefiLlamaPricesResponse | DefiLlamaPricesEmptyResponse =
      response.data;
    return parseNativeTokensResult(chainIds, data);
  } catch (error) {
    console.log("getNativePrices error", error);
    return [];
  }
};

export const getCoinsPrices = async (
  chainId: number,
  coins: Address[]
): Promise<TokenPrice[]> => {
  const coinsString = getParsedRequestString(chainId, coins);

  const finalUrl = `${domain}/prices/current/${coinsString}`;

  try {
    const response = await axios.get(finalUrl);
    const data: DefiLlamaPricesResponse | DefiLlamaPricesEmptyResponse =
      response.data;
    const prices = parseResult(data, coins, chainId);
    return prices;
  } catch (error) {
    console.log("getCoinsPrices error", error);
    return [];
  }
};

const parseNativeTokensResult = (
  chainIds: number[],
  results: DefiLlamaPricesResponse
) => {
  const prices = chainIds.map((chainId) => {
    const id = `coingecko:${
      coingeckoNativeTokensIds[chainId as keyof typeof coingeckoNativeTokensIds]
    }`;

    return {
      chainId,
      price: results.coins[id]?.price || 0,
    };
  });

  return prices;
};

const getParsedRequestString = (chainId: number, coins: Address[]) => {
  const chainKey =
    defiLlamaChainsKeys[chainId as keyof typeof defiLlamaChainsKeys];

  if (!chainKey) {
    return [];
  }

  const ids = coins.map((coin) => {
    const coinConfig = coingeckoCoinsIds.find((config) =>
      config.addresses.includes(coin)
    );
    return coinConfig ? `coingecko:${coinConfig.id}` : `${chainKey}:${coin}`;
  });

  return ids.join(",");
};

const parseResult = (
  data: DefiLlamaPricesResponse,
  coins: Address[],
  chainId: number
) => {
  const chainKey =
    defiLlamaChainsKeys[chainId as keyof typeof defiLlamaChainsKeys];

  const prices = coins.map((coin) => {
    const coinConfig = coingeckoCoinsIds.find((config) =>
      config.addresses.includes(coin)
    );
    const id = coinConfig
      ? `coingecko:${coinConfig.id}`
      : `${chainKey}:${coin}`;

    return {
      address: coin,
      price: data.coins[id]?.price || 0,
    };
  });

  return prices;
};
