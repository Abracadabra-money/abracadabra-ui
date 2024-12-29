import axios from "axios";
import { formatToFixed } from "@/helpers/filters";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import { mainnet } from "viem/chains";
import { type Address, formatEther } from "viem";

const usualAddress =
  "0xC4441c2BE5d8fA8126822B9929CA0b81Ea0DE38E" as const satisfies Address;
const usd0ppAddress = "0x35D8949372D46B7a3D5A56006AE77B215fc69bC0" as const satisfies Address;
const usualChainId = mainnet.id;
const endpoint = "https://api.0xdreamy.dev/functions/v1/usd0pp-rewards"; // Wraps https://app.usual.money/api/rewards/rates

export const getUsd0ppApy = async (): Promise<number> => {
  try {
    const [prices, { data }] = await Promise.all([
      getCoinsPrices(usualChainId, [usualAddress, usd0ppAddress]),
      await axios.get(endpoint),
    ]);

    const usualPrice = prices?.[0]?.price;
    const usd0ppPrice = prices?.[1]?.price;

    if (usualPrice === undefined || usd0ppPrice === undefined) {
      return 0;
    }

    const usd0ppUsualRewards = Number(
      formatEther(BigInt(data?.["USD0++"] ?? "0")),
    );

    return Number(
      formatToFixed(
        ((1 + usd0ppUsualRewards / usd0ppPrice * usualPrice) ** 365 - 1) * 100,
        2,
      ),
    );
  } catch (error) {
    return 0;
  }
};
