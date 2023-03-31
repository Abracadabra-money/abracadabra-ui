import { ethers } from "ethers";
import oracleAbi from "@/utils/abi/oracle";
import { mapGetters, mapMutations } from "vuex";
import tokensAbi from "@/utils/abi/tokensAbi/index";
import { isTokenApprowed } from "@/utils/approveHelpers";
import chainLinkAbi from "@/utils/abi/chainLink";

export default {
  data() {
    return {
      price: null,
      stakeInfo: {
        mainToken: {
          name: "magicAPE",
          address: "0xf35b31B941D94B249EaDED041DB1b05b7097fEb6",
          decimals: 18,
          abi: tokensAbi.magicApe,
          icon: this.$image(`assets/images/tokens/mAPE.png`),
        },
        stakeToken: {
          name: "APE",
          address: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
          decimals: 18,
          abi: tokensAbi.APE,
          icon: this.$image(`assets/images/tokens/APE.png`),
        },
        oracle: {
          address: "0x64422a1337082Bf99E6052fF52684374Eb1A7fB7",
          abi: oracleAbi,
        },
        ethChainLinkAddress: "0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419",
      },
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      provider: "getProvider",
      account: "getAccount",
      signer: "getSigner",
    }),

    userSigner() {
      return this.signer || this.provider;
    },
  },

  methods: {
    ...mapMutations(["setLoadingMApeStake", "setMApeStakingObj"]),

    async createStakePool() {
      if (this.chainId !== 1) return !!this.setLoadingMApeStake(false);

      const { mainToken, stakeToken, oracle } = this.stakeInfo;

      const mainTokenInstance = await new this.$ethers.Contract(
        mainToken.address,
        JSON.stringify(mainToken.abi),
        this.userSigner
      );

      const stakeTokenInstance = await new this.$ethers.Contract(
        stakeToken.address,
        JSON.stringify(stakeToken.abi),
        this.userSigner
      );

      const tokensRate = await this.getTokensRate(mainTokenInstance);

      const feePercent = (await mainTokenInstance.feePercentBips()) / 10000; // to percent

      const oracleContract = await new this.$ethers.Contract(
        oracle.address,
        JSON.stringify(oracle.abi),
        this.userSigner
      );

      const ethChainLinkContract = await new this.$ethers.Contract(
        this.stakeInfo.ethChainLinkAddress,
        JSON.stringify(chainLinkAbi),
        this.userSigner
      );

      const ethPriceHex = await ethChainLinkContract.latestAnswer();
      const ethPrice = this.$ethers.utils.formatUnits(ethPriceHex, 8);

      if (!this.price) {
        const price = await oracleContract.peekSpot("0x");
        this.price = 1 / this.$ethers.utils.formatUnits(price, 18);
      }

      const { mainTokenBalance, stakeTokenBalance, stakeTokenApproved } =
        await this.getUserInfo(stakeTokenInstance, mainTokenInstance);

      const mainTokenBalanceUsd = mainTokenBalance * this.price * tokensRate;
      const stakeTokenBalanceUsd = stakeTokenBalance * this.price;
      const totalSupplyHex = await mainTokenInstance.totalSupply();
      const totalSupply = this.$ethers.utils.formatUnits(totalSupplyHex, 18);
      const totalSupplyUsd = totalSupply * this.price * tokensRate;

      const stakeObject = {
        tokensRate,
        feePercent,
        mainToken: {
          ...mainToken,
          contractInstance: mainTokenInstance,
          balance: mainTokenBalance,
          price: this.price * tokensRate,
          balanceUsd: mainTokenBalanceUsd,
          totalSupply,
          totalSupplyUsd,
        },
        stakeToken: {
          ...stakeToken,
          contractInstance: stakeTokenInstance,
          balance: stakeTokenBalance,
          price: this.price,
          balanceUsd: stakeTokenBalanceUsd,
          isApproved: stakeTokenApproved,
        },
        ethPrice,
      };

      this.setMApeStakingObj(stakeObject);
      this.setLoadingMApeStake(false);
    },

    async getTokensRate(mainTokenInstance) {
      const rate = await mainTokenInstance.convertToAssets(
        "1000000000000000000"
      );
      return ethers.utils.formatUnits(rate);

      // const mainTokenBalance = await stakeTokenInstance.balanceOf(
      //   mainTokenInstance.address
      // );

      // const totalSupply = await mainTokenInstance.totalSupply();

      // const parsedMainTokenBalance = this.$ethers.utils.formatEther(
      //   mainTokenBalance.toString()
      // );
      // const parsedTotalSupply = this.$ethers.utils.formatEther(totalSupply);

      // return parsedMainTokenBalance / parsedTotalSupply;
    },

    async getUserInfo(stakeInstance, mainInstance) {
      let stakeTokenBalance = 0;
      let mainTokenBalance = 0;
      let stakeTokenApproved = false;

      if (this.account) {
        const stakeTokenBalanceHex = await stakeInstance.balanceOf(
          this.account
        );
        stakeTokenBalance = this.$ethers.utils.formatEther(
          stakeTokenBalanceHex.toString()
        );

        const mainTokenBalanceHex = await mainInstance.balanceOf(this.account);
        mainTokenBalance = this.$ethers.utils.formatEther(
          mainTokenBalanceHex.toString()
        );

        stakeTokenApproved = await isTokenApprowed(
          stakeInstance,
          mainInstance.address,
          this.account,
          true
        );
      }

      return {
        mainTokenBalance,
        stakeTokenBalance,
        stakeTokenApproved,
      };
    },
  },
};
