import type { PoolCreationTokenConfig, PoolCreationTokenInfo, TokenUserInfo } from "@/configs/pools/poolCreation/types";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { Address } from "viem";

export const getPoolCreationTokenInfo = async (tokenConfig: PoolCreationTokenConfig, price: number, account?: Address): Promise<PoolCreationTokenInfo> => {
    const tokenInfo: PoolCreationTokenInfo = { config: tokenConfig, price, userInfo: { allowance: 0n, balance: 0n } }

    if (account) {
        tokenInfo.userInfo = await getTokenUserInfo(tokenConfig, account)
    }

    return tokenInfo
}

const getTokenUserInfo = async (tokenConfig: PoolCreationTokenConfig, account: Address): Promise<TokenUserInfo> => {
    const publicClient = getPublicClient(tokenConfig.chainId)

    const routerAddress = getSwapRouterByChain(tokenConfig.chainId)

    const [allowance, balanceOf]: any = await publicClient.multicall({
        contracts: [{
            address: tokenConfig.contract.address,
            abi: tokenConfig.contract.abi,
            functionName: "allowance",
            args: [account, routerAddress],
        },
        {
            address: tokenConfig.contract.address,
            abi: tokenConfig.contract.abi,
            functionName: "balanceOf",
            args: [account],
        }]
    })

    return { allowance: allowance.result, balance: balanceOf.result }
}