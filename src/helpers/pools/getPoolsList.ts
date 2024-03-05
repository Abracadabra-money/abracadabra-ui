import { useImage } from "@/helpers/useImage";

export const getPoolsList = async () => {
  return [
    {
      config: {
        id: 1,
        chainId: 81457,
        name: "MIM/USDT",
        icon: useImage(`assets/images/tokens/MIM.png`),
        poolSettings: { isNew: false, isDeprecated: true, isMim: false },
      },
      mainParams: {
        tvl: 1000000000000n,
        apr: 10n,
        liquidityValue: 200n,
        dayFees: 470n,
        dayVolume: 10n,
        weekFees: 70n,
        weekVolume: 70n,
      },
      userPosition: true,
    },
    {
      config: {
        id: 2,
        chainId: 81457,
        name: "1MIM/USDT",
        icon: useImage(`assets/images/tokens/MIM.png`),
        poolSettings: { isNew: false, isDeprecated: true, isMim: false },
      },
      mainParams: {
        tvl: 21000000000000n,
        apr: 210n,
        liquidityValue: 2200n,
        dayFees: 2410n,
        dayVolume: 23910n,
        weekFees: 270n,
        weekVolume: 270n,
      },
    },
    {
      config: {
        id: 3,
        chainId: 81457,
        name: "2MIM/USDT",
        icon: useImage(`assets/images/tokens/MIM.png`),
        poolSettings: { isNew: false, isDeprecated: false, isMim: false },
      },
      mainParams: {
        tvl: 31000000000000n,
        apr: 310n,
        liquidityValue: 3200n,
        dayFees: 310n,
        dayVolume: 310n,
        weekFees: 370n,
        weekVolume: 370n,
      },
      userPosition: true,
    },
    {
      config: {
        id: 4,
        chainId: 81457,
        name: "IsMim3MIM/USDT",
        icon: useImage(`assets/images/tokens/MIM.png`),
        poolSettings: { isNew: false, isDeprecated: false, isMim: true },
      },
      mainParams: {
        tvl: 41000000000000n,
        apr: 410n,
        liquidityValue: 4200n,
        dayFees: 410n,
        dayVolume: 410n,
        weekFees: 470n,
        weekVolume: 470n,
      },
    },
    {
      config: {
        id: 5,
        chainId: 81457,
        name: "4MIM/USDT",
        icon: useImage(`assets/images/tokens/MIM.png`),
        poolSettings: { isNew: true, isDeprecated: false, isMim: false },
      },
      mainParams: {
        tvl: 51000000000000n,
        apr: 510n,
        liquidityValue: 5200n,
        dayFees: 510n,
        dayVolume: 510n,
        weekFees: 570n,
        weekVolume: 570n,
      },
      userPosition: true,
    },
    {
      config: {
        id: 6,
        chainId: 81457,
        name: "IsMim4MIM/USDT",
        icon: useImage(`assets/images/tokens/MIM.png`),
        poolSettings: { isNew: true, isDeprecated: false, isMim: true },
      },
      mainParams: {
        tvl: 51000000000000n,
        apr: 510n,
        liquidityValue: 5200n,
        dayFees: 510n,
        dayVolume: 510n,
        weekFees: 570n,
        weekVolume: 570n,
      },
      userPosition: true,
    },
  ];
};
