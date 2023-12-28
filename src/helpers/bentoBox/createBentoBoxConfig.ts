import mimTokenInfo from "@/utils/contracts/mimToken";
import bentoContractsInfo from "@/utils/contracts/master";
import degenBoxInfo from "@/utils/contracts/degenBox";
import type { Address } from "@wagmi/core";
import type { ExtendedContractInfo } from "@/utils/contracts/types";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";
import { tokensChainLink } from "@/utils/chainLink/config";
import { getPublicClient } from "@/helpers/getPublicClient";

export const createBentoBoxConfig = async (
  chainId: number,
  account: Address
) => {
  const publicClient = getPublicClient(chainId);

  const mimInfo = mimTokenInfo.find(
    (token: any) => token.name === "MIM" && token.chainId === chainId
  );

  if (!mimInfo) {
    return false;
  }

  const bentoContractInfo = bentoContractsInfo.find(
    (contractInfo: ExtendedContractInfo) => contractInfo.chainId === chainId
  );

  const degenContractInfo = degenBoxInfo.find(
    (contractInfo: ExtendedContractInfo) => contractInfo.chainId === chainId
  );

  const mimPrice = await getTokenPriceByChain(
    tokensChainLink.mim.chainId,
    tokensChainLink.mim.address
  );

  const [
    bentoBalance,
    degenBalance,
    bentoAllowance,
    degenAllowance,
    mimBalance,
  ]: any = await publicClient.multicall({
    contracts: [
      {
        address: bentoContractInfo?.address as Address,
        abi: bentoContractInfo?.abi as any,
        functionName: "balanceOf",
        args: [mimInfo.address, account],
      },
      {
        address: degenContractInfo?.address as Address,
        abi: degenContractInfo?.abi as any,
        functionName: "balanceOf",
        args: [mimInfo.address, account],
      },
      {
        address: mimInfo.address as Address,
        abi: mimInfo.abi as any,
        functionName: "allowance",
        args: [account, bentoContractInfo?.address as Address],
      },
      {
        address: mimInfo.address as Address,
        abi: mimInfo.abi as any,
        functionName: "allowance",
        args: [account, degenContractInfo?.address as Address],
      },
      {
        address: mimInfo.address as Address,
        abi: mimInfo.abi as any,
        functionName: "balanceOf",
        args: [account],
      },
    ],
  });

  let mimInBentoBalance, mimInDegenBalance;

  if (bentoContractInfo)
    mimInBentoBalance = await publicClient.readContract({
      address: bentoContractInfo.address as Address,
      abi: bentoContractInfo.abi as any,
      functionName: "toAmount",
      args: [mimInfo.address, bentoBalance.result, false],
    });

  if (degenContractInfo)
    mimInDegenBalance = await publicClient.readContract({
      address: degenContractInfo.address as Address,
      abi: degenContractInfo.abi as any,
      functionName: "toAmount",
      args: [mimInfo.address, degenBalance.result, false],
    });

  return {
    mimBalance: mimBalance.result,
    mimPrice,
    mimInBentoBalance,
    mimInDegenBalance,
    bentoContractInfo,
    degenContractInfo,
    tokenInfo: mimInfo,
    bentoAllowance: bentoAllowance.result,
    degenAllowance: degenAllowance.result,
  };
};
