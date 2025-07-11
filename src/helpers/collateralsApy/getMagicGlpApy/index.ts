import {
  contracts,
  rpc,
} from "@/helpers/collateralsApy/getMagicGlpApy/constants";
import { getPrices } from "@/helpers/collateralsApy/getMagicGlpApy/getPrices";
import type { MagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy/types";
import { calculatedApy } from "@/helpers/collateralsApy/getMagicGlpApy/calculatedApy";
import { getStakingData } from "@/helpers/collateralsApy/getMagicGlpApy/getStakingData";
import { getAdditionalInfo } from "@/helpers/collateralsApy/getMagicGlpApy/getAdditionalInfo";
import { getRandomWalletAddress } from "@/helpers/utils/createRandomAddress";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";

export const getMagicGlpApy = async (chainId: number): Promise<MagicGlpApy> => {
  return { glpApy: 0, magicGlpApy: 0 };
  const currentRpc = rpc[chainId as keyof typeof rpc];
  if (!currentRpc) return { glpApy: 0, magicGlpApy: 0 };

  const publicClient = getPublicClient(chainId);

  const address = getRandomWalletAddress();
  const multicallContracts = contracts[chainId];

  const stakingData = await getStakingData(
    address,
    chainId,
    multicallContracts,
    publicClient
  );

  const prices = await getPrices(multicallContracts, chainId, publicClient);
  const { aum, glpSupply, fees } = await getAdditionalInfo(
    multicallContracts,
    chainId,
    address,
    publicClient
  );

  return await calculatedApy(stakingData, aum, prices, glpSupply, fees);
};
