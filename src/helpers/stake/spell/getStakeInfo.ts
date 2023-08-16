import { markRaw } from "vue";
import { getAccount } from "@wagmi/core";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getContracts } from "@/helpers/stake/spell/getContracts";
import { getSpellInfo } from "@/helpers/stake/spell/getSpellInfo";
import { getMSpellInfo } from "@/helpers/stake/spell/getMSpellInfo";
import { getSSpellInfo } from "@/helpers/stake/spell/getSSpellInfo";
import { getSpellStakingApr } from "@/helpers/stake/spell/getSpellStakingApr";

export const getStakeInfo = async (
  provider: any,
  signer: any,
  chainId: number
) => {
  const account = getAccount().address;
  const userSigner = account ? signer : provider;
  const multicallProvider = MulticallWrapper.wrap(provider);

  const multicallContracts = await getContracts(multicallProvider, chainId);
  const spellInfo: any = await getSpellInfo(multicallContracts, account);

  const sSpellInfo: any = await getSSpellInfo(
    multicallContracts,
    account,
    spellInfo
  );

  const mSpellInfo: any = await getMSpellInfo(
    multicallContracts,
    account,
    spellInfo
  );

  const { sSpellApr, mSpellApr }: any = await getSpellStakingApr();
  const { spell, sSpell, mSpell } = await getContracts(userSigner, chainId);

  return {
    spell: markRaw({ ...spellInfo, contract: spell }),
    sSpell: markRaw({ ...sSpellInfo, contract: sSpell, apr: sSpellApr }),
    mSpell: markRaw({ ...mSpellInfo, contract: mSpell, apr: mSpellApr }),
  };
};
