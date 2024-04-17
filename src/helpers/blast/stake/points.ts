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

const kinds = ["developer_points", "liquidity_points"] as const;
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
  const statistics = {
    liquidityPoints: {
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
    },
    developerPoints: {
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
    },
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

    return buildStatistics(data);
  } catch (error) {
    console.log("Error fetching points statistics", error);
    return buildStatistics([]);
  }
};

export const fetchUserPointsStatistics = async (address: Address) => {
  if (!address) {
    return buildStatistics([]);
  }

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

    return buildStatistics(data);
  } catch (error) {
    console.log("Error fetching user points statistics", error);
    return buildStatistics([]);
  }
};
