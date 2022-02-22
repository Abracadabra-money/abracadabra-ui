import bridgeConfig from "@/utils/bridge/bridgeConfig";
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

      if (!mimInfo) {
        console.log("no mimInfo");
        return false;
      }

      const bridgeInfo = bridgeConfig.find(
        (item) => item.chainId === this.chainId
      );

      if (!bridgeInfo) {
        console.log("no bridgeInfo");
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

      const bridgeObject = {
        contractInstance,
        methodName: bridgeInfo.methodName,
        balance,
        isTokenApprove,
        tokenContractInstance,
        chainsInfo: bridgeInfo.chainsInfo,
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
      console.log(tokenContract, spenderAddress);
      try {
        const estimateGas = await tokenContract.estimateGas.approve(
          spenderAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = 1000 + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

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
  },
};
