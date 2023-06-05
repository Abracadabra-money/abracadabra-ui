import { Contract, providers } from "ethers";
import mimConfigs from "@/utils/contracts/mimToken";
import chainConfig from "@/utils/bridge/chainConfig";
import bridgeConfigs from "@/utils/bridge/bridgeConfig";
import { isTokenApprowed } from "@/utils/approveHelpers.js";
import { markRaw } from "vue";
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
    };

  return {
    balance: await getUserBalance(contract, account, 18),
    nativeTokenBalance: await getNativeTokenBalance(provider, account, 18),
    isTokenApprove: await isTokenApprowed(contract, address, account, true),
  };
};

export const createBridgeConfig = async (
  chainId: number,
  signer: providers.BaseProvider,
  account: string,
  provider: providers.BaseProvider
): Promise<BridgeConfig | boolean> => {
  const mimConfig = mimConfigs.find((item) => item.chainId === chainId);
  if (!mimConfig) return false;

  const bridgeConfig = bridgeConfigs.find((item) => item.chainId === chainId);
  if (!bridgeConfig) return false;

  const contractInstance = new Contract(
    bridgeConfig.contract.address,
    JSON.stringify(bridgeConfig.contract.abi),
    signer
  );

  const tokenContractInstance = new Contract(
    mimConfig.address,
    JSON.stringify(mimConfig.abi),
    signer
  );

  const fromChains = bridgeConfigs.map((configItem) => {
    return {
      chainId: configItem.chainId,
      title: configItem.chainName,
      icon: configItem.chainIcon,
      destinationMax: configItem.destinationMax,
      defaultValue: configItem.defaultValue,
    };
  });

  const chainsInfo = chainConfig.filter((chain) => chain.chainId !== chainId);

  const toChains = chainsInfo.map((chainItem) => {
    return {
      chainId: chainItem.chainId,
      lzChainId: chainItem.lzChainId,
      title: chainItem.name,
      icon: chainItem.icon,
    };
  });

  const { balance, isTokenApprove, nativeTokenBalance } = await getUserInfo(
    provider,
    account,
    tokenContractInstance,
    bridgeConfig.contract.address
  );

  return markRaw({
    contractInstance,
    balance,
    nativeTokenBalance,
    isTokenApprove,
    tokenContractInstance,
    chainsInfo: chainsInfo,
    fromChains,
    toChains,
  });
};
