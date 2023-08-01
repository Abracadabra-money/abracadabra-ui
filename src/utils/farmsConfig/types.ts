export type FarmConfig = {
  name: string;
  icon: string;
  nameSubtitle: string;
  contractChain: number;
  id: number;
  poolId: number;
  stakingTokenType: string;
  stakingTokenName: string;
  stakingTokenIcon: string;
  stakingTokenLink: string;
  depositedBalance?: {
    token0: {
      name: string;
      icon: string;
    };
    token1: {
      name: string;
      icon: string;
    };
  };
  stakingTokenAbi: any;
  contract: {
    name: string;
    address: string;
    abi: any;
  };
  earnedToken: {
    name: string;
    abi: any;
  };
};
