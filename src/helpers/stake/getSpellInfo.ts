import axios from "axios";
import moment from "moment";
import { markRaw } from "vue";
import type { providers } from "ethers";
import { getAccount } from "@wagmi/core";
import { Contract, utils, BigNumber } from "ethers";
import { spellConfig } from "@/utils/stake/spellConfig";
import { MulticallWrapper } from "ethers-multicall-provider";
import type {
  SpellStakingApr,
  MSpellConfig,
  SSpellConfig,
  SpellConfig,
} from "@/helpers/stake/spellTypes";

const zero = BigNumber.from("0");

const spellEmptyState = {
  name: spellConfig.spell.name,
  icon: spellConfig.spell.icon,
  decimals: spellConfig.spell.decimals,
  sSpellRate: 1,
  balance: "0",
};

const sSpellEmptyState = {
  name: spellConfig.sSpell.name,
  icon: spellConfig.sSpell.icon,
  rate: 1,
  lockTimestamp: "0",
  contract: null,
  balance: "0",
  isTokenApproved: false,
  approvedAmount: "0",
  unsupportedChain: true,
};

const mSpellEmptyState = {
  name: spellConfig.mSpell.name,
  icon: spellConfig.mSpell.icon,
  rate: 1,
  lockTimestamp: "0",
  contract: null,
  balance: "0",
  claimableAmount: "0",
  isTokenApproved: false,
  approvedAmount: "0",
  unsupportedChain: true,
};

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

  const mSpellInfo: any = await getMspellConfig(multicallContracts, account);

  const { sSpellApr, mSpellApr }: any = await getSpellStakingApr();
  const { spell, sSpell, mSpell } = await getContracts(userSigner, chainId);

  return {
    spell: markRaw({ ...spellInfo, contract: spell }),
    sSpell: markRaw({ ...sSpellInfo, contract: sSpell, apr: sSpellApr }),
    mSpell: markRaw({ ...mSpellInfo, contract: mSpell, apr: mSpellApr }),
  };
};

const getContracts = async (
  provider: providers.BaseProvider,
  chainId: number
) => {
  const { spell, sSpell, mSpell }: any = spellConfig;

  const mSpellAddress = mSpell.addresses[chainId];

  const sSpellAddress = sSpell.addresses[chainId];

  const sSpellContract = sSpellAddress
    ? new Contract(sSpellAddress, JSON.stringify(sSpell.abi), provider)
    : null;

  const mSpellContract = mSpellAddress
    ? new Contract(mSpellAddress, JSON.stringify(mSpell.abi), provider)
    : null;

  const spellAddress = mSpellContract ? await mSpellContract?.spell() : null;
  const spellContract = spellAddress
    ? new Contract(spellAddress, JSON.stringify(spell.abi), provider)
    : null;

  return {
    spell: spellContract,
    sSpell: sSpellContract,
    mSpell: mSpellContract,
  };
};

const getSpellConfig = async (
  contracts: any,
  account: string | undefined
): Promise<SpellConfig> => {
  const { spell, sSpell } = contracts;
  const { decimals, name, icon }: any = spellConfig.spell;

  if (!spell) return spellEmptyState;

  const getBalance = sSpell ? spell.balanceOf(sSpell?.address) : zero;
  const getTotalSupply = sSpell ? sSpell.totalSupply() : zero;
  const spellBalance = account ? spell.balanceOf(account) : zero;

  const multicallArr = [getBalance, getTotalSupply, spellBalance];
  const response = await Promise.all(multicallArr);

  const precision = BigNumber.from(Math.pow(10, decimals).toString());

  const sSpellRate = +response[0].toString()
    ? +utils.formatUnits(response[0].mul(precision).div(response[1], decimals))
    : 0;

  return {
    icon,
    name,
    sSpellRate,
    balance: utils.formatUnits(response[2], decimals),
  };
};

const getSspellConfig = async (
  contracts: any,
  account: string | undefined,
  spellInfo: any
): Promise<SSpellConfig> => {
  if (!contracts.sSpell) return sSpellEmptyState;

  const { sSpellRate } = spellInfo;
  const { sSpell, spell } = contracts;
  const { address } = sSpell;
  const { decimals, name, icon }: any = spellConfig.sSpell;

  const isTokenApproved = account ? spell.allowance(account, address) : zero;
  const getBalance = account ? sSpell.balanceOf(account) : "0x00";
  const getUserInfo = account ? sSpell.users(account) : { lockedUntil: "0" };

  const multicallArr = [isTokenApproved, getBalance, getUserInfo];
  const response = await Promise.all(multicallArr);

  return {
    name,
    icon,
    rate: sSpellRate,
    lockTimestamp: response[2]?.lockedUntil?.toString(),
    contract: sSpell,
    balance: utils.formatUnits(response[1], decimals),
    isTokenApproved: response[0].toString() > 0,
    approvedAmount: utils.formatUnits(response[0], decimals),
  };
};

const getMspellConfig = async (
  contracts: any,
  account: string | undefined
): Promise<MSpellConfig> => {
  if (!contracts.mSpell) return mSpellEmptyState;
  const { mSpell, spell } = contracts;

  const { name, icon, decimals } = spellConfig.mSpell;

  const isTokenApproved = account
    ? spell.allowance(account, mSpell.address)
    : "0x00";

  const userInfo = account ? mSpell.userInfo(account) : { lastAdded: "0" };
  const claimableAmount = account ? mSpell.pendingReward(account) : "0x00";

  const multicallArr = [isTokenApproved, userInfo, claimableAmount];

  const response = await Promise.all(multicallArr);

  const { lastAdded } = response[1];
  const lockTimestamp = moment.unix(lastAdded.toString() || 0).add(1, "d");
  const currentTimestamp = moment();
  const isLocked = lockTimestamp.isAfter(currentTimestamp);

  return {
    name,
    icon,
    rate: 1,
    lockTimestamp: isLocked ? lockTimestamp.unix().toString() : "0",
    contract: mSpell,
    balance: utils.formatUnits(response[1]?.amount || zero, decimals),
    claimableAmount: utils.formatUnits(response[2], decimals),
    isTokenApproved: response[0].toString() > 0,
    approvedAmount: utils.formatUnits(response[0], decimals),
  };
};

const getSpellStakingApr = async (): Promise<SpellStakingApr> => {
  try {
    const response = await axios.get(import.meta.env.VITE_APP_SPELL_APR_URL);

    return {
      sSpellApr: response.data.apr,
      mSpellApr: response.data.apr,
    };
  } catch (error) {
    console.log("Get Spell Staking Apr Error:", error);
    return {
      sSpellApr: "N/A",
      mSpellApr: "N/A",
    };
  }
};
