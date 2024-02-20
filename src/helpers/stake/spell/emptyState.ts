import { useImage } from "@/helpers/useImage";
import { ONE_ETHER_VIEM } from "@/constants/global";
import { spellConfig } from "@/configs/stake/spellConfig";
import type { EmptySpellState, EmptyTokenState } from "@/types/spell/empyState";
import { getSpellToSSpellRate } from "@/helpers/stake/spell/getSpellToSSpellRate";
import { getSpellStakingApr } from "./getSpellStakingApr";
import { createPublicClient, http } from "viem";
import { chainsList } from "@/helpers/chains/index";

const config = spellConfig[1 as keyof typeof spellConfig];
const { spell, sSpell, mSpell }: any = config;

const spellEmptyState: EmptyTokenState = {
  icon: spell.icon,
  name: spell.name,
  balance: 0n,
  price: ONE_ETHER_VIEM,
  rate: ONE_ETHER_VIEM,
  decimals: 18,
};

export const getSSpellEmptyState = async (): Promise<EmptyTokenState> => {
  const spellToSSpellRate = await getSpellToSSpellRate(spell, sSpell.contract);

  const publicClient = createPublicClient({
    chain: chainsList[1],
    transport: http(),
  });

  const totalSupply: any = await publicClient.readContract({
    ...sSpell.contract,
    functionName: "totalSupply",
    args: [],
  })

  return {
    icon: sSpell?.icon || useImage("assets/images/sspell-icon.svg"),
    rateIcon: useImage("assets/images/sspell-icon.svg"),
    name: sSpell?.name || "sSpell",
    balance: 0n,
    rate: spellToSSpellRate,
    price: ONE_ETHER_VIEM,
    decimals: 18,
    totalSupply,
  };
};

export const getMSpellEmptyState = async (chainId: number): Promise<EmptyTokenState> => {

  const publicClient = createPublicClient({
    chain: chainsList[chainId as keyof typeof chainsList],
    transport: http(),
  });

  const mSpellContract = spellConfig[chainId as keyof typeof spellConfig].mSpell.contract

  const spellAddress: any = await publicClient.readContract({
    ...mSpellContract,
    functionName: "spell",
    args: [],
  });

  const totalSupply: any = await publicClient.readContract({
    address: spellAddress,
    abi: spell.abi,
    functionName: "balanceOf",
    args: [mSpellContract.address],
  })

  return {
    icon: mSpell.icon,
    name: mSpell.name,
    balance: 0n,
    claimableAmount: 0n,
    price: ONE_ETHER_VIEM,
    rate: ONE_ETHER_VIEM,
    decimals: 18,
    totalSupply
  };
};

export const getSpellEmptyState = async (
  chainId: number
): Promise<EmptySpellState> => {
  const sSpell = await getSSpellEmptyState();
  const mSpellEmptyState = await getMSpellEmptyState(chainId)

  const { sSpellApr, mSpellApr } = await getSpellStakingApr();

  return {
    chainId,
    sSpell: { ...sSpell, apr: sSpellApr },
    spell: spellEmptyState,
    mSpell: { ...mSpellEmptyState, apr: mSpellApr },
  };
};
