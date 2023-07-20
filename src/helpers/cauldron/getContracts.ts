import { markRaw } from "vue";
import { Contract } from "ethers";
import bentoBoxAbi from "@/utils/abi/bentoBox";
import lensAbi from "@/utils/abi/marketLens.js";
import { getLensAddress } from "@/helpers/cauldron/getLensAddress";

export const getContracts = async (
  config: any,
  contractProvider: any,
  chainId: number
) => {
  try {
    if (!contractProvider) return null;

    const cauldron = new Contract(
      config.contract.address,
      config.contract.abi,
      contractProvider
    );

    const bentoBoxAddress = await cauldron.bentoBox();

    const bentoBox = new Contract(
      bentoBoxAddress,
      bentoBoxAbi,
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

    const lensAddress = getLensAddress(chainId);
    const lens = new Contract(lensAddress, lensAbi, contractProvider);

    return markRaw({
      cauldron,
      bentoBox,
      collateral,
      mim,
      leverageSwapper,
      liquidationSwapper,
      unwrappedToken,
      wrapper,
      lens,
    });
  } catch (error) {
    console.log("createContracts error:", error);
    return null;
  }
};
