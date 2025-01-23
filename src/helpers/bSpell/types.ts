import type { Address } from "viem";

export type bSpellConfig = {
  spell: {
    name: string;
    decimals: number;
    icon: string;
    contract: {
      address: Address;
      abi: any;
    };
  };
  bSpell: {
    name: string;
    decimals: number;
    icon: string;
    contract: {
      address: Address;
      abi: any;
    };
  };
  tokenBank: {
    address: Address;
    abi: any;
  };
  stakeInfo?: {
    address: Address;
    abi: any;
  };
  rewardTokensInfo?: {
    name: string;
    decimals: number;
    icon: string;
    contract: {
      abi: any;
      address: Address;
      addressForPrice?: Address;
    };
  }[];
};

export type bSpellConfigs = {
  [key: number]: bSpellConfig;
};

export type AprInfo = {
  totalApr: number;
  tokensApr: {
    address: Address;
    apr: number;
    price: number;
    icon: string;
    name: string;
  }[];
};

export type RewardTokenInfo = {
  name: string;
  icon: string;
  decimals: number;
  rewardAmount: bigint;
  price: number;
  contract: {
    abi: any;
    address: Address;
    addressForPrice?: Address;
  };
};

export type BSpellInfo = {
  chainId: number;
  spell: {
    name: string;
    decimals: number;
    icon: string;
    contract: {
      address: Address;
      abi: any;
    };
    price: number;
    balance: bigint;
    approvedAmount: bigint;
  };
  bSpell: {
    name: string;
    decimals: number;
    icon: string;
    contract: {
      address: Address;
      abi: any;
    };
    price: number;
    balance: bigint;
    approvedAmount: bigint;
    totalSupply: bigint;
  };
  tokenBank: {
    address: Address;
    abi: any;
  };
  lockInfo: {
    lockAmount: bigint;
    claimAmount: bigint;
    userLocks: {
      amount: bigint;
      unlockTime: bigint;
    }[];
    lockDuration: bigint;
    instantRedeemParams: {
      immediateBips: bigint;
      burnBips: bigint;
      feeCollector: Address;
    };
  };
  stakeInfo: {
    contract: {
      address: Address;
      abi: any;
    };
    stakeBalance: bigint;
    approvedAmount: bigint;
    totalSupply: bigint;
    lastAdded: bigint;
    lockupPeriod: bigint;
    unlockTime: number;
  } | null;
  rewardTokensInfo: RewardTokenInfo[] | null;
};

export type TokenPrice = {
  address: Address;
  price: number;
};

export type TabInfo = {
  name: string;
  title: string;
  icon?: string;
};
