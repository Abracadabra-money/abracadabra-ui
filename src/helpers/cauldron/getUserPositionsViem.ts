import { formatUnits } from "viem";
import type { PublicClient } from "viem";
import type { Address } from "@wagmi/core";
import type { UserPositions } from "@/types/cauldron";
import { userPositionEmptyState } from "@/helpers/cauldron/emptyState";
import { getLensContractViem } from "@/helpers/cauldron/getLensContractViem";
import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";

export const getUserPositionsViem = async (
  configs: CauldronConfig[],
  publicClient: PublicClient,
  account: Address | undefined
): Promise<UserPositions[]> => {
  if (!account) configs.map(() => userPositionEmptyState);

  const lensContract = getLensContractViem(publicClient.chain!.id);

  const positionsInfo = await Promise.all(
    configs.map(({ contract }: CauldronConfig) => {
      return publicClient.multicall({
        contracts: [
          {
            ...lensContract,
            functionName: "getUserPosition",
            args: [contract.address, account!],
          },
          {
            ...lensContract,
            functionName: "getOracleExchangeRate",
            args: [contract.address],
          },
          {
            ...contract,
            functionName: "userCollateralShare",
            args: [account!],
          },
          {
            ...contract,
            functionName: "userBorrowPart",
            args: [account!],
          },
        ],
      });
    })
  );

  return positionsInfo.map((position: any, index: number) => {
    if (position[0]?.error) return userPositionEmptyState;

    const { decimals } = configs[index].collateralInfo;
    const { collateral, borrowValue, liquidationPrice } = position[0].result;

    return {
      collateralInfo: {
        userCollateralShare: position[2].result,
        userCollateralAmount: collateral.amount,
      },
      borrowInfo: {
        userBorrowAmount: borrowValue,
        userBorrowPart: position[3].result,
      },
      liquidationPrice: formatUnits(liquidationPrice, decimals),
      oracleRate: position[1].result,
    };
  });
};
