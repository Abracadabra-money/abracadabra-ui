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
  80085: "berachain",
  81457: "blast",
  168587773: "blast",
};

// this config is used to get coin prices if there no results by chainId
const coingeckoCoinsIds = [
  {
    id: "magic-internet-money",
    addresses: ["0x76DA31D7C9CbEAE102aff34D3398bC450c8374c1"],
  },
];

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
