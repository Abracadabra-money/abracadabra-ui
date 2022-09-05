import bridgeConfig from "@/utils/bridge/bridgeConfig";
import mimToken from "@/utils/contracts/mimToken";
import { mapGetters } from "vuex";
import axios from "axios";

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

      if (!mimInfo) {
        return false;
      }

      const bridgeInfo = bridgeConfig.find(
        (item) => item.chainId === this.chainId
      );

      if (!bridgeInfo) {
        return false;
      }

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

      const toChains = bridgeInfo.chainsInfo.map((chainItem) => {
        return {
          chainId: chainItem.chainId,
          title: chainItem.name,
          icon: chainItem.icon,
        };
      });

      let balance, isTokenApprove, isDefaultProvider;

      if (this.userSigner) {
        balance = await this.getUserBalance(tokenContractInstance);

        isTokenApprove = await this.isTokenApprowed(
          tokenContractInstance,
          this.account,
          bridgeInfo.contract.address
        );

        isDefaultProvider = false;
      } else {
        balance = "Null";
        isTokenApprove = false;
        isDefaultProvider = true;
      }

      const chainsInfo = await this.getBridgeProps(bridgeInfo);

      const bridgeObject = {
        contractInstance,
        methodName: bridgeInfo.methodName,
        balance,
        isTokenApprove,
        tokenContractInstance,
        chainsInfo: chainsInfo,
        fromChains,
        toChains,
        isDefaultProvider,
      };

      this.$store.commit("setBridgeObject", bridgeObject);
    },
    async getUserBalance(tokenContract) {
      try {
        const userBalance = await tokenContract.balanceOf(this.account, {
          gasLimit: 600000,
        });

        return this.$ethers.utils.formatUnits(userBalance, 18);
      } catch (e) {
        console.log("userBalance Err:", e);
      }
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

    async getBridgeProps(bridgeInfo) {
      const response = await axios.get(
        `https://bridgeapi.anyswap.exchange/v3/serverinfoV3?chainId=${this.chainId}&version=STABLEV3`
      );

      let chainsData = null;

      for (let prop in response.data) {
        if (response.data[prop].tokenid === "MIM") {
          chainsData = response.data[prop].destChains;
        }
      }

      const result = [];

      bridgeInfo.chainsInfo.forEach((item) => {
        if (chainsData[item.chainId]) {
          let chainData = chainsData[item.chainId];

          result.push({
            ...item,
            fee: 0,
            feeAmount: chainData.MinimumSwapFee,
            feeAmountMax: chainData.MaximumSwapFee,
            minAmount: chainData.MinimumSwap,
            maxAmount: chainData.MaximumSwap,
            amountLarger: chainData.BigValueThreshold,
          });
        }
      });

      return result;
    },
  },
};
