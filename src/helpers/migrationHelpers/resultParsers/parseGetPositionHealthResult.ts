import type {
  PositionHealth,
  PositionHealthStatus,
} from "@/helpers/cauldron/types";
import { BigNumber } from "ethers";

export const parseGetPositionHealthResult = (
  result: PositionHealth
): { percent: BigNumber; status: PositionHealthStatus } => {
  return {
    percent: BigNumber.from(result.percent),
    status: result.status,
  };
};
