import type { Address } from "viem";
import { formatUnits, parseAbi, parseUnits } from "viem";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { localQuerySell, querySell } from "@/helpers/pools/swap/querySell";
import { calculatePriceImpactSingleSwap } from "@/helpers/pools/priceImpact";
import type { ActionConfig, RouteInfo } from "@/helpers/pools/swap/getSwapInfo";

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
  if (!lpInfo || amount <= 0n)
    return {
      fee: 0n,
      mtFee: 0n,
      lpFee: 0n,
      outputAmount: 0n,
      outputAmountWithoutFee: 0n,
    };

  if (!account) return localQuerySell(amount, lpInfo, sellBase);
  return querySell(lpInfo, account, sellBase, amount);
};

const filterLiquidPools = (
  pairs: MagicLPInfo[],
  fromToken: Address,
  amountToSwap: bigint
) => {
  return pairs.filter((config) => {
    try {
      const sellBase =
        fromToken.toLowerCase() === config.baseToken.toLowerCase();

      const fromTokenDecimals = sellBase
        ? config.config.baseToken.decimals
        : config.config.quoteToken.decimals;

      const sellAmount = amountToSwap
        ? amountToSwap
        : parseUnits("1", fromTokenDecimals);

      localQuerySell(sellAmount, config, sellBase);

      return true;
    } catch (error) {
      return false;
    }
  });
};

export const findBestSwapPath = (
  pairs: MagicLPInfo[],
  fromToken: Address,
  toToken: Address,
  amountToSwap: bigint // Обсяг токенів, які ми хочемо обміняти
) => {
  const graph: Graph = {};
  const visited = new Set();
  const bestCosts = { [fromToken.toLowerCase()]: 0 };

  const filteredPairs = filterLiquidPools(pairs, fromToken, amountToSwap);

  // Заповнюємо граф
  filteredPairs.forEach(
    ({ baseToken, quoteToken, lpFeeRate, totalSupply, id }) => {
      const fees = Number(formatUnits(lpFeeRate, 18)); // Комісія
      const tvl = Number(formatUnits(totalSupply, 18)); // Ліквідність
      const weight = fees / tvl; // Вага ребра враховує комісію і ліквідність

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
    }
  );

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
      const poolInfo = filteredPairs.find(
        (pool) => pool.id.toLowerCase() === pair.toLowerCase()
      );

      if (!poolInfo) return;

      const { baseToken } = poolInfo;

      const fromBase = currentToken.toLowerCase() === baseToken.toLowerCase();

      let newAmountToSwap = 0n;
      let priceImpact = 100;

      try {
        newAmountToSwap = localQuerySell(
          currentAmount,
          poolInfo,
          fromBase
        ).outputAmount;

        priceImpact = calculatePriceImpactSingleSwap(
          poolInfo,
          currentAmount,
          newAmountToSwap,
          fromBase
        );
      } catch (error) {
        console.error("Error fetching output amount:", error);
      }

      const newCost = currentCost + weight + priceImpact; // Вар тість із врахуванням fees, TVL та прослизання

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

      const { fee, mtFee, lpFee, outputAmount, outputAmountWithoutFee } =
        await fetchOutputAmount(pool, account, fromBase, previousReceiveAmount);

      const priceImpact = calculatePriceImpactSingleSwap(
        pool,
        previousReceiveAmount,
        outputAmount,
        fromBase
      );

      previousReceiveAmount = outputAmount;

      route.push({
        inputToken: fromToken,
        outputToken: toToken as Address,
        inputAmount: fromInputValue,
        outputAmount,
        outputAmountWithoutFee,
        mtFee,
        fee,
        lpFee,
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
