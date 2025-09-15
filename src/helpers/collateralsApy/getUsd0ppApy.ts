import axios from "axios";
import { formatToFixed } from "@/helpers/filters";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import { mainnet } from "viem/chains";
import { type Address, formatEther, type PublicClient, parseAbi } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

const usualAddress =
  "0xC4441c2BE5d8fA8126822B9929CA0b81Ea0DE38E" as const satisfies Address;
const usd0ppAddress = "0x35D8949372D46B7a3D5A56006AE77B215fc69bC0" as const satisfies Address;
const magicUsd0ppHarvesterAddress = "0x80014629Ca75441599A1efd2283E3f71A8EC0AAB" as const satisfies Address;

const feeCollectableAbi = parseAbi(["function feeBips() view returns (uint256)"]);

const usualChainId = mainnet.id;
const endpoint = "https://api.mimswap.io/functions/v1/usd0pp-rewards"; // Wraps https://app.usual.money/api/rewards/rates


export const getUsd0ppApy = async (): Promise<number> => {
  try {
    const [prices, { data }, feeBips] = await Promise.all([
      getCoinsPrices(usualChainId, [usualAddress, usd0ppAddress]),
      await axios.get(endpoint),
      (getPublicClient(usualChainId) as PublicClient).readContract({
        abi: feeCollectableAbi,
        address: magicUsd0ppHarvesterAddress,
        functionName: "feeBips",
      }),
    ]);

    const usualPrice = prices?.[0]?.price;
    const usd0ppPrice = prices?.[1]?.price;

    if (usualPrice === undefined || usd0ppPrice === undefined) {
      return 0;
    }

    const usd0ppUsualRewards = Number(
      formatEther(BigInt(data?.["USD0++"] ?? "0")),
    );
    
    const apr = usd0ppUsualRewards * usualPrice / usd0ppPrice;
    const aprWithFee = apr * (1 - Number(feeBips) / 10_000);

    return Number(
      formatToFixed(
        ((1 + aprWithFee) ** 365 - 1) * 100,
        2,
      ),
    );
  } catch (error) {
    return 0;
  }
};
