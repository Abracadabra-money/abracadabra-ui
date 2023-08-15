import oracleAbi from "@/utils/abi/oracle";
import { useImage } from "@/helpers/useImage";
import chainLinkAbi from "@/utils/abi/chainLink";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import magicGlpHarvestorAbi from "@/utils/abi/MagicGlpHarvestor";

export const magicGlpConfig = {
  42161: {
    harvestor: {
      address: "0x588d402C868aDD9053f8F0098c2DC3443c991d17",
      abi: magicGlpHarvestorAbi,
    },
    mainToken: {
      name: "magicGLP",
      address: "0x85667409a723684Fe1e57Dd1ABDe8D88C2f54214",
      decimals: 18,
      abi: tokensAbi.magicGLP,
      icon: useImage("assets/images/tokens/mGlpToken.png"),
      rateIcon: useImage("assets/images/glp/mGlpNew.png"),
    },
    stakeToken: {
      name: "GLP",
      address: "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf",
      decimals: 18,
      abi: tokensAbi.sGLP,
      icon: useImage(`assets/images/tokens/GLP.png`),
    },
    oracle: {
      address: "0x4ED0935ecC03D7FcEfb059e279BCD910a02F284C",
      abi: oracleAbi,
    },
    chainLink: {
      address: "0x639fe6ab55c921f74e7fac1ee960c0b6293ba612",
      abi: chainLinkAbi,
    },
    additionalInfo: {
      rewardToken: {
        symbol: "ETH",
        icon: useImage("assets/images/tokens/ETH2.png"),
      },
      leverageInfo: {
        label: "Amplify your yield with the Abracadabra Leverage Engine",
        id: 3,
      },
    },
  },
  43114: {
    harvestor: {
      address: "0x05b3b96df07b4630373ae7506e51777b547335b0",
      abi: magicGlpHarvestorAbi,
    },
    mainToken: {
      name: "magicGLP",
      address: "0x5EFC10C353FA30C5758037fdF0A233e971ECc2e0",
      decimals: 18,
      abi: tokensAbi.magicGLP,
      icon: useImage("assets/images/tokens/mGlpToken.png"),
      rateIcon: useImage("assets/images/glp/mGlpNew.png"),
    },
    stakeToken: {
      name: "GLP",
      address: "0xae64d55a6f09e4263421737397d1fdfa71896a69",
      decimals: 18,
      abi: tokensAbi.sGLP,
      icon: useImage(`assets/images/tokens/GLP.png`),
    },
    oracle: {
      address: "0x3Cc89EA432c36c8F96731765997722192202459D",
      abi: oracleAbi,
    },
    chainLink: {
      address: "0x0a77230d17318075983913bc2145db16c7366156",
      abi: chainLinkAbi,
    },
    additionalInfo: {
      rewardToken: {
        symbol: "AVAX",
        icon: useImage("assets/images/tokens/AVAX.png"),
      },
      leverageInfo: {
        label: "Abracadabra Leverage Engine is being developed, stay tuned!",
      },
    },
  },
};
