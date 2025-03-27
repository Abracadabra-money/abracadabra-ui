import { formatUnits } from "viem";
import type { Address } from "viem";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import DecimalMath from "@/helpers/pools/swap/libs/DecimalMath";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { querySellBase, querySellQuote } from "@/helpers/pools/swap/magicLp";
import type { ActionConfig, RouteInfo } from "@/helpers/pools/swap/getSwapInfo";
import { calculatePriceImpactSingleSwap } from "@/helpers/pools/swap/priceImpact";

type Graph = Record<string, { token: string; weight: number; pair: string }[]>;

type Swaps = {
  pair: string;
  fromToken: string;
  toToken: string;
  fromBase: boolean;
};

type QueueElement = {
  token: string;
  swaps: Swaps[];
  currentAmount: bigint;
};

type PriorityQueueItem = {
  element: QueueElement;
  priority: number;
};

class PriorityQueue {
  items: PriorityQueueItem[];

  constructor() {
    this.items = [] as PriorityQueueItem[];
  }

  enqueue(element: QueueElement, priority: number) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

const fetchOutputAmount = async (
  lpInfo: MagicLPInfo,
  account: Address | null,
  sellBase = true,
  amount: bigint
) => {
  if (!lpInfo || amount <= 0n) return { receiveAmount: 0n, mtFee: 0n };

  if (!account) {
    return getOutputAmountLocal(lpInfo, sellBase, amount);
  }

  const publicClient = getPublicClient(lpInfo.chainId);

  try {
    const result: any = await publicClient.readContract({
      address: lpInfo.contract.address,
      abi: lpInfo.contract.abi,
      functionName: sellBase ? "querySellBase" : "querySellQuote",
      args: [account, amount],
    });

    return {
      receiveAmount: result[0] || 0n,
      mtFee: result[1] || 0n,
    };
  } catch (error) {
    console.error("Error fetching output amount from contract:", error);
    return { receiveAmount: 0n, mtFee: 0n };
  }
};

const getOutputAmountLocal = (
  lpInfo: MagicLPInfo,
  sellBase = true,
  amount: bigint
) => {
  if (!lpInfo || amount <= 0n) return { receiveAmount: 0n, mtFee: 0n };

  if (sellBase) {
    const response = querySellBase(amount, lpInfo, lpInfo.userInfo);
    return {
      receiveAmount: response.receiveQuoteAmount,
      mtFee: response.mtFee,
    };
  } else {
    const response = querySellQuote(amount, lpInfo, lpInfo.userInfo);
    return {
      receiveAmount: response.receiveBaseAmount,
      mtFee: response.mtFee,
    };
  }
};

export const findBestSwapPath = (
  pairs: MagicLPInfo[],
  fromToken: Address,
  toToken: Address,
  amountToSwap: bigint
) => {
  const graph: Graph = {};
  const visited = new Set();
  const bestCosts = { [fromToken.toLowerCase()]: 0 };

  // Filling the graph
  pairs.forEach(({ baseToken, quoteToken, lpFeeRate, totalSupply, id }) => {
    const fees = Number(formatUnits(lpFeeRate, 18));
    const tvl = Number(formatUnits(totalSupply, 18));
    const weight = fees / tvl; // The weight of the rib takes into account Fees and TVL

    const baseTokenAddress = baseToken.toLowerCase();
    const quoteTokenAddress = quoteToken.toLowerCase();

    if (!graph[baseTokenAddress]) graph[baseTokenAddress] = [];
    if (!graph[quoteTokenAddress]) graph[quoteTokenAddress] = [];

    graph[baseTokenAddress].push({
      token: quoteTokenAddress,
      weight,
      pair: id,
    });
    graph[quoteTokenAddress].push({
      token: baseTokenAddress,
      weight,
      pair: id,
    });
  });

  const pq = new PriorityQueue();
  pq.enqueue(
    { token: fromToken.toLowerCase(), swaps: [], currentAmount: amountToSwap },
    0
  );

  while (!pq.isEmpty()) {
    const dequeuedItem = pq.dequeue();

    if (!dequeuedItem) continue;

    const {
      element: { token: currentToken, swaps, currentAmount },
      priority: currentCost,
    } = dequeuedItem;

    if (currentToken.toLowerCase() === toToken.toLowerCase()) return swaps;

    if (visited.has(currentToken.toLowerCase())) continue;
    visited.add(currentToken.toLowerCase());

    const neighbors = graph[currentToken.toLowerCase()] || [];
    neighbors.forEach(({ token: neighbor, weight, pair }) => {
      const poolInfo = pairs.find(
        (pool) => pool.id.toLowerCase() === pair.toLowerCase()
      );

      if (!poolInfo) return;

      const { baseToken } = poolInfo;

      const fromBase = currentToken.toLowerCase() === baseToken.toLowerCase();

      let newAmountToSwap = 0n;
      let priceImpact = 100;

      try {
        newAmountToSwap = getOutputAmountLocal(
          poolInfo,
          fromBase,
          currentAmount
        ).receiveAmount;

        priceImpact = calculatePriceImpactSingleSwap(
          poolInfo,
          currentAmount,
          newAmountToSwap,
          fromBase
        );
      } catch (error) {
        console.error("Error fetching output amount:", error);
      }

      const newCost = currentCost + weight + priceImpact; // Вартість із врахуванням fees, TVL та прослизання

      if (!(neighbor in bestCosts) || newCost < bestCosts[neighbor]) {
        bestCosts[neighbor] = newCost;

        const newSwap = {
          pair: pair,
          fromToken: currentToken,
          toToken: neighbor,
          fromBase: currentToken.toLowerCase() === baseToken.toLowerCase(),
        };

        pq.enqueue(
          {
            token: neighbor,
            swaps: [...swaps, newSwap],
            currentAmount: newAmountToSwap,
          },
          newCost
        );
      }
    });
  }

  return [];
};

export const findBestRoutes = async (
  pools: MagicLPInfo[],
  { fromToken, toToken, fromInputValue }: ActionConfig,
  account: Address
): Promise<RouteInfo[] | null> => {
  try {
    const bestSwapPath = findBestSwapPath(
      pools,
      fromToken.config.contract.address,
      toToken.config.contract.address,
      fromInputValue
    );

    if (!bestSwapPath || bestSwapPath.length === 0) return null;

    const route: RouteInfo[] = [];
    let previousReceiveAmount = fromInputValue;

    for (const { fromBase, fromToken, pair, toToken } of bestSwapPath) {
      const pool = pools.find((p) => p.id === pair);
      if (!pool) continue;

      const { receiveAmount, mtFee } = await fetchOutputAmount(
        pool,
        account,
        fromBase,
        previousReceiveAmount
      );

      const { lpFeeRate, mtFeeRate } = pool.userInfo.userFeeRate;

      const lpFeeAmount =
        mtFeeRate === lpFeeRate
          ? mtFee
          : DecimalMath.mulFloor(receiveAmount, lpFeeRate);

      const receiveAmountWithoutFee = receiveAmount + mtFee + lpFeeAmount;

      const priceImpact = calculatePriceImpactSingleSwap(
        pool,
        previousReceiveAmount,
        receiveAmount,
        fromBase
      );

      previousReceiveAmount = receiveAmount;

      route.push({
        inputToken: fromToken,
        outputToken: toToken as Address,
        inputAmount: fromInputValue,
        outputAmount: receiveAmount,
        outputAmountWithoutFee: receiveAmountWithoutFee,
        mtFee,
        lpFee: lpFeeAmount,
        fees: pool.lpFeeRate,
        lpInfo: pool,
        fromBase,
        priceImpact,
      });
    }

    return route;
  } catch (error) {
    console.error("Error finding best routes:", error);
    return null;
  }
};
