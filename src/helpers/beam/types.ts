import type { Address } from "viem";

export type BeamConfig = {
  chainId: number;
  icon: string;
  chainName: string;
  contract: {
    address: Address;
    abi: any;
  };
  outboundProofType: number;
  relayer?: Address;
  executor?: Address;
  settings: {
    contractVersion: number;
    disabledDestinationChains: Array<number>;
    lzChainId: number;
    lzVersion?: number;
    disabledFrom?: boolean;
  };
  defaultValue: any;
};

export type BeamConfigV2 = {
  chainId: number;
  icon: string;
  chainName: string;
  contract: {
    address: Address;
    abi: any;
  };
  outboundProofType: number;
  executor: Address;
  settings: {
    contractVersion: number;
    disabledDestinationChains: Array<number>;
    lzChainId: number;
    lzVersion?: number;
    disabledFrom?: boolean;
  };
  defaultValue: any;
};

export type BeamTokenConfig = {
  name: string;
  symbol: string;
  chainId: number;
  decimals: number;
  address: string;
  abi: any;
  image: string;
};

export type DestinationChainInfo = {
  chainConfig: BeamConfig;
  minDstGasLookupResult: bigint;
  dstConfigLookupResult: bigint;
  nativePrice: number;
};

export type BeamUserInfo = {
  chainId: number;
  balance: bigint;
  allowance: bigint;
  nativeBalance: bigint;
};

export type BeamInfo = BeamConfig & {
  nativePrice: number;
  dstConfigLookupResult: bigint;
  minDstGasLookupResult: bigint;
  userInfo: BeamUserInfo;
  tokenConfig: BeamTokenConfig;
};

export type SendParam = {
  dstEid: number | undefined;
  to: string;
  amountLD: bigint;
  minAmountLD: bigint;
  extraOptions: string;
  composeMsg: string;
  oftCmd: string;
};

export type QuoteFees = {
  nativeFee: bigint;
  lzTokenFee: bigint;
};
