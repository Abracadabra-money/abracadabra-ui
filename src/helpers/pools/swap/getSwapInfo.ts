import moment from "moment";
import type { Address } from "viem";
import type { TokenInfo } from "@/helpers/pools/swap/tokens";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { getSwapRouterByChain } from "@/configs/pools/routers";
import { findBestRoutes } from "@/helpers/pools/swap/findBestRoutes";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";

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
  fromBase: boolean;
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
    directions: 1n,
    minimumOut: outputAmount,
    deadline: deadline,
  };
};
