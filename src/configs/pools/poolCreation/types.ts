import type { Contract } from "@/configs/blast/types";

export type PoolCreationTokenConfig = {
    name: string;
    chainId: number;
    icon: string;
    decimals: number;
    contract: Contract;
    isPopular?: boolean;
}

export type PoolCreationTokenInfo = {
    config: PoolCreationTokenConfig;
    userInfo: TokenUserInfo;
}

export type TokenUserInfo = {
    balance: bigint;
    allowance: bigint;
}