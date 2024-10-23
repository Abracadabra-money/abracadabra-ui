import store from "@/store";
import { markRaw } from "vue";
import { Contract } from "ethers";
import type { Address } from "viem";
import type { ContractInfo } from "@/types/global";
import type { ContractInterface, Signer } from "ethers";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";

export const getContracts = async (
  config: CauldronConfig,
  bentoBoxContract: ContractInfo
) => {
  const address: Address = store.getters.getAccount;
  const signer: Signer = store.getters.getSigner;
  const provider = getEthersProvider(config.chainId);
  const contractProvider = address ? signer : provider;

  const cauldron = new Contract(
    config.contract.address,
    config.contract.abi as unknown as ContractInterface,
    contractProvider
  );

  const bentoBox = new Contract(
    bentoBoxContract.address,
    bentoBoxContract.abi as unknown as ContractInterface,
    contractProvider
  );

  const collateral = new Contract(
    config.collateralInfo.address,
    config.collateralInfo.abi as unknown as ContractInterface,
    contractProvider
  );

  const mim = new Contract(
    config.mimInfo.address,
    config.mimInfo.abi as unknown as ContractInterface,
    contractProvider
  );

  const leverageSwapper = config.leverageInfo
    ? new Contract(
        config.leverageInfo.address,
        config.leverageInfo.abi as unknown as ContractInterface,
        contractProvider
      )
    : null;

  const liquidationSwapper = config.deleverageInfo
    ? new Contract(
        config.deleverageInfo.address,
        config.deleverageInfo.abi as unknown as ContractInterface,
        contractProvider
      )
    : null;

  const wrapper = config.wrapInfo?.wrapper
    ? new Contract(
        config.wrapInfo.wrapper.address,
        config.wrapInfo.wrapper.abi as unknown as ContractInterface,
        contractProvider
      )
    : null;

  const unwrappedToken = config.wrapInfo?.unwrappedToken
    ? new Contract(
        config.wrapInfo.unwrappedToken.address,
        config.wrapInfo.unwrappedToken.abi as unknown as ContractInterface,
        contractProvider
      )
    : null;

  return markRaw({
    cauldron,
    bentoBox,
    collateral,
    mim,
    leverageSwapper,
    liquidationSwapper,
    unwrappedToken,
    wrapper,
  });
};
