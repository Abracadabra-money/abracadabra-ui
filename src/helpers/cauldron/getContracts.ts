import { markRaw } from "vue";
import { Contract } from "ethers";
import store from "@/store";
import type { ContractInfo } from "@/types/global";
import { getEthersProvider } from "@/helpers/chains/getChainsInfo";

export const getContracts = async (
  config: any,
  bentoBoxContract: ContractInfo
) => {
  try {
    const address = store.getters.getAccount;
    const signer = store.getters.getSigner;
    const provider = getEthersProvider(config.chainId);
    const contractProvider = address ? signer : provider;

    if (!contractProvider) return null;

    const cauldron = new Contract(
      config.contract.address,
      config.contract.abi,
      contractProvider
    );

    const bentoBox = new Contract(
      bentoBoxContract.address,
      bentoBoxContract.abi,
      contractProvider
    );

    const collateral = new Contract(
      config.collateralInfo.address,
      config.collateralInfo.abi,
      contractProvider
    );

    const mim = new Contract(
      config.mimInfo.address,
      config.mimInfo.abi,
      contractProvider
    );

    const leverageSwapper = config.leverageInfo
      ? new Contract(
          config.leverageInfo.address,
          config.leverageInfo.abi,
          contractProvider
        )
      : null;

    const liquidationSwapper = config.deleverageInfo
      ? new Contract(
          config.deleverageInfo.address,
          config.deleverageInfo.abi,
          contractProvider
        )
      : null;

    const wrapper = config.wrapInfo?.wrapper
      ? new Contract(
          config.wrapInfo.wrapper.address,
          config.wrapInfo.wrapper.abi,
          contractProvider
        )
      : null;

    const unwrappedToken = config.wrapInfo?.unwrappedToken
      ? new Contract(
          config.wrapInfo.unwrappedToken.address,
          config.wrapInfo.unwrappedToken.abi,
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
  } catch (error) {
    console.log("createContracts error:", error);
    return null;
  }
};
