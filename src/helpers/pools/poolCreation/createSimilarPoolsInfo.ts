import type { ActionConfig } from "@/helpers/pools/poolCreation/actions/createPool";
import type { Address } from "viem";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { getPoolsList } from "@/helpers/pools/getPoolsList";
import { getPoolConfigs } from "@/helpers/pools/getPoolConfigs";
export const createSimilarPoolsInfo = async (actionConfig: ActionConfig, account: Address) => {
    const similarConfigs = (await getPoolConfigs()).filter(({ baseToken, quoteToken }) =>
        baseToken.contract.address === actionConfig.baseToken &&
        quoteToken.contract.address === actionConfig.quoteToken);

    const similarPools = await getPoolsList(account, similarConfigs)

    return similarPools.sort((poolA: MagicLPInfo, poolB: MagicLPInfo) => {
        const a = poolA.totalSupply;
        const b = poolB.totalSupply;
        return a > b ? 1 : -1
    })
}


export const checkIdentity = (pool: MagicLPInfo, actionConfig: ActionConfig) => {
    const {
        K: poolK,
        lpFeeRate: poolFeeRate,
    } = pool.initialParameters;
    const { K, lpFeeRate } = actionConfig;
    return K === poolK && lpFeeRate === poolFeeRate;
}