import { formatUnits, type Address } from "viem";
import { formatPercent } from "@/helpers/filters";
import type { TokenInfo } from "@/helpers/pools/swap/tokens";
import type { RouteInfo } from "@/helpers/pools/swap/getSwapInfo";

export type RoutesInfo = {
  address: Address | undefined;
  icon: string | undefined;
  percent: string;
};

const FEES_DECIMALS = 16;

export const getRoutesInfo = (
  tokensList: TokenInfo[] | undefined,
  routes: RouteInfo[] | undefined
): RoutesInfo[] => {
  if (!tokensList?.length || !routes?.length) return [];

  const path: {
    address: Address | undefined;
    icon: string | undefined;
    percent: string;
  }[] = [];

  routes?.forEach((route: RouteInfo) => {
    const inputTokenInfo = tokensList?.find(
      ({ config }: TokenInfo) =>
        config.contract.address.toLowerCase() === route.inputToken.toLowerCase()
    );

    const outputTokenTokenInfo = tokensList?.find(
      ({ config }: TokenInfo) =>
        config.contract.address.toLowerCase() ===
        route.outputToken.toLowerCase()
    );

    if (!outputTokenTokenInfo) return null;

    path.push({
      address: inputTokenInfo?.config.contract.address,
      icon: inputTokenInfo?.config.icon,
      percent: "100%",
    });

    path.push({
      address: outputTokenTokenInfo?.config.contract.address,
      icon: route.lpInfo.icon,
      percent: formatPercent(formatUnits(route.fees, FEES_DECIMALS)),
    });
  });

  return path;
};

export const getChunkedRoutesInfo = (routes: RouteInfo[] | undefined) => {
  const routesInfo: Array<{
    address: string;
    icon: string;
    percent: string;
  }> = [];

  routes?.forEach((route: RouteInfo) => {
    const inputTokenIcon = route.fromBase
      ? route.lpInfo.config.baseToken.icon
      : route.lpInfo.config.quoteToken.icon;

    const outputTokenIcon = route.fromBase
      ? route.lpInfo.config.quoteToken.icon
      : route.lpInfo.config.baseToken.icon;

    routesInfo.push({
      address: route.inputToken,
      icon: inputTokenIcon,
      percent: "100%",
    });

    routesInfo.push({
      address: route.lpInfo.contract.address,
      icon: route.lpInfo.icon,
      percent: formatPercent(formatUnits(route.fees, FEES_DECIMALS)),
    });

    routesInfo.push({
      address: route.outputToken,
      icon: outputTokenIcon,
      percent: "100%",
    });
  });

  const chunkSize = 3;
  const result = [];

  for (let i = 0; i < routesInfo.length; i += chunkSize) {
    result.push(routesInfo.slice(i, i + chunkSize));
  }

  return result;
};
