import type {
  MSpellInfo,
  SSpellInfo,
  SpellInfo,
} from "@/helpers/stake/spell/types";
import type { Address } from "viem";
import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/abis/tokensAbi/index";
import { spellStakeConfig } from "@/configs/stake/spellConfig";
import type { SSpellConfig } from "@/configs/stake/spellConfig";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { MAINNET_CHAIN_ID, ONE_ETHER_VIEM } from "@/constants/global";
import { getSpellStakingApr } from "@/helpers/stake/spell/getSpellStakingApr";
import { getSpellToSSpellRate } from "@/helpers/stake/spell/getSpellToSSpellRate";

const getSpellEmptyState = async (
  chainId: number,
  spellPrice: bigint
): Promise<SpellInfo> => {
  const publicClient = getPublicClient(chainId);

  const spellConfig =
    spellStakeConfig[chainId as keyof typeof spellStakeConfig].spell;

  const mSpellContract =
    spellStakeConfig[chainId as keyof typeof spellStakeConfig].mSpell.contract;

  const spellAddress = (await publicClient.readContract({
    ...mSpellContract,
    functionName: "spell",
    args: [],
  })) as Address;

  return {
    balance: 0n,
    decimals: 18,
    icon: spellConfig.icon,
    name: spellConfig.name,
    price: spellPrice || ONE_ETHER_VIEM,
    contract: {
      address: spellAddress,
      abi: tokensAbi.SPELL,
    },
  };
};

const getMSpellEmptyState = async (
  chainId: number,
  spellPrice: bigint,
  apr: string
): Promise<MSpellInfo> => {
  const publicClient = getPublicClient(chainId);

  const spellConfig =
    spellStakeConfig[chainId as keyof typeof spellStakeConfig].spell;

  const mSpellConfig =
    spellStakeConfig[chainId as keyof typeof spellStakeConfig].mSpell;

  const spellAddress = (await publicClient.readContract({
    address: mSpellConfig.contract.address,
    abi: mSpellConfig.contract.abi,
    functionName: "spell",
    args: [],
  })) as Address;

  const totalSupply = (await publicClient.readContract({
    address: spellAddress,
    abi: spellConfig.abi,
    functionName: "balanceOf",
    args: [mSpellConfig.contract.address],
  })) as bigint;

  return {
    name: mSpellConfig.name,
    icon: mSpellConfig.icon,
    rateIcon: useImage("assets/images/mspell-icon.svg"),
    decimals: mSpellConfig.decimals,
    contract: mSpellConfig.contract,
    price: spellPrice,
    rate: ONE_ETHER_VIEM,
    lockTimestamp: "0",
    balance: 0n,
    approvedAmount: 0n,
    claimableAmount: 0n,
    totalSupply,
    apr,
  };
};

const getSSpellEmptyState = async (
  chainId: number,
  spellPrice: bigint,
  spell: SpellInfo,
  apr: string
): Promise<SSpellInfo> => {
  // if (chainId !== MAINNET_CHAIN_ID) return null;

  const sSpellConfig = spellStakeConfig[
    MAINNET_CHAIN_ID as keyof typeof spellStakeConfig
  ].sSpell as SSpellConfig;

  const publicClient = getPublicClient(MAINNET_CHAIN_ID);

  const spellToSSpellRate = await getSpellToSSpellRate(
    spell.contract,
    sSpellConfig.contract,
    publicClient
  );

  const sSpellPrice = (spellPrice * spellToSSpellRate) / ONE_ETHER_VIEM;

  const totalSupply = await publicClient.readContract({
    ...sSpellConfig.contract,
    functionName: "totalSupply",
    args: [],
  });

  return {
    name: sSpellConfig?.name || "sSpell",
    icon: sSpellConfig?.icon || useImage("assets/images/sspell-icon.svg"),
    rateIcon: useImage("assets/images/sspell-icon.svg"),
    decimals: 18,
    contract: sSpellConfig.contract,
    price: sSpellPrice,
    rate: spellToSSpellRate,
    lockTimestamp: "0",
    balance: 0n,
    approvedAmount: 0n,
    totalSupply: totalSupply as bigint,
    apr,
  };
};

export const getStakeEmptyState = async (
  chainId: number,
  spellPrice: bigint
) => {
  const spell = await getSpellEmptyState(chainId, spellPrice);
  const { sSpellApr, mSpellApr } = await getSpellStakingApr();
  const mSpellEmptyState = await getMSpellEmptyState(
    chainId,
    spellPrice,
    mSpellApr
  );
  const sSpell = await getSSpellEmptyState(
    chainId,
    spellPrice,
    spell,
    sSpellApr
  );

  return {
    chainId,
    spell: spell,
    sSpell: sSpell,
    mSpell: mSpellEmptyState,
  };
};
