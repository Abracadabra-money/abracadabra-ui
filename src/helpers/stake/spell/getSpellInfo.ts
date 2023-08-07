import { markRaw } from "vue";
import { getAccount } from "@wagmi/core";
import { MulticallWrapper } from "ethers-multicall-provider";
import { getContracts } from "@/helpers/stake/spell/getContracts";
import { getSpellConfig } from "@/helpers/stake/spell/getSpellConfig";
import { getMspellConfig } from "@/helpers/stake/spell/getMspellConfig";
import { getSspellConfig } from "@/helpers/stake/spell/getSspellConfig";
import { getSpellStakingApr } from "@/helpers/stake/spell/getSpellStakingApr";

export const getSpellInfo = async (
  provider: any,
  signer: any,
  chainId: number
) => {
  const account = getAccount().address;
  const userSigner = account ? signer : provider;
  const multicallProvider = MulticallWrapper.wrap(provider);

  const multicallContracts = await getContracts(multicallProvider, chainId);
  const spellInfo: any = await getSpellConfig(multicallContracts, account);

  const sSpellInfo: any = await getSspellConfig(
    multicallContracts,
    account,
    spellInfo
  );

  const mSpellInfo: any = await getMspellConfig(
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
