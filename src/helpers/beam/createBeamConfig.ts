import { markRaw } from "vue";
import beamConfigs from "@/configs/beam/beamConfigs";
import mimConfigs from "@/configs/tokens/mim";
import { chains, chainsList } from "@/helpers/chains";
import { BigNumber, Contract, providers, utils } from "ethers";
import type { BeamConfig, UserInfo } from "@/helpers/beam/types";

const emptyState = {
  contractInstance: null,
  balance: "0",
  nativeTokenBalance: "0",
  approvedAmount: BigNumber.from("0"),
  tokenContractInstance: null,
};

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
      approvedAmount: BigNumber.from("0"),
    };

  const userBalamce = await contract.balanceOf(account);
  const nativeTokenBalance = await provider.getBalance(account);

  return {
    balance: utils.formatUnits(userBalamce),
    nativeTokenBalance: utils.formatUnits(nativeTokenBalance),
    approvedAmount: await contract.allowance(account, address),
  };
};

export const createBeamConfig = async (
  chainId: number,
  signer: providers.BaseProvider,
  account: string,
  provider: providers.BaseProvider
): Promise<BeamConfig> => {
  const mimConfig = mimConfigs.find((item) => item.chainId === chainId);

  const beamConfig = beamConfigs.find((item) => item.chainId === chainId);

  const fromChains = beamConfigs.map((configItem) => {
    const { chainId } = configItem;
    return {
      chainId: configItem.chainId,
      title: configItem.chainName,
      icon: chainsList[chainId as keyof typeof chainsList].networkIcon,
      defaultValue: configItem.defaultValue,
    };
  });

  const chainsInfo = chains.filter((chain) => chain.chainId !== chainId);

  const toChains = chainsInfo.map((chainItem) => {
    return {
      chainId: chainItem.chainId,
      lzChainId: chainItem.lzChainId,
      title: chainItem.chainName,
      icon: chainItem.networkIcon,
    };
  });

  if ((!beamConfig && !mimConfig) || !account)
    return markRaw({
      ...emptyState,
      chainsInfo,
      fromChains,
      toChains,
    });

  const contractInstance = new Contract(
    beamConfig!.contract.address,
    JSON.stringify(beamConfig!.contract.abi),
    signer
  );

  const tokenContractInstance = new Contract(
    mimConfig!.address,
    JSON.stringify(mimConfig!.abi),
    signer
  );

  const userInfo = await getUserInfo(
    provider,
    account,
    tokenContractInstance,
    beamConfig!.contract.address
  );

  return markRaw({
    contractInstance,
    tokenContractInstance,
    chainsInfo: chainsInfo,
    fromChains,
    toChains,
    ...userInfo,
  });
};
