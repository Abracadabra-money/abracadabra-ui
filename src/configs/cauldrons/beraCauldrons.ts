import { useImage } from "@/helpers/useImage";
import tokensAbi from "@/abis/tokensAbi/index";
import poolsAbi from "@/abis/borrowPoolsAbi/index";
import degenBoxERC4626Wrapper from "@/abis/lp/DegenBoxERC4626Wrapper";
import type { CauldronConfig } from "@/configs/cauldrons/configTypes";

const mimInfo = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
  decimals: 18,
  address: "0x5B82028cfc477C4E7ddA7FF33d59A23FA7Be002a",
  abi: tokensAbi.MIM,
};

const config: Array<CauldronConfig> = [
  {
    icon: useImage(`assets/images/tokens/Kodiak-MIM-Honey.png`),
    name: "MIM/HONEY",
    chainId: 80094,
    id: 1,
    liquidationFee: 5,
    mcr: 90,
    borrowFee: 0.5,
    version: 4,
    cauldronSettings: {
      is0xSwap: false,
      isSwappersActive: false,
      isDegenBox: true,
      strategyLink: false,
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: false,
      hasWithdrawableLimit: false,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
      oracleInfo: {
        kind: "PYTH",
        feedIds: ["0xf67b033925d73d43ba4401e00308d9b0f26ab4fbd1250e8b5407b9eaade7e1f4"],
      },
    },
    contract: {
      name: "CauldronV4",
      address: "0xFc4de12E0C25e442E10260dE575a7994e5E68E20",
      abi: poolsAbi.CauldronV4,
    },
    collateralInfo: {
      name: "MagicKodiak Vault",
      decimals: 18,
      address: "0x548eAf30BAD1B4f697fBAC88712fc8148Dc0aA75",
      abi: tokensAbi.MagicKodiakVault,
    },
    mimInfo,
    wrapInfo: {
      isHiddenWrap: true,
      useUnwrappedByDefault: true,
      unwrappedToken: {
        name: "MIM/HONEY LP",
        icon: useImage(`assets/images/tokens/MIM-HONEY.png`),
        address: "0x933b2e6a71edBF11BBA75C5Ad241D246b145E0b0",
        abi: tokensAbi.MagicKodiakVault,
      },
      wrapper: {
        address: "0x6D1EAAdeD97DC9d49BCb08Bdcd15EAcb08da42e4",
        abi: degenBoxERC4626Wrapper,
      },
    },
  },
];

export default config;
