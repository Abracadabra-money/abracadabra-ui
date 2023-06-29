import { markRaw } from "vue";
import bridgeConfig from "@/utils/bridge/bridgeConfig";
import chainConfig from "@/utils/bridge/chainConfig";
import mimToken from "@/utils/contracts/mimToken";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      userSigner: "getSigner",
      defaultProvider: "getProvider",
    }),

    contractProvider() {
      return this.userSigner ? this.userSigner : this.defaultProvider;
    },
  },
  methods: {
    async createBridgeConfig() {
      const mimInfo = mimToken.find((item) => item.chainId === this.chainId);
      if (!mimInfo) return false;

      const bridgeInfo = bridgeConfig.find(
        (item) => item.chainId === this.chainId
      );
      if (!bridgeInfo) return false;

      const contractInstance = new this.$ethers.Contract(
        bridgeInfo.contract.address,
        JSON.stringify(bridgeInfo.contract.abi),
        this.contractProvider
      );

      const tokenContractInstance = new this.$ethers.Contract(
        mimInfo.address,
        JSON.stringify(mimInfo.abi),
        this.contractProvider
      );

      const fromChains = bridgeConfig.map((configItem) => {
        return {
          chainId: configItem.chainId,
          title: configItem.chainName,
          icon: configItem.chainIcon,
        };
      });

      const chainsInfo = chainConfig.filter(
        (chain) => chain.chainId !== this.chainId
      );

      const toChains = chainsInfo.map((chainItem) => {
        return {
          chainId: chainItem.chainId,
          title: chainItem.name,
          icon: chainItem.icon,
        };
      });

      const { balance, isTokenApprove, isDefaultProvider, nativeTokenBalance } =
        await this.getUserInfo(
          tokenContractInstance,
          bridgeInfo.contract.address
        );

      const bridgeObject = {
        contractInstance,
        balance,
        nativeTokenBalance,
        isTokenApprove,
        tokenContractInstance,
        chainsInfo: chainsInfo,
        fromChains,
        toChains,
        isDefaultProvider,
      };

      this.$store.commit("setBridgeObject", markRaw(bridgeObject));
    },

    async getUserInfo(contract, address) {
      if (!this.userSigner)
        return {
          balance: "0.0",
          nativeTokenBalance: "0.0",
          isTokenApprove: false,
          isDefaultProvider: true,
        };

      return {
        balance: await this.getUserBalance(contract),
        nativeTokenBalance: await this.defaultProvider.getBalance(this.account),
        isTokenApprove: await this.isTokenApprowed(
          contract,
          this.account,
          address
        ),
        isDefaultProvider: false,
      };
    },

    async getUserBalance(tokenContract) {
      try {
        const userBalance = await tokenContract.balanceOf(this.account);

        return this.$ethers.utils.formatUnits(userBalance, 18);
      } catch (e) {
        console.log("userBalance Err:", e);
      }
    },
    async isTokenApprowed(tokenContract, userAddr, approveAddr) {
      try {
        const addressApprowed = await tokenContract.allowance(
          userAddr,
          approveAddr
        );

        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("SPELL isApprowed err:", e);
        return false;
      }
    },
    async approveToken(tokenContract, spenderAddress) {
      try {
        const estimateGas = await tokenContract.estimateGas.approve(
          spenderAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await tokenContract.approve(
          spenderAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();

        console.log("APPROVE RESP:", receipt);

        return true;
      } catch (e) {
        console.log("approveToken err:", e);
        return false;
      }
    },

    // async getBridgeProps(bridgeInfo) {
    //   const response = await axios.get(
    //     `https://bridgeapi.anyswap.exchange/v3/serverinfoV3?chainId=${this.chainId}&version=STABLEV3`
    //   );

    //   let chainsData = null;

    //   for (let prop in response.data) {
    //     if (response.data[prop].tokenid === "MIM") {
    //       chainsData = response.data[prop].destChains;
    //     }
    //   }

    //   const result = [];

    //   bridgeInfo.chainsInfo.forEach((item) => {
    //     if (chainsData[item.chainId]) {
    //       let chainData = chainsData[item.chainId];

    //       result.push({
    //         ...item,
    //         fee: 0,
    //         feeAmount: chainData.MinimumSwapFee,
    //         feeAmountMax: chainData.MaximumSwapFee,
    //         minAmount: chainData.MinimumSwap,
    //         maxAmount: chainData.MaximumSwap,
    //         amountLarger: chainData.BigValueThreshold,
    //       });
    //     }
    //   });

    //   return result;
    // },
  },
};
