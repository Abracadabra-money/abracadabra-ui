import { formatUnits } from "viem";
import type { Address } from "viem";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import DecimalMath from "@/helpers/pools/swap/libs/DecimalMath";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { querySellBase, querySellQuote } from "@/helpers/pools/swap/magicLp";
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

// Функція для розрахунку кількості токенів з урахуванням прослизання
const calculateSlippage = (
  balanceIn: bigint, // Баланс токену, який ми обмінюємо
  balanceOut: bigint, // Баланс токену, який ми хочемо отримати
  amountIn: bigint // Сума обміну
): bigint => {
  const k = balanceIn * balanceOut; // Постійна величина добутку
  const newBalanceIn = balanceIn + amountIn; // Новий баланс після додавання суми
  const newBalanceOut = k / newBalanceIn; // Новий баланс токену, який отримуємо
  return balanceOut - newBalanceOut; // Отримана кількість токенів з урахуванням впливу
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
    const weight = fees / tvl; // Rib weight takes into account fees and TVL

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

      const baseBalance = poolInfo.balances.baseBalance;
      const quoteBalance = poolInfo.balances.quoteBalance;
      const { baseToken, quoteToken } = poolInfo;

      let newAmountToSwap = currentAmount;

      // Calculation of the new number of tokens taking into account slippage
      if (currentToken.toLowerCase() === baseToken.toLowerCase()) {
        newAmountToSwap = calculateSlippage(
          baseBalance,
          quoteBalance,
          currentAmount
        );
      } else if (currentToken.toLowerCase() === quoteToken.toLowerCase()) {
        newAmountToSwap = calculateSlippage(
          quoteBalance,
          baseBalance,
          currentAmount
        );
      }

      const slippageImpact =
        Number(currentAmount - newAmountToSwap) / Number(currentAmount);

      const newCost = currentCost + weight + slippageImpact; // Вартість із врахуванням fees, TVL та прослизання

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

      previousReceiveAmount = receiveAmount;

      const { lpFeeRate, mtFeeRate } = pool.userInfo.userFeeRate;

      const lpFeeAmount =
        mtFeeRate === lpFeeRate
          ? mtFee
          : DecimalMath.mulFloor(receiveAmount, lpFeeRate);

      const receiveAmountWithoutFee = receiveAmount + mtFee + lpFeeAmount;

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
      });
    }

    return route;
  } catch (error) {
    console.error("Error finding best routes:", error);
    return null;
  }
};
