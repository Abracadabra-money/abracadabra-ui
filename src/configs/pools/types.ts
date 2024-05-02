import type { Contract } from "@/configs/blast/types";
import type { PairTokensInfo } from "@/helpers/pools/swap/tokens";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import type { Address } from "viem";

export type PoolConfig = {
  id: number;
  chainId: number;
  name: string;
  icon: string;
  decimals: number;
  contract: Contract;
  baseToken: TokenConfig;
  quoteToken: TokenConfig;
  lockContract?: Contract;
  settings: PoolSettings;
};

export type PoolInfo = MagicLPInfo & {
  price: number;
  tokens: PairTokensInfo;
  swapRouter: Address;
  lockInfo?: LockInfo;
};

export type TokenConfig = {
  name: string;
  icon: string;
  decimals: number;
  contract: Contract;
  mainColor?: string;
  isPopular?: boolean;
};

// TODO: may be changed in future
type PoolSettings = {
  isNew: boolean;
  isDeprecated: boolean;
  isMim: boolean;
};

export type LockInfo = {
  balances: {
    unlocked: bigint;
    locked: bigint;
    total: bigint;
  };
  allowance: bigint;
};
