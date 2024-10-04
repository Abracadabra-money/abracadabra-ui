import { formatUnits } from "viem";
import type { Address } from "viem";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import DecimalMath from "@/helpers/pools/swap/libs/DecimalMath";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { querySellBase, querySellQuote } from "@/helpers/pools/swap/magicLp";
import type { ActionConfig, RouteInfo } from "@/helpers/pools/swap/getSwapInfo";

type Graph = Record<string, { token: Address; weight: number; pair: string }[]>;

type Swaps = {
  pair: string;
  fromToken: Address;
  toToken: Address;
  fromBase: boolean;
};

type QueueElement = {
  token: Address;
  swaps: Swaps[];
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
  }

  const publicClient = getPublicClient(lpInfo.chainId);

  try {
    const result = await publicClient.readContract({
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

export const findBestSwapPath = (
  pairs: MagicLPInfo[],
  fromToken: Address,
  toToken: Address
) => {
  // Створюємо граф у вигляді словника, де ключ - токен,
  // а значення - список сусідніх токенів з вагою ребра та id пари
  const graph: Graph = {};
  const visited = new Set();
  const bestCosts = { [fromToken]: 0 };

  // Заповнюємо граф
  pairs.forEach(({ baseToken, quoteToken, lpFeeRate, totalSupply, id }) => {
    const fees = Number(formatUnits(lpFeeRate, 18)); // Комісія
    const tvl = Number(formatUnits(totalSupply, 18)); // Ліквідність
    const weight = fees * (1 / tvl); // Вага ребра враховує комісію і ліквідність

    if (!graph[baseToken as keyof typeof graph]) graph[baseToken] = [];
    if (!graph[quoteToken as keyof typeof graph]) graph[quoteToken] = [];
    graph[baseToken].push({ token: quoteToken, weight, pair: id });
    graph[quoteToken].push({ token: baseToken, weight, pair: id });
  });

  // Використовуємо алгоритм Дейкстри для пошуку найкращого шляху
  const pq = new PriorityQueue();
  pq.enqueue({ token: fromToken, swaps: [] }, 0);

  while (!pq.isEmpty()) {
    const dequeuedItem = pq.dequeue();
    if (!dequeuedItem) continue;

    const {
      element: { token: currentToken, swaps },
      priority: currentCost,
    } = dequeuedItem;

    // Якщо досягли цільового токену, повертаємо масив з об'єктами
    if (currentToken === toToken) return swaps;

    if (visited.has(currentToken)) continue;
    visited.add(currentToken);

    // Додаємо сусідні токени у чергу для подальшого пошуку
    const neighbors = graph[currentToken] || [];
    neighbors.forEach(({ token: neighbor, weight, pair }) => {
      const newCost = currentCost + weight;
      if (!(neighbor in bestCosts) || newCost < bestCosts[neighbor]) {
        bestCosts[neighbor] = newCost;

        const poolInfo = pairs.find(
          (pool) => pool.id.toLowerCase() === pair.toLowerCase()
        );

        if (!poolInfo) return;
        const { baseToken }: MagicLPInfo = poolInfo;

        const newSwap = {
          pair: pair,
          fromToken: currentToken,
          toToken: neighbor,
          fromBase: currentToken.toLowerCase() === baseToken.toLowerCase(),
        };

        pq.enqueue(
          {
            token: neighbor,
            swaps: [...swaps, newSwap], // Додаємо новий swap до списку
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
      toToken.config.contract.address
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

      previousReceiveAmount = receiveAmount;

      const { lpFeeRate, mtFeeRate } = pool.userInfo.userFeeRate;

      const lpFeeAmount =
        mtFeeRate === lpFeeRate
          ? mtFee
          : DecimalMath.mulFloor(receiveAmount, lpFeeRate);

      const receiveAmountWithoutFee = receiveAmount + mtFee + lpFeeAmount;

      route.push({
        inputToken: fromToken,
        outputToken: toToken,
        inputAmount: fromInputValue,
        outputAmount: receiveAmount,
        outputAmountWithoutFee: receiveAmountWithoutFee,
        mtFee,
        lpFee: lpFeeAmount,
        fees: pool.lpFeeRate,
        lpInfo: pool,
        fromBase,
      });
    }

    return route;
  } catch (error) {
    console.error("Error finding best routes:", error);
    return null;
  }
};
