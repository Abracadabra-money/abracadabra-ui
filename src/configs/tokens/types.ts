import type { ContractInfo } from "@/types/global";

export type MimInfo = {
  name: string;
  symbol: string;
  chainId: number;
  decimals: number;
  image: string;
} & ContractInfo;
