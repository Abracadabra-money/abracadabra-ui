import tokensAbi from "@/abis/tokensAbi/index";
import { NIBIRU_CHAIN_ID } from "@/constants/global";
import { useImage } from "@/helpers/useImage";

export default [
  {
    name: "Spell",
    chainId: 1,
    address: "0x090185f2135308bad17527004364ebcc2d37e5f6",
    symbol: "SPELL",
    decimals: 18,
    abi: tokensAbi.SPELL,
    image: useImage("assets/images/tokens/SPELL.png"),
  },
  {
    name: "Spell",
    chainId: 42161,
    address: "0x55BE39c912621606683DEe44C4ab2Dde083Bc925",
    symbol: "SPELL",
    decimals: 18,
    abi: tokensAbi.SPELL,
    image: useImage("assets/images/tokens/SPELL.png"),
  },
  {
    name: "Spell",
    chainId: 43114,
    address: "0x55BE39c912621606683DEe44C4ab2Dde083Bc925",
    symbol: "SPELL",
    decimals: 18,
    abi: tokensAbi.SPELL,
    image: useImage("assets/images/tokens/SPELL.png"),
  },
  // {
  //   name: "Spell",
  //   chainId: 250,
  //   address: "0x55BE39c912621606683DEe44C4ab2Dde083Bc925",
  //   symbol: "SPELL",
  //   decimals: 18,
  //   abi: tokensAbi.SPELL,
  //   image: useImage("assets/images/tokens/SPELL.png"),
  // },
  {
    name: "Spell",
    chainId: 80094,
    address: "0x22581e7E93d66977849D094006fC2cF3aB9C8FfA",
    symbol: "SPELL",
    decimals: 18,
    abi: tokensAbi.SPELL,
    image: useImage("assets/images/tokens/SPELL.png"),
  },
  {
    name: "Spell",
    chainId: NIBIRU_CHAIN_ID,
    address: "0x1D63c9409bb41b2Ab43259b843fF32c839A9ffa2",
    symbol: "SPELL",
    decimals: 18,
    abi: tokensAbi.SPELL,
    image: useImage("assets/images/tokens/SPELL.png"),
  },
];
