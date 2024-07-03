import moment from "moment";
import type { Address } from "viem";
import type { TokenInfo } from "@/helpers/pools/swap/tokens";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import { querySellBase, querySellQuote } from "@/helpers/pools/swap/magicLp";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import DecimalMath from "./libs/DecimalMath";

const EMPTY_TOKEN_NAME = "Select Token";

export type ActionConfig = {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  fromInputValue: bigint;
  toInputValue: bigint;
  slippage: bigint;
  deadline: bigint;
};

export type RouteInfo = {
  inputToken: string;
  outputToken: Address;
  inputAmount: bigint;
  outputAmount: bigint;
  outputAmountWithoutFee: bigint;
  mtFee: bigint;
  lpFee: bigint;
  fees: bigint;
  lpInfo: MagicLPInfo;
};

const fetchOutputAmount = async (
  lpInfo: any,
  account: any,
  sellBase = true,
  amount: bigint
) => {
  if (!account) {
    if (sellBase) {
      const { receiveQuoteAmount, mtFee } = querySellBase(
        amount,
        lpInfo,
        lpInfo.userInfo
      );

      return {
        receiveAmount: receiveQuoteAmount,
        mtFee: mtFee,
      };
    } else {
      const { receiveBaseAmount, mtFee } = querySellQuote(
        amount,
        lpInfo,
        lpInfo.userInfo
      );

      return {
        receiveAmount: receiveBaseAmount,
        mtFee: mtFee,
      };
    }
  }

  const chainId = lpInfo.chainId;
  const publicClient = getPublicClient(chainId);
  const result = await publicClient.readContract({
    address: lpInfo.contract.address,
    abi: lpInfo.contract.abi,
    functionName: sellBase ? "querySellBase" : "querySellQuote",
    args: [account, amount],
  });

  return {
    receiveAmount: result[0] ? result[0] : 0n,
    mtFee: result[1] ? result[1] : 0n,
  };
};

export const getSwapInfo = async (
  pools: MagicLPInfo[],
  actionConfig: ActionConfig,
  chainId: number,
  account: Address
) => {
  if (!pools || !pools.length) return getSwapInfoEmptyState(actionConfig);

  const routes = await findBestRoutes(pools, actionConfig, account);
  if (!routes || routes.length === 0)
    return getSwapInfoEmptyState(actionConfig);

  const inputAmount = routes[0].inputAmount;
  const outputAmount = routes[routes?.length - 1].outputAmount;
  const outputAmountWithSlippage = applySlippageToMinOutBigInt(
    actionConfig.slippage,
    outputAmount
  );

  const transactionInfo = getTransactionInfo(
    routes,
    actionConfig,
    chainId,
    account
  );

  return {
    routes,
    actionConfig,
    inputAmount,
    outputAmount,
    outputAmountWithSlippage,
    transactionInfo,
  };
};

export const getSwapInfoEmptyState = (actionConfig: ActionConfig) => {
  const { fromInputValue } = actionConfig;

  return {
    routes: [],
    actionConfig,
    outputAmount: fromInputValue,
    outputAmountWithSlippage: fromInputValue,
    transactionInfo: {
      methodName: "",
      payload: {},
      swapRouterAddress: "",
    },
  };
};

