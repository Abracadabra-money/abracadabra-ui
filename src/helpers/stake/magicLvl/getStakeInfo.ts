import { getAccount } from "@wagmi/core";
import { MulticallWrapper } from "ethers-multicall-provider";
import { magicLvlConfig } from "@/utils/stake/magicLvlConfig";
import { getContracts } from "@/helpers/stake/magicLvl/getContracts";
import { getTokenInfo } from "@/helpers/stake/magicLvl/getTokenInfo";
import { getAdditionalInfo } from "@/helpers/stake/magicLvl/getAdditionalInfo";

export const getStakeInfo = async (
  provider: any,
  signer: any,
  chainId: number
) => {
  const config = magicLvlConfig[chainId as keyof typeof magicLvlConfig];
  const account = getAccount().address;
  if (!config || !account) return true;

  const userSigner = account ? signer : provider;
  const multicallProvider = MulticallWrapper.wrap(provider);
  const { levelMasterContract, harvestorContract, tokenContracts } =
    await getContracts(multicallProvider, config);

  const tokensInfo = await Promise.all(
    tokenContracts.map(
      async (contracts) =>
        await getTokenInfo(
          contracts,
          harvestorContract,
          levelMasterContract,
          config,
          account,
          userSigner
        )
    )
  );

  const stakeInfo: any = {};
  tokensInfo.map((info: any) => {
    stakeInfo[info.name] = info;
  });

  const additionalInfo = await getAdditionalInfo(stakeInfo);

  return { ...stakeInfo, ...additionalInfo };
};
