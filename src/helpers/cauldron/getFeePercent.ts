import { Contract } from "ethers";
import type { providers } from "ethers";

const CONTRACT_ABI = ["function feePercent() external view returns(uint8)"];

export const getFeePercent = async (
  config: Object,
  provider: providers.BaseProvider,
  chainId: number
) => {
  const { id, collateralInfo }: any = config;
  if (chainId === 42161 && id === 2) {
    const contract = await new Contract(
      collateralInfo.address,
      CONTRACT_ABI,
      provider
    );

    return await contract.feePercent();
  }

  return null;
};
