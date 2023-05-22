import { Contract, providers } from "ethers";
import mimConfigs from "@/utils/contracts/mimToken";
import chainConfig from "@/utils/bridge/chainConfig";
import bridgeConfigs from "@/utils/bridge/bridgeConfig";
import { isTokenApprowed } from "@/utils/approveHelpers.js";
import { getUserBalance, getNativeTokenBalance } from "@/helpers/userInfo";
import type { BridgeConfig, UserInfo } from "@/helpers/bridge/types";

const getUserInfo = async (
  provider: providers.BaseProvider,
  account: string,
  contract: Contract,
  address: string
): Promise<UserInfo> => {
  if (!provider)
    return {
      balance: "0.0",
      nativeTokenBalance: "0.0",
      isTokenApprove: false,
      isDefaultProvider: true,
    };

  return {
    balance: await getUserBalance(contract, account, 18),
    nativeTokenBalance: await getNativeTokenBalance(provider, account, 18),
    isTokenApprove: await isTokenApprowed(contract, account, address, true),
    isDefaultProvider: false,
  };
};

export const createBridgeConfig = async (
  chainId: number,
  provider: any,
  account: string
): Promise<BridgeConfig | boolean> => {
  const mimConfig = mimConfigs.find((item) => item.chainId === chainId);
  if (!mimConfig) return false;

  const bridgeConfig = bridgeConfigs.find((item) => item.chainId === chainId);
  if (!bridgeConfig) return false;

  const contractInstance = new Contract(
    bridgeConfig.contract.address,
    JSON.stringify(bridgeConfig.contract.abi),
    provider
  );

  const tokenContractInstance = new Contract(
    mimConfig.address,
    JSON.stringify(mimConfig.abi),
    provider
  );

  const fromChains = bridgeConfigs.map((configItem) => {
    return {
      chainId: configItem.chainId,
      title: configItem.chainName,
      icon: configItem.chainIcon,
    };
  });

  const chainsInfo = chainConfig.filter((chain) => chain.chainId !== chainId);

  const toChains = chainsInfo.map((chainItem) => {
    return {
      chainId: chainItem.chainId,
      title: chainItem.name,
      icon: chainItem.icon,
    };
  });

  const { balance, isTokenApprove, isDefaultProvider, nativeTokenBalance } =
    await getUserInfo(
      provider,
      account,
      tokenContractInstance,
      bridgeConfig.contract.address
    );

  return {
    contractInstance,
    balance,
    nativeTokenBalance,
    isTokenApprove,
    tokenContractInstance,
    chainsInfo: chainsInfo,
    fromChains,
    toChains,
    isDefaultProvider,
  };
};
