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

export type BeamConfig = {
  contractInstance: Contract | null;
  balance: string;
  nativeTokenBalance: string | BigNumber | undefined;
  approvedAmount: BigNumber;
  tokenContractInstance: Contract | null;
  chainsInfo: Array<ChainsConfig>;
  fromChains: Array<NetworksConfig>;
  toChains: Array<NetworksConfig>;
};

export type UserInfo = {
  balance: string;
  nativeTokenBalance: string | BigNumber | undefined;
  approvedAmount: BigNumber;
};
