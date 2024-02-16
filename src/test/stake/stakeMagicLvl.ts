export const stakeInfo = {
  senior: {
    name: "senior",
    tokensRate: 1.0493288760344543,
    feePercent: 0.01,
    mainToken: {
      name: "mLVS",
      icon: "/src/assets/images/tokens/mLvlSenior.png",
      balance: "1.698251317322405965",
      totalSupplyUsd: 452.81560089375785,
    },
    stakeToken: {
      name: "snrLLP",
      icon: "/src/assets/images/tokens/LVL.png",
      walletBalance: {
        type: "BigNumber",
        hex: "0x01aa535d3d0c0000",
      },
      balance: "0.876870739368976678",
      approvedAmount: {
        type: "BigNumber",
        hex: "0x732bf887aef78000",
      },
      pid: 0,
    },
  },
  mezzanine: {
    name: "mezzanine",
    tokensRate: 1.0622860107205132,
    feePercent: 0.01,
    mainToken: {
      name: "mLVM",
      icon: "/src/assets/images/tokens/mLvlMezzanine.png",
      balance: "0.0",
      totalSupplyUsd: 10195.609755849575,
    },
    stakeToken: {
      name: "mzeLLP",
      icon: "/src/assets/images/tokens/LVL.png",
      walletBalance: {
        type: "BigNumber",
        hex: "0x15088f1687d38770",
      },
      balance: "1.515618601541011367",
      approvedAmount: {
        type: "BigNumber",
        hex: "0x869d529b714a0000",
      },
      pid: 1,
    },
  },
  junior: {
    name: "junior",
    tokensRate: 1.0519940594295285,
    feePercent: 0.01,
    mainToken: {
      name: "mLVJ",
      icon: "/src/assets/images/tokens/mLvlJunior.png",
      balance: "0.7",
      totalSupplyUsd: 6922.004887014335,
    },
    stakeToken: {
      name: "jnrLLP",
      icon: "/src/assets/images/tokens/LVL.png",
      walletBalance: {
        type: "BigNumber",
        hex: "0x00",
      },
      balance: "0.696863598657598292",
      approvedAmount: {
        type: "BigNumber",
        hex: "0x81103cb9fb220000",
      },
      pid: 2,
    },
  },
  tranchesStatistics: {
    seniorApy: 34.91653252847304,
    mezzanineApy: 111.91168962058211,
    juniorApy: 157.9607803618103,
    seniorTotalRewardsUsd: 23.83349291602353,
    mezzanineTotalRewardsUsd: 338.0830638845325,
    juniorTotalRewardsUsd: 248.20473839501514,
    totalRewardsUsd: 610.1212951955712,
    totalSupplyUsd: 17570.43024375767,
  },
};
