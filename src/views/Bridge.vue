<template>
  <div class="bridge-view">
    <div class="bridge" v-if="bridgeObject">
      <h3 class="title">Network to bridge</h3>
      <SelectChainsWrap
        @handlerNetwork="openNetworkPopup"
        @switchHandle="switchChain"
        :fromChain="activeFrom"
        :toChain="activeTo"
      />
      <div class="input-wrap">
        <div class="input-balance">
          <p class="input-title">Token to bridge</p>
          <div class="balance">
            <span>Balance: </span>
            <span>{{ mimBalance | formatTokenBalance }}</span>
          </div>
        </div>
        <BaseTokenInput
          :max="bridgeObject.balance"
          :value="amount"
          :name="'MIM'"
          :icon="mimIcon"
          :error="amountError"
          @input="updateMainValue"
        />
      </div>

      <div class="expected">
        <p class="expected-title">Expected MIM</p>
        <p class="expected-value">{{ expectedMim | formatTokenBalance }}</p>
      </div>

      <div class="info">
        <div class="info-row underline">
          <p class="info-text">Estimated Time of Crosschain Arrival:</p>
          <p class="info-text">10-30 min</p>
        </div>
        <div class="info-row">
          <p class="info-text">
            Crosschain amounts larger than 1,000,000 MIM estimated arrival:
          </p>
          <p class="info-text">up to 12 hours</p>
        </div>
      </div>

      <div class="btn-wrap">
        <BaseButton
          :primary="true"
          :disabled="disableBtn"
          @click="actionHandler"
          >{{ actionBtnText }}</BaseButton
        >
      </div>

      <div class="expected" v-for="(info, inx) in chainInfo" :key="inx">
        <p class="expected-title">
          <img
            class="expected-icon"
            src="@/assets/images/info.svg"
            alt="Icon"
            v-tooltip="info.additional"
          />
          {{ info.title }}
        </p>
        <p class="expected-value">{{ info.value }}</p>
      </div>

      <div class="link-wrap">
        <a href="https://app.multichain.org/" target="_blank"
          >Powered By Multichain</a
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
const BaseTokenInput = () => import("@/components/base/BaseTokenInput");
const BaseButton = () => import("@/components/base/BaseButton");
const SelectChainsWrap = () => import("@/components/bridge/SelectChainsWrap");
const NetworkPopup = () => import("@/components/popups/NetworkPopup");
import bridgeMixin from "@/mixins/bridge";
import chainSwitch from "@/mixins/chainSwitch";
import notification from "@/utils/notification/index.js";

