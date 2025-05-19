import type { Address } from "viem";
import { formatUnits, parseAbi } from "viem";
import type { MagicLPInfo } from "@/helpers/pools/swap/types";
import { querySellBaseV2 } from "@/helpers/pools/swap/magicLp";
import { querySellQuoteV2 } from "@/helpers/pools/swap/magicLp";
import DecimalMath from "@/helpers/pools/swap/libs/DecimalMath";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { querySellBase, querySellQuote } from "@/helpers/pools/swap/magicLp";
import type { ActionConfig, RouteInfo } from "@/helpers/pools/swap/getSwapInfo";

const querySellAbi = parseAbi([
  "function querySellBase(address trader, uint256 payBaseAmount) view returns (uint256 receiveQuoteAmount, uint256 mtFee, uint8 newRState, uint256 newBaseTarget)",
  "function querySellQuote(address trader, uint256 payQuoteAmount) view returns (uint256 receiveBaseAmount, uint256 mtFee, uint8 newRState, uint256 newQuoteTarget)",
]);

const querySellV2Abi = parseAbi([
  "function querySellBase((uint256 i, uint256 K, uint256 B, uint256 Q, uint256 B0, uint256 Q0, uint8 R) state, address trader, uint256 payBaseAmount) view returns (uint256 receiveQuoteAmount, uint256 fee, uint8 newRState, uint256 newBaseTarget)",
  "function querySellQuote((uint256 i, uint256 K, uint256 B, uint256 Q, uint256 B0, uint256 Q0, uint8 R) state, address trader, uint256 payQuoteAmount) view returns (uint256 receiveBaseAmount, uint256 fee, uint8 newRState, uint256 newQuoteTarget)",
]);

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
      mlmVersion: lpInfo.config?.settings?.mlpVersion || 1,
      outputAmountWithoutFee: 0n,
    };

  if (!account) return localQuerySell(sellBase, amount, lpInfo);

  const isV2 = lpInfo.config.settings?.mlpVersion === 2;

  const payload = isV2 ? [lpInfo.PMMState, account, amount] : [account, amount];
  const abi = isV2 ? querySellV2Abi : querySellAbi;

  const publicClient = getPublicClient(lpInfo.chainId);

  const result = await publicClient.readContract({
    address: lpInfo.contract.address,
    abi: abi,
    functionName: sellBase ? "querySellBase" : "querySellQuote",
    args: [...payload],
  });

  const mtFee = isV2 ? 0n : result[1];
  const outputAmount = result[0] || 0n;

  if (!isV2) {
    const { lpFeeRate, mtFeeRate } = lpInfo.userInfo.userFeeRate;
    const lpFeeAmount = DecimalMath.mulFloor(result[0], lpFeeRate);
    const lpFee = mtFeeRate === lpFeeRate ? mtFee : lpFeeAmount;
    const outputAmountWithoutFee = outputAmount + mtFee + lpFee;

    return {
      fee: 0n,
      mtFee,
      lpFee,
      outputAmount,
      mlmVersion: 1,
      outputAmountWithoutFee,
    };
  }

  const fee = result[1];
  const outputAmountWithoutFee = outputAmount + fee;

  return {
    fee,
    mtFee,
    lpFee: 0n,
    outputAmount,
    mlmVersion: 2,
    outputAmountWithoutFee,
  };
};

