import stakeConf from "@/utils/collateralConfig/ohm-swap/stakeConf";
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
    async createOlimpusStake() {
      if (!stakeConf) {
        return false;
      }

      if (this.chainId !== 1) return false;

      const { mainToken, stakeToken } = stakeConf;

      const stakeContractInstance = new this.$ethers.Contract(
        stakeConf.stakeContract.address,
        JSON.stringify(stakeConf.stakeContract.abi),
        this.signer
      );

      const unstakeContractInstance = new this.$ethers.Contract(
        stakeConf.unstakeContract.address,
        JSON.stringify(stakeConf.unstakeContract.abi),
        this.signer
      );

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

      const tokensRate = 1;

      const isTokenStakeApprowed = await this.isTokenApprowed(
        stakeTokenInstance,
        this.account,
        stakeConf.stakeContract.address
      );

      const isTokenUnstakeApprowed = await this.isTokenApprowed(
        mainTokenInstance,
        this.account,
        stakeConf.unstakeContract.address
      );

      const stakeObject = {
        tokensRate,
        stakeContractInstance,
        unstakeContractInstance,
        mainToken: {
          ...mainToken,
          contractInstance: mainTokenInstance,
          balance: mainTokenBalance,
          isTokenApprowed: isTokenUnstakeApprowed,
        },
        stakeToken: {
          ...stakeToken,
          contractInstance: stakeTokenInstance,
          balance: stakeTokenBalance,
          isTokenApprowed: isTokenStakeApprowed,
        },
      };

      return stakeObject;
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
        console.log("OLIMPUS STAKE isApprowed err:", e);
        return false;
      }
    },
  },
};
