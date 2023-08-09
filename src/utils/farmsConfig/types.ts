export type FarmConfig = {
  name: string;
  icon: string;
  contractChain: number;
  id: number;
  farmId: number;
  stakingToken: {
    name: string;
    type: string;
    link: string;
    abi: any;
  };
  earnedToken: {
    name: string;
    abi: any;
  };
  contract: {
    name: string;
    address: string;
    abi: any;
  };
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
};
