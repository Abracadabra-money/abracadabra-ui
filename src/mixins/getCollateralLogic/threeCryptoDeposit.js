import depositConf from "@/utils/collateralConfig/crv3crypto/depositConfig";
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
    async createCrvDeposit() {
      if (!depositConf) {
        return false;
      }

      if (this.chainId !== 1) return false;

      const { mainToken, depositToken, stakeToken } = depositConf;

      const mainTokenInstance = new this.$ethers.Contract(
        mainToken.address,
        JSON.stringify(mainToken.abi),
        this.signer
      );

      let mainTokenBalance = await mainTokenInstance.balanceOf(this.account, {
        gasLimit: 1000000,
      });

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
        {
          gasLimit: 1000000,
        }
      );

      depositTokenBalance = this.$ethers.utils.formatUnits(
        depositTokenBalance.toString(),
        depositToken.decimals
      );

      const stakeTokenInstance = new this.$ethers.Contract(
        stakeToken.address,
        JSON.stringify(stakeToken.abi),
        this.signer
      );

      let stakeTokenBalance = await stakeTokenInstance.balanceOf(this.account, {
        gasLimit: 1000000,
      });

      stakeTokenBalance = this.$ethers.utils.formatUnits(
        stakeTokenBalance.toString(),
        stakeToken.decimals
      );

      const tokensRate = 1;

      const isTokenDepositApprowed = await this.isTokenApprowed(
        depositTokenInstance,
        this.account,
        mainToken.address
      );

      const isTokenStakeApprowed = await this.isTokenApprowed(
        stakeTokenInstance,
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
        stakeToken: {
          ...stakeToken,
          contractInstance: stakeTokenInstance,
          balance: stakeTokenBalance,
          isTokenApprowed: isTokenStakeApprowed,
        },
      };

      console.log("DEPOSIT CRV:", stakeObject);

      return stakeObject;
    },

    async isTokenApprowed(tokenContract, userAddr, approveAddr) {
      try {
        const addressApprowed = await tokenContract.allowance(
          userAddr,
          approveAddr,
          {
            gasLimit: 1000000,
          }
        );

        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
    },
  },
};
