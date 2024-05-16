import mimTokenInfo from "@/configs/tokens/mim";
import bentoContractsInfo from "@/configs/contracts/master";
import degenContractsInfo from "@/configs/contracts/degenBox";
import type { Address } from "viem";
import type { ExtendedContractInfo } from "@/configs/contracts/types";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";
import { tokensChainLink } from "@/configs/chainLink/config";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import type { BentoBoxConfig } from "@/helpers/bentoBox/types";
import type { MimInfo } from "@/configs/tokens/types";

export const createBentoBoxConfigs = async (
  account: Address
): Promise<BentoBoxConfig[]> => {
  const availableNetworks = getBentoNetworks();

  const configs = await Promise.all(
    availableNetworks.map(async (chainId) => {
      const config = await createBentoBoxConfig(chainId, account);
      return config;
    })
  );

  return configs;
};

export const createBentoBoxConfig = async (
  chainId: number,
  account: Address
): Promise<BentoBoxConfig> => {
  const publicClient = getPublicClient(chainId);

  const mimInfo = mimTokenInfo.find(
    (token: MimInfo) => token.chainId === chainId
  );

  const bentoContractInfo = bentoContractsInfo.find(
    (contractInfo: ExtendedContractInfo) => contractInfo.chainId === chainId
  );

  const degenContractInfo = degenContractsInfo.find(
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
        args: [mimInfo!.address, account],
      },
      {
        address: degenContractInfo?.address as Address,
        abi: degenContractInfo?.abi as any,
        functionName: "balanceOf",
        args: [mimInfo!.address, account],
      },
      {
        address: mimInfo!.address as Address,
        abi: mimInfo!.abi as any,
        functionName: "allowance",
        args: [account, bentoContractInfo?.address as Address],
      },
      {
        address: mimInfo!.address as Address,
        abi: mimInfo!.abi as any,
        functionName: "allowance",
        args: [account, degenContractInfo?.address as Address],
      },
      {
        address: mimInfo!.address as Address,
        abi: mimInfo!.abi as any,
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
      args: [mimInfo!.address, bentoBalance.result || 0n, false],
    });

  if (degenContractInfo)
    mimInDegenBalance = await publicClient.readContract({
      address: degenContractInfo.address as Address,
      abi: degenContractInfo.abi as any,
      functionName: "toAmount",
      args: [mimInfo!.address, degenBalance.result || 0n, false],
    });

  return {
    chainId,
    mimBalance: mimBalance.result,
    mimPrice,
    mimInBentoBalance,
    mimInDegenBalance,
    bentoContractInfo,
    degenContractInfo,
    tokenInfo: mimInfo!,
    bentoAllowance: bentoAllowance.result,
    degenAllowance: degenAllowance.result,
  };
};

const getBentoNetworks = () => {
  const networks: number[] = bentoContractsInfo.map(
    (contractInfo: ExtendedContractInfo) => contractInfo.chainId
  );

  degenContractsInfo.forEach((contractInfo: ExtendedContractInfo) => {
    if (!networks.includes(contractInfo.chainId))
      networks.push(contractInfo.chainId);
  });

  return networks;
};
