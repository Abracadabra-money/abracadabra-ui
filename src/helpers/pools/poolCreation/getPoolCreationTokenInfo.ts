import type { PoolCreationTokenConfig, PoolCreationTokenInfo, TokenUserInfo } from "@/configs/pools/poolCreation/types";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getCoinsPrices } from "@/helpers/prices/defiLlama";
import type { ContractInfo } from "@/types/global";
import type { Address } from "viem";
import erc20Abi from "@/abis/farm/erc20Abi";
import baseTokenIcon from "@/assets/images/base_token_icon.png"


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

export const createTokenConfigByAddress = async (address: Address, chainId: number): Promise<PoolCreationTokenConfig | null> => {
    try {
        const publicClient = getPublicClient(chainId)

        const [name, symbol, decimals] = await publicClient.multicall({
            contracts: [
                {
                    address: address,
                    abi: erc20Abi,
                    functionName: "name",
                    args: [],
                },
                {
                    address: address,
                    abi: erc20Abi,
                    functionName: "symbol",
                    args: [],
                },
                {
                    address: address,
                    abi: erc20Abi,
                    functionName: "decimals",
                    args: [],
                },
            ],
        })

        return {
            chainId,
            address,
            name: name.result,
            symbol: symbol.result,
            decimals: decimals.result,
            icon: baseTokenIcon,
            abi: erc20Abi
        }

    } catch (error) {
        console.log('creating custom token config error: ', error);
        return null;
    }
}