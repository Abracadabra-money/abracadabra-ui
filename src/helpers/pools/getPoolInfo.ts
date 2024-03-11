import {
  getLpInfo,
  getUserLpInfo,
  querySellBase,
  querySellQuote,
} from "@/helpers/blast/swap/magicLp";

import {
  previewAddLiquidity,
  previewRemoveLiquidity,
} from "@/helpers/blast/swap/liquidity";

import { useImage } from "@/helpers/useImage";

import type { Address } from "viem";

import { getPublicClient } from "@/helpers/getPublicClient";
import BlastMagicLPAbi from "@/abis/BlastMagicLpAbi";
import BlastMIMSwapRouterAbi from "@/abis/BlastMIMSwapRouter";
import anySwapERC20Abi from "@/abis/tokensAbi/anySwapERC20Abi";

const SwapRouter = "0x15f57fbCB7A443aC6022e051a46cAE19491bC298";
const MimWethLp = "0x06894D4b33565dF998E80dE5D1718Ac5425DA216";

type Contract = {
  address: Address;
  abi: any;
};

export const getPoolInfo = async (
  account: Address = "0x8764F421AB0C682b4Ba1d7e269C09187c1EfbFAF",
  chainId: number
) => {
  const publicClient = getPublicClient(chainId);

  const getLpInfoResult = await getLpInfo(MimWethLp, chainId);

  const baseToken = await getTokenInfo(
    { address: getLpInfoResult.baseToken, abi: anySwapERC20Abi },
    account,
    publicClient,
    SwapRouter
  );

  const quoteToken = await getTokenInfo(
    { address: getLpInfoResult.quoteToken, abi: anySwapERC20Abi },
    account,
    publicClient,
    SwapRouter
  );

  const [balance, allowance]: any = await publicClient.multicall({
    contracts: [
      {
        address: MimWethLp,
        abi: anySwapERC20Abi as any,
        functionName: "balanceOf",
        args: [account],
      },
      {
        address: MimWethLp,
        abi: anySwapERC20Abi as any,
        functionName: "allowance",
        args: [account, SwapRouter],
      },
    ],
  });

  return {
    lpInfo: {
      ...getLpInfoResult,
      icon: useImage(`assets/images/tokens/MIM-WETH.png`),
      balance: balance.result,
      allowance: allowance.result,
    },
    tokens: { baseToken, quoteToken },
    swapRouter: SwapRouter,
  };
};

const getTokenInfo = async (
  contract: Contract,
  account: Address,
  publicClient: any,
  swapRouter: Address
) => {
  const { address, abi } = contract;
  const [name, symbol, decimals, balanceOf, allowance] =
    await publicClient.multicall({
      contracts: [
        {
          address: address,
          abi: abi,
          functionName: "name",
          args: [],
        },
        {
          address: address,
          abi: abi,
          functionName: "symbol",
          args: [],
        },
        {
          address: address,
          abi: abi,
          functionName: "decimals",
          args: [],
        },
        {
          address: address,
          abi: abi,
          functionName: "balanceOf",
          args: [account],
        },
        {
          address: address,
          abi: abi,
          functionName: "allowance",
          args: [account, swapRouter],
        },
      ],
    });

  return {
    name: name.result,
    symbol: symbol.result,
    icon: useImage(`assets/images/tokens/${symbol.result}.png`),
    decimals: decimals.result,
    balance: balanceOf.result,
    allowance: allowance.result,
    // balance: 10000000000000000000n,
    // allowance: 10000000000000000000n,
    contract,
  };
};
