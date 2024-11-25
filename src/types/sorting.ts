export type SortOrder = "up" | "down" | null;

export type SorterData = {
  tableKey: PositionsSortKey | string;
  text?: string;
  tooltip?: string;
  isSortingCriterion?: boolean;
};

export type PositionsSortKey =
  | "positionHealth"
  | "collateralDepositedUsd"
  | "mimBorrowed"
  | "apr";

export type FilterData = {
  filterKey: string;
  text?: string;
  emitter: (options: string[]) => void;
  options: string[];
};
