import moment from "moment";
import type { Address } from "viem";
import type { TokenInfo } from "@/helpers/pools/swap/tokens";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import { querySellBase, querySellQuote } from "@/helpers/pools/swap/magicLp";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";

type ActionConfig = {
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
  fees: bigint;
  lpInfo: MagicLPInfo;
};

export const getSwapInfo = (
  pools: MagicLPInfo[],
  actionConfig: ActionConfig,
  chainId: number,
  account: Address
) => {
  if (!pools || !pools.length) return getEmptyState(actionConfig);
  if (!actionConfig.fromInputValue) return getEmptyState(actionConfig);

  const routes = findBestRoutes(pools, actionConfig);
  if (!routes || routes.length === 0) return getEmptyState(actionConfig);

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

const getEmptyState = (actionConfig: ActionConfig) => {
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

const findBestRoutes = (
  pools: MagicLPInfo[],
  { fromToken, toToken, fromInputValue }: ActionConfig
): RouteInfo[] | null => {
  let bestRoute: RouteInfo[] | null = null;

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

    tokenToPools[token].forEach((pool: any) => {
      const nextToken =
        pool.baseToken === token ? pool.quoteToken : pool.baseToken;
      if (visited.has(nextToken)) {
        return;
      }

      const outputAmount = !fromInputValue
        ? 0n
        : pool.baseToken === token
        ? querySellBase(amount, pool, pool.userInfo).receiveQuoteAmount
        : querySellQuote(amount, pool, pool.userInfo).receiveBaseAmount;

      stack.push({
        token: nextToken,
        amount: outputAmount,
        route: route.concat([
          {
            inputToken: token,
            outputToken: nextToken,
            inputAmount: amount,
            outputAmount,
            fees: pool.lpFeeRate,
            lpInfo: pool,
          },
        ]),
        visited: new Set(visited),
      });
    });
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

  return {
    lp: lpInfo.contract.address,
    to: account,
    amountIn: inputAmount,
    minimumOut: outputAmount,
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

  return {
    lp: lpInfo.contract.address,
    to: account,
    amountIn: inputAmount,
    minimumOut: outputAmount,
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
