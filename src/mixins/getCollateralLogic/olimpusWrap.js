import wrapConf from "@/utils/collateralConfig/ohm-swap/wrapConf";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      chainId: "getChainId",
      signer: "getSigner",
      account: "getAccount",
    }),
  },
  methods: {
    async createOlimpusWrap() {
      if (!wrapConf) {
        return false;
      }

      if (this.chainId !== 1) return false;

      const { mainToken, stakeToken } = wrapConf;

      const mainTokenInstance = new this.$ethers.Contract(
        mainToken.address,
        JSON.stringify(mainToken.abi),
        this.signer
      );

      let mainTokenBalance = await mainTokenInstance.balanceOf(this.account);

      mainTokenBalance = this.$ethers.utils.formatUnits(
        mainTokenBalance.toString(),
        mainToken.decimals
      );

      const stakeTokenInstance = new this.$ethers.Contract(
        stakeToken.address,
        JSON.stringify(stakeToken.abi),
        this.signer
      );

      let stakeTokenBalance = await stakeTokenInstance.balanceOf(this.account);

      stakeTokenBalance = this.$ethers.utils.formatUnits(
        stakeTokenBalance.toString(),
        stakeToken.decimals
      );

      let stakeToMain;
      try {
        const sOHMTowOHM = await mainTokenInstance.sOHMTowOHM("1");

        const sOHMTowOHMParsed = this.$ethers.utils.formatUnits(
          sOHMTowOHM,
          stakeToken.decimals
        );

        stakeToMain = sOHMTowOHMParsed;
      } catch (e) {
        console.log("rate errro:", e);
      }

      let mainToStake;

      try {
        const sOHMTowOHM = await mainTokenInstance.wOHMTosOHM(
          "1000000000000000000"
        );

        const sOHMTowOHMParsed = this.$ethers.utils.formatUnits(
          sOHMTowOHM,
          stakeToken.decimals
        );

        mainToStake = sOHMTowOHMParsed;
      } catch (e) {
        console.log("rate errro:", e);
      }

      const isTokenApprowed = await this.isTokenApprowed(
        stakeTokenInstance,
        this.account,
        mainToken.address
      );

      const wrapObject = {
        stakeToMain,
        mainToStake,
        mainToken: {
          ...mainToken,
          contractInstance: mainTokenInstance,
          balance: mainTokenBalance,
        },
        stakeToken: {
          ...stakeToken,
          contractInstance: stakeTokenInstance,
          balance: stakeTokenBalance,
          isTokenApprowed,
        },
      };

      return wrapObject;
    },
    async isTokenApprowed(tokenContract, userAddr, approveAddr) {
      try {
        const addressApprowed = await tokenContract.allowance(
          userAddr,
          approveAddr,
          {
            gasLimit: 100000000,
          }
        );

        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("OLIMPUS WRAP isApprowed err:", e);
        return false;
      }
    },
  },
};