const localQuerySell = (
  sellBase = true,
  amount: bigint,
  lpInfo: MagicLPInfo
) => {
  const mlpVersion = lpInfo.config.settings?.mlpVersion;
  const isV2 = mlpVersion === 2;

  if (sellBase) {
    let response;
    switch (mlpVersion) {
      case 2:
        response = querySellBaseV2(amount, lpInfo);
      default:
        response = querySellBase(amount, lpInfo, lpInfo.userInfo);
    }

    const { fee, mtFee, lpFee } = response;
    const outputAmount = response.receiveQuoteAmount;

    const outputAmountWithoutFee = isV2
      ? outputAmount + fee
      : outputAmount + mtFee + lpFee;

    return {
      fee,
      mtFee,
      lpFee,
      outputAmount,
      mlmVersion: mlpVersion ? mlpVersion : 1,
      outputAmountWithoutFee,
    };
  } else {
    let response;
    switch (mlpVersion) {
      case 2:
        response = querySellQuoteV2(amount, lpInfo);
      default:
        response = querySellQuote(amount, lpInfo, lpInfo.userInfo);
    }

    const { fee, mtFee, lpFee } = response;
    const outputAmount = response.receiveBaseAmount;

    const outputAmountWithoutFee = isV2
      ? outputAmount + fee
      : outputAmount + mtFee + lpFee;

    return {
      fee,
      mtFee,
      lpFee,
      outputAmount,
      mlmVersion: mlpVersion ? mlpVersion : 1,
      outputAmountWithoutFee,
    };
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
  amountToSwap: bigint // Обсяг токенів, які ми хочемо обміняти
) => {
  const graph: Graph = {};
  const visited = new Set();
  const bestCosts = { [fromToken.toLowerCase()]: 0 };

  // Заповнюємо граф
  pairs.forEach(({ baseToken, quoteToken, lpFeeRate, totalSupply, id }) => {
    const fees = Number(formatUnits(lpFeeRate, 18)); // Комісія
    const tvl = Number(formatUnits(totalSupply, 18)); // Ліквідність
    const weight = fees * (1 / tvl); // Вага ребра враховує комісію і ліквідність
    const baseTokenAddress = baseToken.toLowerCase();
    const quoteTokenAddress = quoteToken.toLowerCase();

    if (!graph[baseTokenAddress as keyof typeof graph])
      graph[baseTokenAddress] = [];
    if (!graph[quoteTokenAddress as keyof typeof graph])
      graph[quoteTokenAddress] = [];
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

      // Перевірка балансу токенів
      const baseBalance = poolInfo.balances.baseBalance;
      const quoteBalance = poolInfo.balances.quoteBalance;
      const { baseToken, quoteToken } = poolInfo;

      let sufficientLiquidity = false;
      let newAmountToSwap = currentAmount;

      if (currentToken.toLowerCase() === baseToken.toLowerCase()) {
        if (baseBalance >= currentAmount) {
          sufficientLiquidity = true;
        } else {
          newAmountToSwap = calculateSlippage(
            baseBalance,
            quoteBalance,
            currentAmount
          );
        }
      } else if (currentToken.toLowerCase() === quoteToken.toLowerCase()) {
        if (quoteBalance >= currentAmount) {
          sufficientLiquidity = true;
        } else {
          newAmountToSwap = calculateSlippage(
            quoteBalance,
            baseBalance,
            currentAmount
          );
        }
      }

      const newCost = currentCost + weight;

      // Вплив прослизання на пріоритет (зміна кількості токенів)
      // Якщо кількість токенів після прослизання значно менша, це збільшує вартість шляху
      const slippageImpact =
        Number(currentAmount - newAmountToSwap) / Number(currentAmount);
      const adjustedCost = newCost + slippageImpact; // Чим більше прослизання, тим більша вартість

      if (!(neighbor in bestCosts) || adjustedCost < bestCosts[neighbor]) {
        bestCosts[neighbor] = adjustedCost;

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
            currentAmount: newAmountToSwap, // Оновлюємо кількість токенів після обміну з урахуванням прослизання
          },
          adjustedCost // Враховуємо новий пріоритет з урахуванням прослизання
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

      const {
        fee,
        mtFee,
        lpFee,
        outputAmount,
        mlmVersion,
        outputAmountWithoutFee,
      } = await fetchOutputAmount(
        pool,
        account,
        fromBase,
        previousReceiveAmount
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
        mlmVersion,
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