export const findBestRoutes = async (
  pools: MagicLPInfo[],
  { fromToken, toToken, fromInputValue }: ActionConfig,
  account: Address
): Promise<RouteInfo[] | null> => {
  let bestRoute: RouteInfo[] | null = null;

  const fromTokenName = fromToken.config.name;
  const toTokenName = toToken.config.name;

  if (fromTokenName === EMPTY_TOKEN_NAME || toTokenName === EMPTY_TOKEN_NAME)
    return null;

  // Create a map of token to pool for quick lookup
  const tokenToPools: Record<string, MagicLPInfo[]> = {};
  pools.forEach((pool) => {
    tokenToPools[pool.baseToken] = tokenToPools[pool.baseToken] || [];
    tokenToPools[pool.quoteToken] = tokenToPools[pool.quoteToken] || [];
    tokenToPools[pool.baseToken].push(pool);
    tokenToPools[pool.quoteToken].push(pool);
  });

  // Stack for DFS
  const stack: {
    token: string;
    amount: bigint;
    route: RouteInfo[];
    visited: Set<string>;
  }[] = [
    {
      token: fromToken.config.contract.address,
      amount: fromInputValue,
      route: [],
      visited: new Set(),
    },
  ];

  while (stack.length > 0) {
    const { token, amount, route, visited } = stack.pop()!;
    visited.add(token);

    if (token === toToken.config.contract.address) {
      if (
        !bestRoute ||
        route.reduce((acc, r) => acc + r.fees, 0n) <
          bestRoute.reduce((acc, r) => acc + r.fees, 0n) ||
        (route.reduce((acc, r) => acc + r.fees, 0n) ===
          bestRoute.reduce((acc, r) => acc + r.fees, 0n) &&
          route[route.length - 1].outputAmount >
            bestRoute[bestRoute.length - 1].outputAmount)
      ) {
        bestRoute = route;
      }
      continue;
    }

    try {
      await Promise.all(
        tokenToPools[token].map(async (pool: any) => {
          const nextToken =
            pool.baseToken === token ? pool.quoteToken : pool.baseToken;
          if (visited.has(nextToken)) {
            return;
          }

          const { receiveAmount, mtFee } = !fromInputValue
            ? { receiveAmount: 0n, mtFee: 0n }
            : await fetchOutputAmount(
                pool,
                account,
                pool.baseToken === token,
                amount
              );

          const lpFeeRate = pool.userInfo.userFeeRate.lpFeeRate;
          const mtFeeRate = pool.userInfo.userFeeRate.mtFeeRate;

          // Notice: need to review
          const lpFeeAmount =
            mtFeeRate === lpFeeRate
              ? mtFee
              : DecimalMath.mulFloor(receiveAmount, lpFeeRate);

          const receiveAmountWithoutFee = receiveAmount + mtFee + lpFeeAmount;

          stack.push({
            token: nextToken,
            amount: receiveAmount,
            route: route.concat([
              {
                inputToken: token,
                outputToken: nextToken,
                inputAmount: amount,
                outputAmount: receiveAmount,
                outputAmountWithoutFee: receiveAmountWithoutFee,
                mtFee,
                lpFee: lpFeeAmount,
                fees: pool.lpFeeRate,
                lpInfo: pool,
              },
            ]),
            visited: new Set(visited),
          });
        })
      );
    } catch (error) {
      return null;
    }
  }

  return bestRoute;
};

const getTransactionInfo = (
  routes: RouteInfo[],
  actionConfig: ActionConfig,
  chainId: number,
  account: Address
) => {
  const methodName = getMethodName(routes, actionConfig);
  const payload = getPayloadByMethod(methodName, routes, actionConfig, account);
  const swapRouterAddress: Address = getSwapRouterByChain(chainId);

  return {
    methodName,
    payload,
    swapRouterAddress,
  };
};

const getMethodName = (routes: RouteInfo[], actionConfig: ActionConfig) => {
  if (routes.length === 1) {
    const { address: fromTokenAddress } =
      actionConfig.fromToken.config.contract;
    const { baseToken, quoteToken } = routes[0].lpInfo;

    switch (fromTokenAddress) {
      case baseToken:
        return "sellBaseTokensForTokens";
      case quoteToken:
        return "sellQuoteTokensForTokens";
    }
  }

  return "swapTokensForTokens";
};

const getPayloadByMethod = (
  methodName: string,
  routes: RouteInfo[],
  actionConfig: ActionConfig,
  account: Address
) => {
  switch (methodName) {
    case "sellBaseTokensForTokens":
      return sellBaseTokensForTokensPayload(routes[0], actionConfig, account);
    case "sellQuoteTokensForTokens":
      return sellQuoteTokensForTokensPayload(routes[0], actionConfig, account);
    case "swapTokensForTokens":
      return swapTokensForTokensPayload(routes, actionConfig, account);
  }
};

const sellBaseTokensForTokensPayload = (
  route: RouteInfo,
  actionConfig: ActionConfig,
  account: Address
) => {
  const { lpInfo, inputAmount, outputAmount } = route;
  const deadline = moment().unix() + Number(actionConfig.deadline);
  const outputAmountWithSlippage = applySlippageToMinOutBigInt(
    actionConfig.slippage,
    outputAmount
  );

  return {
    lp: lpInfo.contract.address,
    to: account,
    amountIn: inputAmount,
    minimumOut: outputAmountWithSlippage,
    deadline,
  };
};

const sellQuoteTokensForTokensPayload = (
  route: RouteInfo,
  actionConfig: ActionConfig,
  account: Address
) => {
  const { lpInfo, inputAmount, outputAmount } = route;
  const deadline = moment().unix() + Number(actionConfig.deadline);

  const outputAmountWithSlippage = applySlippageToMinOutBigInt(
    actionConfig.slippage,
    outputAmount
  );

  return {
    lp: lpInfo.contract.address,
    to: account,
    amountIn: inputAmount,
    minimumOut: outputAmountWithSlippage,
    deadline,
  };
};

const swapTokensForTokensPayload = (
  routes: RouteInfo[],
  actionConfig: ActionConfig,
  account: Address
) => {
  const { fromInputValue } = actionConfig;
  const path: Address[] = routes.map((route) => route.lpInfo.contract.address);
  const outputAmount = routes[routes.length - 1].outputAmount;
  const deadline = moment().unix() + Number(actionConfig.deadline);

  return {
    to: account,
    amountIn: fromInputValue,
    path,
    directions: 0n,
    minimumOut: outputAmount,
    deadline: deadline,
  };
};