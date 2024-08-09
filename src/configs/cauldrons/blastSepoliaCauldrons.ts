import poolsAbi from "@/abis/borrowPoolsAbi/index";
import tokensAbi from "@/abis/tokensAbi/index";
import { useImage } from "@/helpers/useImage";

import type { CauldronConfig } from "@/configs/cauldrons/configTypes";

const mimInfo = {
    name: "MIM",
    icon: useImage(`assets/images/tokens/MIM.png`),
    decimals: 18,
    address: "0x0eb13D9C49C31B57e896c1637766E9EcDC1989CD",
    abi: tokensAbi.MIM,
};

const config: Array<CauldronConfig> = [
    {
        icon: useImage(`assets/images/tokens/WETH.png`),
        name: "WETH",
        chainId: 168587773,
        id: 1,
        liquidationFee: 6,
        mcr: 80,
        borrowFee: 0.5,
        version: 4,
        cauldronSettings: {
            is0xSwap: false,
            isSwappersActive: false,
            isDegenBox: true,
            strategyLink: false,
            isDepreciated: false,
            acceptUseDefaultBalance: true,
            healthMultiplier: 1,
            hasAccountBorrowLimit: false,
            hasWithdrawableLimit: false,
            localBorrowAmountLimit: false,
            hasCrvClaimLogic: false,
            isTesting: false,
        },
        contract: {
            name: "CauldronV4",
            address: "0x987a25633EDcf696f42b2E6E5547352774FE9ef3",
            abi: poolsAbi.CauldronV4,
        },
        collateralInfo: {
            name: "WETH",
            decimals: 18,
            address: "0x4200000000000000000000000000000000000023",
            abi: tokensAbi.wETH,
        },
        mimInfo,
    },
];

export default config;