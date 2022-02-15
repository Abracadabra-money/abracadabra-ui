<template>
  <div class="bridge-view">
    <div class="bridge" v-if="bridgeObject">
      <h3 class="title">Bridge</h3>
      <SelectChainsWrap
        @handlerNetwork="openNetworkPopup"
        @switchHandle="switchChain"
        :fromChain="activeFrom"
        :toChain="activeTo"
      />
      <div class="input-wrap">
        <div class="header-balance">
          <h4>Collateral assets</h4>
          <p>Balance: 2000.00</p>
        </div>
        <ValueInput
          :max="bridgeObject.balance"
          :value="amount"
          :name="'MIM'"
          :icon="mimIcon"
          :error="amountError"
          @input="updateMainValue"
        />
      </div>

      <div class="info" v-if="expectedMim">
        <p class="info-title">Expected MIM</p>
        <p class="info-value">{{ expectedMim }}</p>
      </div>

      <div class="btn-wrap">
        <DefaultButton
          :primary="true"
          :disabled="disableBtn"
          @click="actionHandler"
          >{{ actionBtnText }}</DefaultButton
        >
      </div>

      <div class="info" v-for="(info, inx) in chainInfo" :key="inx">
        <p class="info-title">
          <img class="info-icon" src="@/assets/images/info.svg" alt="Icon" />
          {{ info.title }}
        </p>
        <p class="info-value">{{ info.value }}</p>
      </div>

      <div class="link-wrap">
        <a class="link" href="https://app.multichain.org/" target="_blank"
          >Powered by Anyswap</a
        >
      </div>
    </div>
    <NetworkPopup
      :isOpen="isOpenNetworkPopup"
      @closePopup="closeNetworkPopup"
      @enterChain="changeChain"
      :networksArr="popupNetworksArr"
      :activeChain="activeChainPopup"
      :popupType="popupType"
    />
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UIComponents/ValueInput");
const DefaultButton = () => import("@/components/main/DefaultButton");
const SelectChainsWrap = () => import("@/components/Bridge/SelectChainsWrap");
const NetworkPopup = () => import("@/components/Bridge/NetworkPopup");
import bridgeMixin from "@/mixins/bridge";
import chainSwitch from "@/mixins/chainSwitch";
import { mapGetters } from "vuex";
export default {
  mixins: [bridgeMixin, chainSwitch],
  data() {
    return {
      isOpenNetworkPopup: false,
      popupType: null,
      toChainId: null,
      fromChainId: null,
      amount: "",
      amountError: "",
    };
  },

  computed: {
    ...mapGetters({
      bridgeObject: "getBridgeObject",
      activeChain: "getChainId",
      address: "getAccount",
    }),

    mimIcon() {
      return require("@/assets/images/tokens-icon/MIM.svg");
    },

    popupNetworksArr() {
      if (this.popupType === "from") {
        return this.bridgeObject?.fromChains;
      } else {
        return this.bridgeObject?.toChains;
      }
    },

    activeChainPopup() {
      if (this.popupType === "from") {
        return this.activeFrom;
      } else {
        return this.activeTo;
      }
    },

    targetFromChain() {
      if (this.fromChainId) return this.fromChainId;

      return this.activeChain;
    },

    activeFrom() {
      return this.bridgeObject?.fromChains.find(
        (chain) => chain.chainId === this.targetFromChain
      );
    },

    targetToChain() {
      if (this.toChainId) return this.toChainId;

      return this.bridgeObject.chainsInfo[0].chainId;
    },

    activeTo() {
      return this.bridgeObject?.toChains.find(
        (chain) => chain.chainId === this.targetToChain
      );
    },

    actionBtnText() {
      if (!this.bridgeObject.isTokenApprove && this.chainId === 1)
        return "Approve";

      return "Bridge";
    },

    expectedMim() {
      if (!+this.amount) return "0.0000";
      if (this.amountError) return "0.0000";

      const feeAmount = this.targetChainInfo.feeAmount;

      return `~${parseFloat(+this.amount - feeAmount).toFixed(4)}`;
    },

    disableBtn() {
      // if (!this.bridgeObject.isTokenApprove && this.chainId === 1) return false;
      // if (+this.amount === 0) return true;

      // return !!this.amountError;
      return false;
    },

    targetChainInfo() {
      return this.bridgeObject?.chainsInfo.find(
        (item) => +item.chainId === this.targetToChain
      );
    },

    chainInfo() {
      return [
        {
          title: "Maximum Bridgeable Amount",
          value: `${this.targetChainInfo.maxAmount} MIM`,
          additional:
            "Maximum amount that can be sent in one single transaction.",
        },
        {
          title: "Minimum Bridgeable Amount",
          value: `${this.targetChainInfo.minAmount} MIM`,
          additional: "Mininum Amount required to bridge tokens.",
        },
        {
          title: "Minimum Bridging Fee",
          value: `${this.targetChainInfo.feeAmount} MIM`,
          additional: "Mimimum Fee required to bridge tokens.",
        },
      ];
    },
  },

  methods: {
    openNetworkPopup(type) {
      this.popupType = type;
      this.isOpenNetworkPopup = !this.isOpenNetworkPopup;
    },

    closeNetworkPopup() {
      this.isOpenNetworkPopup = false;
    },

    changeChain(chainId, type) {
      if (type === "to") {
        this.toChainId = chainId;
      } else {
        this.switchNetwork(chainId);
        this.fromChainId = chainId;
      }
    },

    switchChain() {
      this.switchNetwork(this.activeTo.chainId);
    },
    // ----------------------------------

    updateMainValue(value) {
      if (Number(value) > Number(this.bridgeObject.balance)) {
        this.amountError = `The value cannot be greater than ${this.bridgeObject.balance}`;
        return false;
      }

      if (Number(value) > Number(this.targetChainInfo.maxAmount)) {
        this.amountError = `The value cannot be greater than ${this.targetChainInfo.maxAmount}`;
        return false;
      }

      if (
        Number(value) &&
        Number(value) < Number(this.targetChainInfo.minAmount)
      ) {
        this.amountError = `Minimum bridge requirement not met`;
        return false;
      }

      this.amountError = "";
      this.amount = value;
    },

    async actionHandler() {
      // if (!this.bridgeObject.isTokenApprove && this.chainId === 1) {
      //   await this.approveToken(
      //     this.bridgeObject.tokenContractInstance,
      //     this.bridgeObject.contractInstance.address
      //   );

      //   return false;
      // }

      await this.bridge();
    },

    async bridge() {
      try {
        let re = new RegExp(
          // eslint-disable-next-line no-useless-escape
          `^-?\\d+(?:\.\\d{0,` + (18 || -1) + `})?`
        );
        const parsedAmount = this.amount.toString().match(re)[0];

        const amount = this.$ethers.utils.parseUnits(parsedAmount, 18);

        const toChainId = this.$ethers.BigNumber.from(this.targetToChain);

        const contract = this.bridgeObject.contractInstance;

        const methodName = this.bridgeObject.methodName;

        const tokenAddr = this.targetChainInfo.tokenAddr;

        console.log("111111", tokenAddr);
        console.log("222222", this.address);
        console.log("333333", amount);
        console.log("444444", toChainId);
        console.log("555555", methodName);
        console.log("666666", contract);

        const estimateGas = await contract.estimateGas[methodName](
          tokenAddr,
          this.address,
          amount,
          toChainId
        );

        console.log("!!!!!!!!!!!!!!!!", estimateGas);

        const gasLimit = 1000 + +estimateGas.toString();

        this.amount = "";

        const result = await contract[methodName](
          tokenAddr,
          this.address,
          amount,
          toChainId,
          {
            value: 0,
            gasLimit,
          }
        );

        console.log(result);

        console.log("gasLimit:", gasLimit);
      } catch (e) {
        console.log("SWAP ERR:", e);
      }
    },
    // ----------------------------------
  },

  async created() {
    if (!this.address) {
      // const notification = {
      //   msg: "Connect wallet first",
      // };

      alert("Connect wallet first");

      // this.$store.commit("addNotification", notification);
      //   this.$router.push({ name: "Home" });
      return false;
    }

    const acceptedNetworks = [43114, 1, 250, 56, 42161, 137];

    if (acceptedNetworks.indexOf(this.chainId) === -1) {
      // const notification = {
      //   msg: "The bridge is not available on this network",
      // };

      alert("The bridge is not available on this network");

      // this.$store.commit("addNotification", notification);
      // this.$router.push({ name: "Home" });
      return false;
    }

    await this.createBridgeConfig();
  },

  components: {
    ValueInput,
    DefaultButton,
    SelectChainsWrap,
    NetworkPopup,
  },
};
</script>

<style lang="scss" scoped>
.bridge-view {
  padding-top: 100px;
}

.bridge {
  background: #2a2835;
  backdrop-filter: blur(100px);
  border-radius: 30px;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 65px 20px;
}

.title {
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  text-align: center;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  margin-bottom: 40px;
}

.input-wrap {
  margin-bottom: 30px;
}

.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 50px;
}

.info-title {
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
}

.info-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.btn-wrap {
  margin: 30px 0;
}

.link-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.link {
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  color: #fff;
}

.link:hover {
  background: -webkit-linear-gradient(#5282fd, #76c3f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