import { mapGetters } from "vuex";
export default {
  mixins: [bridgeMixin, chainSwitch],
  data() {
    return {
      isOpenNetworkPopup: false,
      popupType: null,
      toChainId: null,
      fromChainId: null,
      updateInterval: null,
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
      return require("@/assets/images/tokens/MIM.png");
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

      return +this.amount - feeAmount;
    },

    mimBalance() {
      if (this.bridgeObject?.balance) return this.bridgeObject.balance;

      return 0;
    },

    disableBtn() {
      if (this.bridgeObject.isDefaultProvider) return true;
      if (!this.bridgeObject.isTokenApprove && this.chainId === 1) return false;
      if (+this.amount === 0) return true;

      return !!this.amountError;
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
      if (this.address) this.switchNetwork(this.activeTo.chainId);
      else this.switchNetworkWithoutConnect(this.activeTo.chainId);
    },

    updateMainValue(value) {
      if (isNaN(+value)) {
        this.amountError = `The value cannot be greater than ${this.bridgeObject.balance}`;
        return false;
      }

      if (+value > +this.bridgeObject.balance) {
        this.amountError = `The value cannot be greater than ${this.bridgeObject.balance}`;
        return false;
      }

      if (+value > +this.targetChainInfo.maxAmount) {
        this.amountError = `The value cannot be greater than ${this.targetChainInfo.maxAmount}`;
        return false;
      }

      if (+value && +value < +this.targetChainInfo.minAmount) {
        this.amountError = `Minimum bridge requirement not met`;
        return false;
      }

      this.amountError = "";
      this.amount = value;
    },

    async actionHandler() {
      if (!this.bridgeObject.isTokenApprove && this.chainId === 1) {
        const notificationId = await this.$store.dispatch(
          "notifications/new",
          notification.approve.pending
        );

        let approve = await this.approveToken(
          this.bridgeObject.tokenContractInstance,
          this.bridgeObject.contractInstance.address
        );

        if (approve) {
          await this.$store.commit("notifications/delete", notificationId);
        } else {
          await this.$store.commit("notifications/delete", notificationId);
          await this.$store.dispatch(
            "notifications/new",
            notification.approve.error
          );
        }

        return false;
      }

      await this.bridge();
    },

    async bridge() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.transaction.pending
      );
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

        const estimateGas = await contract.estimateGas[methodName](
          tokenAddr,
          this.address,
          amount,
          toChainId
        );

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

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch(
          "notifications/new",
          notification.transaction.success
        );
      } catch (e) {
        console.log("SWAP ERR:", e);
        let msg;

        if (e.code === 4001) {
          msg = notification.userDenied;
        } else {
          msg = notification.transaction.error;
        }

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", msg);
      }
    },
  },

  async created() {
    const acceptedNetworks = [43114, 1, 250, 56, 42161, 137];

    if (acceptedNetworks.indexOf(this.chainId) === -1) {
      await this.$store.dispatch(
        "notifications/new",
        notification.bridgeNotAvailable
      );

      // this.$router.push({ name: "Home" });
      return false;
    }

    await this.createBridgeConfig();

    this.updateInterval = setInterval(async () => {
      await this.createBridgeConfig();
    }, 15000);
  },

  beforeDestroy() {
    clearInterval(this.updateInterval);
  },

  components: {
    BaseTokenInput,
    BaseButton,
    SelectChainsWrap,
    NetworkPopup,
  },
};
</script>

<style lang="scss" scoped>
.bridge-view {
  max-width: calc(100% - 20px);
  padding: 100px 0;
  margin: 0 auto;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.bridge {
  background: #2a2835;
  backdrop-filter: blur(100px);
  border-radius: 30px;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 65px;
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
  margin-bottom: 20px;
}

.input-balance {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;

  .balance {
    font-size: 14px;
  }
}

.input-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
}

.expected {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 50px;
}

.expected-title {
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
}

.expected-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.info {
  width: 100%;
  padding: 12px 10px 7px;
  background: rgba(255, 255, 255, 0.04);
  box-shadow: 0 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(100px);
  border-radius: 20px;
  margin-top: 30px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  font-size: 14px;
  line-height: 21px;
  color: rgba(255, 255, 255, 0.6);
  padding-bottom: 5px;
}

.info-row:not(:last-child) {
  margin-bottom: 10px;
}

.info-text:nth-child(odd) {
  max-width: 320px;
  width: 100%;
}

.btn-wrap {
  margin: 30px 0;
}

.link-wrap {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.link-wrap a {
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  text-transform: uppercase;
  color: #fff;
}

.link-wrap a:hover {
  background: -webkit-linear-gradient(#5282fd, #76c3f5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (max-width: 600px) {
  .bridge {
    padding: 30px 15px;
  }

  .title {
    margin-bottom: 12px;
  }

  .balance {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .expected {
    display: flex;
    flex-direction: column;
    align-items: initial;
    justify-content: initial;
  }

  .expected-value {
    text-align: right;
  }

  .info-row {
    align-items: center;
  }

  .info-text:nth-child(odd) {
    max-width: 70%;
  }
}

@media (max-width: 375px) {
  .info-text:nth-child(odd) {
    max-width: 160px;
  }
}
</style>
