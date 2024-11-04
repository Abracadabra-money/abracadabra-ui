import type { Address } from "viem";

export type LockerConfig = {
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
};

export type LockerConfigs = {
  [key: number]: LockerConfig;
};

export type ActionConfig = {
  selectedNetwork: number;
  availableNetworks: number[];
};

export type LockerInfo = {
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
