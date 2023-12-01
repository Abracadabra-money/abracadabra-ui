import tokensAbi from "@/utils/abi/tokensAbi/index";
import poolsAbi from "@/utils/abi/borrowPoolsAbi/index";
import { erc20ABI } from "@wagmi/core";
import degenBoxERC4626Wrapper from "@/utils/abi/lp/DegenBoxERC4626Wrapper";
import MagicCurveLpLevSwapper from "@/utils/abi/lp/MagicCurveLpLevSwapper";
import MagicCurveLpSwapper from "@/utils/abi/lp/MagicCurveLpSwapper";
import StargateLPLevSwapper from "@/utils/abi/lp/StargateLPLevSwapper";
import StargateLPSwapper from "@/utils/abi/lp/StargateLPSwapper";

import { useImage } from "@/helpers/useImage";

import type { CauldronConfig } from "@/utils/cauldronsConfig/configTypes";

const mimInfo = {
  name: "MIM",
  icon: useImage(`assets/images/tokens/MIM.png`),
  decimals: 18,
  address: "0x471EE749bA270eb4c1165B5AD95E614947f6fCeb",
  abi: tokensAbi.MIM,
};

const config: Array<CauldronConfig> = [
  {
    icon: useImage(`assets/images/tokens/Curve-MIM-USDT.png`),
    name: "MIM/USDT Curve LP",
    chainId: 2222,
    id: 1,
    liquidationFee: 0.5,
    interest: 3,
    mcr: 97,
    borrowFee: 0.15,
    version: 4,
    cauldronSettings: {
      isSwappersActive: true,
      is0xSwap: true,
      isOpenocean: true,
      isDegenBox: true,
      strategyLink: "",
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: true,
      hasWithdrawableLimit: false,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
      isMimUsdtCurveLp: true,
    },
    contract: {
      name: "CauldronV4",
      address: "0x3CFf6F628Ebc88e167640966E67314Cf6466E6A8",
      abi: poolsAbi.CauldronV4,
    },
    collateralInfo: {
      name: "mCurveLP-MIM-USDT",
      decimals: 18,
      address: "0x729D8855a1D21aB5F84dB80e00759E7149936e30",
      abi: tokensAbi.mimUsdtCurveLp,
    },
    mimInfo,
    wrapInfo: {
      isHiddenWrap: true,
      useUnwrappedByDefault: true,
      unwrappedToken: {
        name: "MIMUSDt-f",
        icon: useImage(`assets/images/tokens/Curve-MIM-USDT.png`),
        address: "0x591199E16E006Dec3eDcf79AE0fCea1Dd0F5b69D",
        abi: erc20ABI, //todo
      },
      wrapper: {
        address: "0x9b2794Aeff2E6Bd2b3e32e095E878bF17EB6BdCC",
        abi: degenBoxERC4626Wrapper,
      },
    },
    leverageInfo: {
      address: "0x29BE2644721689c45a5A317d5Fb452747E454DcE",
      abi: MagicCurveLpLevSwapper,
    },
    deleverageInfo: {
      address: "0xE427f03A5D41eb80d79F6D35B86f6fb7054a21a8",
      abi: MagicCurveLpSwapper,
    },
  },
  {
    icon: useImage(`assets/images/tokens/Stargate-USDT.png`),
    name: "TetherUSDt-LP",
    chainId: 2222,
    id: 2,
    liquidationFee: 0.5,
    interest: 3,
    mcr: 97,
    borrowFee: 0.15,
    version: 4,
    cauldronSettings: {
      isSwappersActive: true,
      is0xSwap: true,
      isOpenocean: true,
      isDegenBox: true,
      strategyLink: "", //
      isDepreciated: false,
      acceptUseDefaultBalance: false,
      healthMultiplier: 1,
      hasAccountBorrowLimit: true,
      hasWithdrawableLimit: false,
      localBorrowAmountLimit: false,
      hasCrvClaimLogic: false,
    },
    contract: {
      name: "CauldronV4",
      address: "0x895731a0C3836a5534561268F15EBA377218651D",
      abi: poolsAbi.CauldronV4,
    },
    collateralInfo: {
      name: "TetherUSDt-LP",
      decimals: 6,
      address: "0xAad094F6A75A14417d39f04E690fC216f080A41a",
      abi: tokensAbi.TetherUSDtLP,
    },
    mimInfo,
    leverageInfo: {
      address: "0xaB3274Cfa8f5586C553744AFe1ddA13d97b7fd6f",
      abi: StargateLPLevSwapper,
    },
    deleverageInfo: {
      address: "0xF4EfF93BC468cb31F6B838BC0fB171B0A00B1417",
      abi: StargateLPSwapper,
    },
  },
];

export default config;
