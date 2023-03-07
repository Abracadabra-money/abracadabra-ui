import depositConf from "@/utils/collateralConfig/crv/depositConfig";
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
    async createCrvDeposit(collateralAddr = null) {
      if (!depositConf) {
        return false;
      }

      if (this.chainId !== 1) return false;

      const { mainToken, depositToken } = depositConf;

      if (collateralAddr) {
        mainToken.address = collateralAddr;
      }

      const mainTokenInstance = new this.$ethers.Contract(
        collateralAddr || mainToken.address,
        JSON.stringify(mainToken.abi),
        this.signer
      );

      let mainTokenBalance = await mainTokenInstance.balanceOf(this.account);

      mainTokenBalance = this.$ethers.utils.formatUnits(
        mainTokenBalance.toString(),
        mainToken.decimals
      );

      const depositTokenInstance = new this.$ethers.Contract(
        depositToken.address,
        JSON.stringify(depositToken.abi),
        this.signer
      );

      let depositTokenBalance = await depositTokenInstance.balanceOf(
        this.account,
      );

      depositTokenBalance = this.$ethers.utils.formatUnits(
        depositTokenBalance.toString(),
        depositToken.decimals
      );

      const tokensRate = 1;

      const isTokenDepositApprowed = await this.isTokenApprowed(
        depositTokenInstance,
        this.account,
        mainToken.address
      );

      const stakeObject = {
        tokensRate,
        mainToken: {
          ...mainToken,
          contractInstance: mainTokenInstance,
          balance: mainTokenBalance,
        },
        depositToken: {
          ...depositToken,
          contractInstance: depositTokenInstance,
          balance: depositTokenBalance,
          isTokenApprowed: isTokenDepositApprowed,
        },
      };

      return stakeObject;
    },

    async isTokenApprowed(tokenContract, userAddr, approveAddr) {
      try {
        const addressApprowed = await tokenContract.allowance(
          userAddr,
          approveAddr
        );

        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("OLIMPUS STAKE isApprowed err:", e);
        return false;
      }
    },
  },
};
