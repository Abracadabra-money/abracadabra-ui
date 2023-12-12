import { parseUnits } from "viem";
import { Wallet, utils } from "ethers";

export const ONE_ETHER: string = utils.parseEther("1").toString();
export const ONE_ETHER_VIEM: bigint = parseUnits("1", 18);
export const MIM_PRICE: bigint = parseUnits("1", 18);
export const BIPS: number = 10_000;
export const SECONDS_PER_DAY: number = 86400;
export const ONE_MILLISECOND: number = 1000;

export const MAX_APPROVAL_AMOUNT: any =
  "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

export const RANDOM_ACCOUNT: string = Wallet.createRandom().address;

export const ANALYTICS_URK: string = "https://analytics.abracadabra.money/api";
export const OPENOCEAN_BASE_URL: string = "https://ethapi.openocean.finance/v2";
export const COINGECKO_URL: string = "https://api.coingecko.com/api/v3/";

export const MAINNET_CHAIN_ID: number = 1;
export const BSC_CHAIN_ID: number = 56;
export const KAVA_CHAIN_ID: number = 2222;
export const ARBITRUM_CHAIN_ID: number = 42161;
