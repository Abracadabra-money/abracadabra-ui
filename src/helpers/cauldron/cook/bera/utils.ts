import { utils } from "ethers";
import type { Address } from "viem";

const MIM_BERA_ADDRESS = "0xB734c264F83E39Ef6EC200F99550779998cC812d";

const HONEY_POOL_INDEX = 0;
const MIM_POOL_INDEX = 1;

export const getMimHoneyDeleverageSwapData = (
  underlyingToken: Address = MIM_BERA_ADDRESS,
  poolIndex: number = MIM_POOL_INDEX
) => {
  const swapData = "0x0000000000000000000000000000000000000000";
  return utils.defaultAbiCoder.encode(
    ["address", "uint256", "bytes"],
    [underlyingToken, poolIndex, swapData]
  );
};

export const getMimHoneyLeverageSwapData = (
  underlyingToken: Address = MIM_BERA_ADDRESS,
  poolIndex: number = MIM_POOL_INDEX
) => {
  const swapData = "0x0000000000000000000000000000000000000000";
  return utils.defaultAbiCoder.encode(
    ["address", "uint256", "bytes"],
    [underlyingToken, poolIndex, swapData]
  );
};
