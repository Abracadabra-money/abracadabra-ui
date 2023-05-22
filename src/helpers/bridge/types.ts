import type { Contract, BigNumber } from "ethers";

type NetworksConfig = {
  chainId: number;
  title: string;
  icon: string;
};

type ChainsConfig = {
  chainId: number;
  name: string;
  icon: string;
};

export type BridgeConfig = {
  contractInstance: Contract;
  balance: string;
  nativeTokenBalance: string | BigNumber | undefined;
  isTokenApprove: boolean;
  tokenContractInstance: Contract;
  chainsInfo: Array<ChainsConfig>;
  fromChains: Array<NetworksConfig>;
  toChains: Array<NetworksConfig>;
  isDefaultProvider: boolean;
};

export type UserInfo = {
  balance: string;
  nativeTokenBalance: string | BigNumber | undefined;
  isTokenApprove: boolean;
  isDefaultProvider: boolean;
};
