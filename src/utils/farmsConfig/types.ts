export type FarmConfig = {
  name: string;
  icon: string;
  // nameSubtitle?: string;
  contractChain: number;
  id: number;
  farmId: number;
  // stakingTokenType: string;
  // stakingTokenIcon: string;
  stakingTokenLink: string;
  stakingTokenName: string;
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
