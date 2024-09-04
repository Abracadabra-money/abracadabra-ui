export type StakeListItem = {
    name: string;
    description: string;
    backgroundImage: string;
    routerLinkName: string;
    mainToken?: TokenInfo;
    stakeToken: TokenInfo;
    rewardTokens: TokenInfo[],
    fetchAPR: () => string;
    settings?: {
        hasLock?: boolean;
    };
}

type TokenInfo = {
    name: string;
    symbol: string;
    icon: string;
}