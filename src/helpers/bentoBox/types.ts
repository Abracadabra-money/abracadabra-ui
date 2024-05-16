import type { MimInfo } from "@/configs/tokens/types";
import type { ExtendedContractInfo } from "@/configs/contracts/types";

export type BentoBoxConfig = {
  chainId: number;
  mimBalance: bigint;
  mimPrice: number;
  mimInBentoBalance: bigint;
  mimInDegenBalance: bigint;
  bentoContractInfo?: ExtendedContractInfo;
  degenContractInfo?: ExtendedContractInfo;
  tokenInfo: MimInfo;
  bentoAllowance: bigint;
  degenAllowance: bigint;
};
