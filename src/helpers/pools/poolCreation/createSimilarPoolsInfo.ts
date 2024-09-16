import type { ActionConfig } from "@/helpers/pools/poolCreation/actions/createPool";
import { fetchPoolsByInfo } from "./queries/fetchPoolsByInfo";
import pools from "@/configs/pools/pools";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import BlastMagicLPAbi from "@/abis/BlastMagicLpAbi";

export const createSimilarPoolsInfo = async (actionConfig: ActionConfig, chainId: number) => {
    const similarPoolsSubgraph = await fetchPoolsByInfo(
        chainId,
        actionConfig
    );

    console.log("getSimilarPools", similarPoolsSubgraph);
    if (!similarPoolsSubgraph) return [];

    return (await Promise.all(similarPoolsSubgraph.map(async (info: any) => {
        return await getSimilarPoolItemInfo(info)
    }))).filter(poolItem => poolItem)
}


const getSimilarPoolItemInfo = async (subgraphInfo: any) => {
    const poolAddress = subgraphInfo.id;
    const { i, k, lpFeeRate } = subgraphInfo;

    const similarPoolConfig = pools.find(({ contract }) => contract.address === poolAddress);

    if (!similarPoolConfig) return false;

    const publicClient = getPublicClient(similarPoolConfig.chainId);

    const totalSupply = await publicClient.readContract({
        address: poolAddress,
        abi: BlastMagicLPAbi as any,
        functionName: "totalSupply",
        args: [],
    });

    return {
        ...similarPoolConfig, initialParameters: {
            I: BigInt(i),
            K: BigInt(k),
            lpFeeRate: BigInt(lpFeeRate)
        },
        totalSupply
    }
}