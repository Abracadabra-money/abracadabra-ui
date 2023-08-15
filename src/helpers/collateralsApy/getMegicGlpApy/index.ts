import { Wallet } from "ethers";
import { rpc } from "@/helpers/collateralsApy/getMegicGlpApy/constants";
import { getPrices } from "@/helpers/collateralsApy/getMegicGlpApy/getPrices";
import type { MegicGlpApy } from "@/helpers/collateralsApy/getMegicGlpApy/types";
import { getContracts } from "@/helpers/collateralsApy/getMegicGlpApy/getContracts";
import { calculatedApy } from "@/helpers/collateralsApy/getMegicGlpApy/calculatedApy";
import { getStakingData } from "@/helpers/collateralsApy/getMegicGlpApy/getStakingData";
import { getAdditionalInfo } from "@/helpers/collateralsApy/getMegicGlpApy/getAdditionalInfo";

export const getMegicGlpApy = async (chainId: number): Promise<MegicGlpApy> => {
  const currentRpc = rpc[chainId as keyof typeof rpc];
  if (!currentRpc) return { glpApy: 0, magicGlpApy: 0 };

  const address = Wallet.createRandom().address;
  const multicallContracts = await getContracts(chainId);

  const stakingData = await getStakingData(
    address,
    chainId,
    multicallContracts
  );

  const prices = await getPrices(multicallContracts, chainId);
  const { aum, glpSupply, fees } = await getAdditionalInfo(
    multicallContracts,
    chainId,
    address
  );

  return await calculatedApy(stakingData, aum, prices, glpSupply, fees);
};
