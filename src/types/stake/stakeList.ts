export type StakeListItemConfig = {
    name: string;
    description: string;
    backgroundImage: string;
    routerLinkName: string;
    routerQuery?:any;
    mainToken?: TokenInfo;
    stakeToken: TokenInfo;
    rewardTokens: TokenInfo[],
    settings?: {
        hasLock?: boolean;
    };
}

export type StakeListItem = StakeListItemConfig & {
    fetchAPR: () => Promise<number | string>;
}

type TokenInfo = {
    name: string;
    symbol: string;
    icon: string;
}