import type { Contract } from "@/configs/blast/types";

export type MimInfo = {
  name: string;
  symbol: string;
  chainId: number;
  decimals: number;
  image: string;
} & Contract;
