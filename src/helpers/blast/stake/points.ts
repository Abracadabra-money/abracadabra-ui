import axios from "axios";
import type { Address } from "viem";

export type IterableElement<TargetIterable> = TargetIterable extends Iterable<
  infer ElementType
>
  ? ElementType
  : never;

const pointsApiClient = axios.create({
  baseURL: "https://ymlcxloffmrsfereuhfa.supabase.co/rest/v1",
  headers: {
    apikey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltbGN4bG9mZm1yc2ZlcmV1aGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NTM4MDMsImV4cCI6MjAyNTEyOTgwM30.hhfUPn4fw9WUdRpeXDIk6s5LskQ1HM4qMZy6G5AKjsk",
  },
});

const states = ["pending", "finalized"] as const;
type State = IterableElement<typeof states>;

const kinds = [
  "developer_points",
  "liquidity_points",
  "potion_points",
] as const;
type Kind = IterableElement<typeof kinds>;

const reasons = [
  "lle_deposit_usdb",
  "lle_deposit_mim",
  "cauldron_deposit_weth",
  "lle_lock_usdb",
  "lle_lock_mim",
  "lle_deposit_borrowed_mim",
  "founder",
  "deposit_mim_usdb_lp",
  "phase_one_founder_bonus",
] as const;
type Reason = IterableElement<typeof reasons>;

const kindMap = {
  liquidity_points: "liquidityPoints",
  developer_points: "developerPoints",
  potion_points: "potionPoints",
} as const satisfies Record<Kind, string>;

const reasonMap = {
  lle_deposit_usdb: "unlocked",
  lle_deposit_mim: "unlocked",
  cauldron_deposit_weth: "cauldron",
  lle_lock_usdb: "locked",
  lle_lock_mim: "locked",
  lle_deposit_borrowed_mim: "cauldron",
  founder: "founder",
  deposit_mim_usdb_lp: "lp",
  phase_one_founder_bonus: "phaseOneFounderBonus",
} as const satisfies Record<Reason, string>;

const USER_POINTS_LOCAL_STORAGE_KEY = "USER_POINTS_STATISTICS";
const GLOBAL_POINTS_LOCAL_STORAGE_KEY = "GLOBAL_POINTS_STATISTICS";

type DataToCache = {
  pointsStatistics: Record<
    (typeof kindMap)[Kind],
    Record<"total" | (typeof reasonMap)[Reason], Record<State, number>>
  >;
  time: number;
  account?: Address | null;
};

const buildStatistics = (
  data: Array<{
    state: State;
    kind: Kind;
    reason: Reason;
    amount: number;
  }>
): Record<
  (typeof kindMap)[Kind],
  Record<"total" | (typeof reasonMap)[Reason], Record<State, number>>
> => {
  const zeroPointsStatistics = {
    total: {
      pending: 0,
      finalized: 0,
    },
    unlocked: {
      pending: 0,
      finalized: 0,
    },
    locked: {
      pending: 0,
      finalized: 0,
    },
    cauldron: {
      pending: 0,
      finalized: 0,
    },
    lp: {
      pending: 0,
      finalized: 0,
    },
    founder: {
      pending: 0,
      finalized: 0,
    },
    phaseOneFounderBonus: {
      pending: 0,
      finalized: 0,
    },
  };
  const statistics = {
    liquidityPoints: zeroPointsStatistics,
    developerPoints: zeroPointsStatistics,
    potionPoints: zeroPointsStatistics,
  };

  for (const { state, kind, reason, amount } of data) {
    const statsKind = kindMap[kind];
    const statsReason = reasonMap[reason];

    statistics[statsKind][statsReason][state] += amount;
    statistics[statsKind].total[state] += amount;
  }

  return statistics;
};

export const fetchPointsStatistics = async () => {
  const cachedData = checkAndGetCachedData(GLOBAL_POINTS_LOCAL_STORAGE_KEY);
  if (cachedData) return cachedData;

  let globalPointsStatistics = buildStatistics([]);

  try {
    const { data } = await pointsApiClient.get<
      Array<{
        state: State;
        kind: Kind;
        reason: Reason;
        amount: number;
      }>
    >("distribution_sum_by_kind_by_reason", {
      params: { select: "state,kind,reason,amount" },
    });

    globalPointsStatistics = buildStatistics(data);
  } catch (error) {
    console.log("Error fetching points statistics", error);
    globalPointsStatistics = buildStatistics([]);
  }

  setCachedData(globalPointsStatistics, GLOBAL_POINTS_LOCAL_STORAGE_KEY);
  return globalPointsStatistics;
};

export const fetchUserPointsStatistics = async (address: Address) => {
  let userPointsStatistics = buildStatistics([]);
  if (!address) {
    return userPointsStatistics;
  }

  const cachedData = checkAndGetCachedData(
    USER_POINTS_LOCAL_STORAGE_KEY,
    address
  );
  if (cachedData) return cachedData;

  try {
    const { data } = await pointsApiClient.get<
      Array<{
        state: State;
        kind: Kind;
        reason: Reason;
        amount: number;
      }>
    >("distribution_sum_by_address_by_kind_by_reason", {
      params: {
        address: `eq.${address.toLowerCase()}`,
        select: "state,kind,reason,amount",
      },
    });

    userPointsStatistics = buildStatistics(data);
  } catch (error) {
    console.log("Error fetching user points statistics", error);

    userPointsStatistics = buildStatistics([]);
  }

  setCachedData(userPointsStatistics, USER_POINTS_LOCAL_STORAGE_KEY, address);
  return userPointsStatistics;
};

const setCachedData = (
  pointsStatistics: Record<
    (typeof kindMap)[Kind],
    Record<"total" | (typeof reasonMap)[Reason], Record<State, number>>
  >,
  localStorageKey: string,
  account: Address | null = null
) => {
  const time = new Date().getTime();

  const dataToCache: DataToCache = {
    pointsStatistics,
    time,
  };

  if (account) dataToCache.account = account;

  localStorage.setItem(localStorageKey, JSON.stringify(dataToCache));
};

const checkAndGetCachedData = (
  localStorageKey: string,
  account: Address | null = null
) => {
  const cachedData = localStorage.getItem(localStorageKey);
  const allowedTime = 5; // 5 min

  if (!cachedData) return false;

  try {
    const parsedCacheData = JSON.parse(cachedData);

    if (parsedCacheData.account != account) return false;

    const currentTime = new Date().getTime();
    const timeDiff = currentTime - parsedCacheData.time;
    const minutes = Math.floor(timeDiff / 1000 / 60);
    if (minutes > allowedTime) return false;

    return parsedCacheData.pointsStatistics;
  } catch (error) {
    console.log("checkAndGetCachedData err:", error);
    return false;
  }
};
