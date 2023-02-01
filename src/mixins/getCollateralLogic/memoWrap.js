import wrapConfig from "@/utils/collateralConfig/memoWrap/wrapConfig";
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
    async createMEMOWrapObj() {
      if (!wrapConfig) {
        return false;
      }

      if (this.chainId !== 43114) return false;

      const { mainToken, depositToken } = wrapConfig;

      const mainTokenInstance = new this.$ethers.Contract(
        mainToken.address,
        JSON.stringify(mainToken.abi),
        this.signer
      );

      let mainTokenBalance = await mainTokenInstance.balanceOf(this.account, {
        gasLimit: 100000000,
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
          gasLimit: 100000000,
        }
      );

      depositTokenBalance = this.$ethers.utils.formatUnits(
        depositTokenBalance.toString(),
        depositToken.decimals
      );

      const tokensRate = await this.getTokenRates(
        mainTokenInstance,
        mainToken.decimals
      );

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
    async getTokenRates(mainTokenInstance) {
      let stakeToMain;
      try {
        const MEMOTowMEMO = await mainTokenInstance.MEMOTowMEMO("1000000000");

        const MEMOTowMEMOParsed = this.$ethers.utils.formatUnits(
          MEMOTowMEMO,
          18
        );

        stakeToMain = MEMOTowMEMOParsed;

        return stakeToMain;
      } catch (e) {
        console.log("rate errro:", e);
      }
    },
  },
};
