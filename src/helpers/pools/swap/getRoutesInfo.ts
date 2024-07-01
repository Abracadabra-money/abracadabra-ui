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
