import { markRaw } from "vue";
import levelMasterV2Abi from "@/utils/abi/levelMasterV2";
import { mapGetters, mapMutations } from "vuex";
import { isTokenApprowed } from "@/utils/approveHelpers";
import { MulticallWrapper } from "ethers-multicall-provider";
import { Contract, utils } from "ethers";
import { getLevelFinanceStatistics } from "@/helpers/subgraph/magicLvl";

import lvlConfig from "@/utils/stake/lvlConfig";

export default {
  data() {
    return {
      levelMasterV2Address: "0x5aE081b6647aEF897dEc738642089D4BDa93C0e7",
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
      provider: "getProvider",
    }),

    multicalProvider() {
      return MulticallWrapper.wrap(this.provider);
    },

    userSigner() {
      return this.signer || this.provider;
    },
  },

  methods: {
    ...mapMutations(["setLoadingMLvlStake", "setMLvlStakingObj"]),

    async createLvlContracts() {
      return await Promise.all(
        lvlConfig.map(async (config) => {
          const mainTokenInstance = await new Contract(
            config.mainToken.address,
            JSON.stringify(config.mainToken.abi),
            this.multicalProvider
          );

          const stakeTokenInstance = await new Contract(
            config.stakeToken.address,
            JSON.stringify(config.stakeToken.abi),
            this.multicalProvider
          );

          const oracleContract = await new Contract(
            config.oracle.address,
            JSON.stringify(config.oracle.abi),
            this.multicalProvider
          );

          return { mainTokenInstance, stakeTokenInstance, oracleContract };
        })
      );
    },

    async getOracleRates(lvlContracts) {
      return await Promise.all(
        lvlContracts.map(({ oracleContract }) => oracleContract.peekSpot("0x"))
      );
    },

    async getTokensRates(lvlContracts) {
      return await Promise.all(
        lvlContracts.map(({ mainTokenInstance }) =>
          mainTokenInstance.convertToAssets("1000000000000000000")
        )
      );
    },

    async getMainTokensBalances(lvlContracts) {
      return await Promise.all(
        lvlContracts.map(({ mainTokenInstance }) =>
          mainTokenInstance.balanceOf(this.account)
        )
      );
    },

    async getStakeTokensBalances(lvlContracts) {
      return await Promise.all(
        lvlContracts.map(({ stakeTokenInstance }) =>
          stakeTokenInstance.balanceOf(this.account)
        )
      );
    },

    async getLevelMasterBalances(lvlContracts, lvlContract) {
      return await Promise.all(
        lvlContracts.map((_, index) =>
          lvlContract.userInfo(index, this.account)
        )
      );
    },

    async getTokensApprowed(lvlContracts) {
      return await Promise.all(
        lvlContracts.map(({ stakeTokenInstance, mainTokenInstance }) =>
          isTokenApprowed(
            stakeTokenInstance,
            mainTokenInstance.address,
            this.account,
            true
          )
        )
      );
    },

    async getTotalSupply(lvlContracts) {
      return await Promise.all(
        lvlContracts.map(({ mainTokenInstance }) =>
          mainTokenInstance.totalSupply()
        )
      );
    },

    async getTranchesStatistics(totalSupplyArr, totalSupplyUsd) {
      const totalSupply = totalSupplyArr.reduce((accumulator, value) =>
        accumulator.add(value)
      );

      const { juniorApy, mezzanineApy, seniorApy, junior, mezzanine, senior } =
        await getLevelFinanceStatistics();

      const { totalRewards: juniorTotalRewards, lpPriceUsd: juniorLpPriceUsd } =
        junior;

      const juniorTotalRewardsUsd =
        +utils.formatEther(juniorTotalRewards) * +juniorLpPriceUsd;

      const {
        totalRewards: mezzanineTotalRewards,
        lpPriceUsd: mezzanineLpPriceUsd,
      } = mezzanine;

      const mezzanineTotalRewardsUsd =
        +utils.formatEther(mezzanineTotalRewards) * +mezzanineLpPriceUsd;

      const { totalRewards: seniorTotalRewards, lpPriceUsd: seniorLpPriceUsd } =
        senior;
      const seniorTotalRewardsUsd =
        +utils.formatEther(seniorTotalRewards) * +seniorLpPriceUsd;

      const totalRewardsUsd =
        juniorTotalRewardsUsd +
        mezzanineTotalRewardsUsd +
        seniorTotalRewardsUsd;

      return {
        juniorApy,
        mezzanineApy,
        seniorApy,
        juniorTotalRewardsUsd,
        mezzanineTotalRewardsUsd,
        seniorTotalRewardsUsd,
        totalRewardsUsd,
        totalSupply: utils.formatEther(totalSupply),
        totalSupplyUsd,
      };
    },

    async createStakePool() {
      if (this.chainId !== 56) return !!this.setLoadingMLvlStake(false);
      const levelMasterContract = await new Contract(
        this.levelMasterV2Address,
        JSON.stringify(levelMasterV2Abi),
        this.multicalProvider
      );

      const lvlContracts = await this.createLvlContracts();

      const oracleRates = await this.getOracleRates(lvlContracts);

      const tokensRates = await this.getTokensRates(lvlContracts);

      const totalSupplyArr = await this.getTotalSupply(lvlContracts);

      const {
        mainTokensBalances,
        stakeTokensBalances,
        levelMasterBalances,
        stakeTokensApprowed,
      } = await this.getUserInfo(lvlContracts, levelMasterContract);

      let totalSupplyUsd = 0;
      let totalSupplyArrUsd = [];
      const stakeInfo = {};

      lvlContracts.map((contracts, idx) => {
        const tokensRate = utils.formatUnits(tokensRates[idx]);
        const mainContractInstance = contracts.mainTokenInstance.connect(
          this.userSigner
        );
        const mainBalance = this.account
          ? utils.formatEther(mainTokensBalances[idx].toString())
          : 0;
        const mainPrice =
          (1 / utils.formatUnits(oracleRates[idx], 18)) * tokensRate;
        const mainBalanceUsd = mainBalance * mainPrice;
        const mainTotalSupply = utils.formatUnits(totalSupplyArr[idx], 18);
        const mainTotalSupplyUsd = mainTotalSupply * mainPrice;
        totalSupplyArrUsd.push(mainTotalSupplyUsd);
        totalSupplyUsd = totalSupplyUsd + mainTotalSupplyUsd;

        const stakeContractInstance = contracts.stakeTokenInstance.connect(
          this.userSigner
        );

        const stakeTokenBalance = stakeTokensBalances[idx].add(
          levelMasterBalances[idx]?.amount
        );

        const price = 1 / utils.formatUnits(oracleRates[idx].toString(), 18);

        stakeInfo[lvlConfig[idx].name] = {
          feePercent: 1,
          ethPrice: 1,
          tokensRate,
          levelMasterContract: levelMasterContract.connect(this.userSigner),
          mainToken: {
            ...lvlConfig[idx].mainToken,
            contractInstance: mainContractInstance,
            balance: mainBalance,
            price: mainPrice,
            balanceUsd: mainBalanceUsd,
            totalSupply: mainTotalSupply,
            totalSupplyUsd: mainTotalSupplyUsd,
          },
          stakeToken: {
            ...lvlConfig[idx].stakeToken,
            contractInstance: stakeContractInstance,
            walletBalance: stakeTokensBalances[idx],
            balance: stakeTokenBalance,
            formatBalance: utils.formatEther(stakeTokenBalance.toString()),
            price: price,
            balanceUsd: stakeTokenBalance * price,
            isApproved: stakeTokensApprowed[idx],
            pid: idx,
          },
        };
      });

      stakeInfo.tranchesStatistics = await this.getTranchesStatistics(
        totalSupplyArr,
        totalSupplyUsd
      );

      this.setMLvlStakingObj(markRaw(stakeInfo));
      this.setLoadingMLvlStake(false);
    },

    async getUserInfo(lvlContracts, levelMasterContract) {
      let mainTokensBalances = 0;
      let stakeTokensBalances = 0;
      let levelMasterBalances = 0;
      let stakeTokensApprowed = false;

      if (this.account) {
        mainTokensBalances = await this.getMainTokensBalances(lvlContracts);
        stakeTokensBalances = await this.getStakeTokensBalances(lvlContracts);

        levelMasterBalances = await this.getLevelMasterBalances(
          lvlContracts,
          levelMasterContract
        );

        stakeTokensApprowed = await this.getTokensApprowed(lvlContracts);
      }

      return {
        mainTokensBalances,
        stakeTokensBalances,
        levelMasterBalances,
        stakeTokensApprowed,
      };
    },
  },
};
