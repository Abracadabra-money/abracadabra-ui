import type { PoolCreationTokenConfig, PoolCreationTokenInfo, TokenUserInfo } from "@/configs/pools/poolCreation/types";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import type { ContractInfo } from "@/types/global";
import type { Address } from "viem";

export type GetPoolCreationTokenInfoArguments = {
    tokenConfig: PoolCreationTokenConfig;
    price?: number;
    account?: Address;
}

export const getPoolCreationTokenInfo = async ({ tokenConfig, price, account }: GetPoolCreationTokenInfoArguments): Promise<PoolCreationTokenInfo> => {
    if (!price) {
        const { chainId, address } = tokenConfig
        price = (await getCoinsPrices(chainId, [address]))[0].price
    }

    const tokenInfo: PoolCreationTokenInfo = { config: tokenConfig, price, userInfo: { allowance: 0n, balance: 0n } }

    if (account) {
        tokenInfo.userInfo = await getTokenUserInfo(tokenConfig, account)
    }

    return tokenInfo
}

export const getTokenUserInfo = async (tokenConfig: PoolCreationTokenConfig, account: Address): Promise<TokenUserInfo> => {
    const publicClient = getPublicClient(tokenConfig.chainId)

    const routerAddress = getSwapRouterByChain(tokenConfig.chainId)

    const [allowance, balanceOf]: any = await publicClient.multicall({
        contracts: [{
            address: tokenConfig.address,
            abi: tokenConfig.abi,
            functionName: "allowance",
            args: [account, routerAddress],
        },
        {
            address: tokenConfig.address,
            abi: tokenConfig.abi,
            functionName: "balanceOf",
            args: [account],
        }]
    })

    return { allowance: allowance.result, balance: balanceOf.result }
}

export const getTokenAllowance = async (tokenContract: ContractInfo, chainId: number, account: Address) => {
    const publicClient = getPublicClient(chainId)

    const routerAddress = getSwapRouterByChain(chainId)

    return await publicClient.readContract({
        chainId: chainId,
        address: tokenContract.address,
        abi: tokenContract.abi,
        functionName: "allowance",
        args: [account, routerAddress],
    })
}