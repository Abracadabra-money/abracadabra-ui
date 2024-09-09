import { useImage } from "@/helpers/useImage";
import type { StakeListItemConfig } from "@/types/stake/stakeList";


export const stakeListConfig: StakeListItemConfig[] = [
    {
        name: 'Magic GLP',
        description: 'Stake your SPELL into mSPELL! No impermanent loss, no loss of governance rights. Protocol Fee 1% ',
        backgroundImage: useImage("assets/images/stake/stake-list/background-images/magic-glp.png"),
        routerLinkName: 'magicGLP',
        mainToken: {
            name: 'Magic GLP',
            symbol: 'mGLP',
            icon: useImage("assets/images/tokens/mGlpToken.png")
        },
        stakeToken: {
            name: 'GLP',
            symbol: 'GLP',
            icon: useImage("assets/images/tokens/GLP.png")
        },
        rewardTokens: [{
            name: 'GLP',
            symbol: 'GLP',
            icon: useImage("assets/images/tokens/GLP.png")
        }],
    },
    {
        name: 'mSpell',
        description: 'Stake your SPELL into mSPELL! No impermanent loss, no loss of governance rights. Protocol Fee 1% ',
        backgroundImage: useImage("assets/images/stake/stake-list/background-images/mspell.png"),
        routerLinkName: 'StakeSpell',
        routerQuery: { token: 'mSpell' },
        mainToken: {
            name: 'magic SPELL',
            symbol: 'mSPELL',
            icon: useImage("assets/images/tokens/mSPELL.png")
        },
        stakeToken: {
            name: 'Spell',
            symbol: 'SPELL',
            icon: useImage("assets/images/tokens/SPELL.png")
        },
        rewardTokens: [{
            name: 'Magic Internet Money',
            symbol: 'MIM',
            icon: useImage("assets/images/tokens/MIM.png")
        }],
    },
    {
        name: 'sSpell',
        description: 'Stake your SPELL into mSPELL! No impermanent loss, no loss of governance rights. Protocol Fee 1% ',
        backgroundImage: useImage("assets/images/stake/stake-list/background-images/sspell.png"),
        routerLinkName: 'StakeSpell',
        routerQuery: { token: 'sSpell' },
        mainToken: {
            name: 'sSPELL',
            symbol: 'sSPELL',
            icon: useImage("assets/images/tokens/sSPELL.png")
        },
        stakeToken: {
            name: 'Spell',
            symbol: 'SPELL',
            icon: useImage("assets/images/tokens/SPELL.png")
        },
        rewardTokens: [{
            name: 'Spell',
            symbol: 'SPELL',
            icon: useImage("assets/images/tokens/SPELL.png")
        }],
    },
    {
        name: 'Magic APE',
        description: 'Stake your SPELL into mSPELL! No impermanent loss, no loss of governance rights. Protocol Fee 1% ',
        backgroundImage: useImage("assets/images/stake/stake-list/background-images/magic-ape.png"),
        routerLinkName: 'magicAPE',
        mainToken: {
            name: 'magic APE',
            symbol: 'mAPE',
            icon: useImage("assets/images/tokens/mAPE.png")
        },
        stakeToken: {
            name: 'APE',
            symbol: 'APE',
            icon: useImage("assets/images/tokens/APE.png")
        },
        rewardTokens: [{
            name: 'APE',
            symbol: 'APE',
            icon: useImage("assets/images/tokens/APE.png")
        }],
    },
    {
        name: 'MIM Saving Rate',
        description: 'Stake your SPELL into mSPELL! No impermanent loss, no loss of governance rights. Protocol Fee 1% ',
        backgroundImage: useImage("assets/images/stake/stake-list/background-images/mim-saving-rate.png"),
        routerLinkName: 'MSR',
        stakeToken: {
            name: 'Magic Internet Money',
            symbol: 'MIM',
            icon: useImage("assets/images/tokens/MIM.png")
        },
        rewardTokens: [
            {
                name: 'Magic Internet Money',
                symbol: 'MIM',
                icon: useImage("assets/images/tokens/MIM.png")
            },
            {
                name: 'Spell',
                symbol: 'SPELL',
                icon: useImage("assets/images/tokens/SPELL.png")
            },
            {
                name: 'Arbitrum',
                symbol: 'ARB',
                icon: useImage("assets/images/tokens/ARB.png")
            }
        ],
        settings: {
            hasLock: true,
        }
    }
]