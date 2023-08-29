import { Wallet } from "ethers";
import { rpc } from "@/helpers/collateralsApy/getMagicGlpApy/constants";
import { getPrices } from "@/helpers/collateralsApy/getMagicGlpApy/getPrices";
import type { MagicGlpApy } from "@/helpers/collateralsApy/getMagicGlpApy/types";
import { getContracts } from "@/helpers/collateralsApy/getMagicGlpApy/getContracts";
import { calculatedApy } from "@/helpers/collateralsApy/getMagicGlpApy/calculatedApy";
import { getStakingData } from "@/helpers/collateralsApy/getMagicGlpApy/getStakingData";
import { getAdditionalInfo } from "@/helpers/collateralsApy/getMagicGlpApy/getAdditionalInfo";

export const getMagicGlpApy = async (chainId: number): Promise<MagicGlpApy> => {
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
