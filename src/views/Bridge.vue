<template>
  <div class="bridge-view">
    <div class="bridge" v-if="bridgeObject">
      <h3 class="title">
        Bridge
        <div class="wallet-btn" :class="{ active: isShowInputAddress }">
          <img
            class="wallet-icon"
            @click="toggleInputAddress"
            src="@/assets/images/wallet-icon.png"
            alt="Wallet icon"
          />
        </div>
        <div class="settings-btn" :class="{ active: isSettingsOpened }">
          <img
            class="settings-icon"
            @click="isSettingsOpened = true"
            src="@/assets/images/settings.png"
            alt="Settings icon"
          />
        </div>
      </h3>
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
            <span>{{ formatTokenBalance(mimBalance) }}</span>
          </div>
        </div>

        <BaseTokenInput
          :max="bridgeObject.balance"
          :value="amount"
          :name="'MIM'"
          :icon="$image('assets/images/tokens/MIM.png')"
          :error="amountError"
          @updateValue="updateMainValue"
        />
      </div>

      <div class="input-address-wrap">
        <input
          class="input-address"
          :class="{ error: inputAddressError }"
          v-model="inputAddressValue"
          v-if="isShowInputAddress"
          type="text"
          placeholder="Add destination address"
        />
        <p class="error-message">
          <span v-if="inputAddressError">Invalid address</span>
          <span v-else>&nbsp;</span>
        </p>
      </div>

      <div class="expected">
        <p class="expected-title">Expected MIM</p>
        <p class="expected-value">{{ formatTokenBalance(expectedMim) }}</p>
      </div>

      <div class="info">
        <div class="info-row underline">
          <p class="info-text">Estimated Time of Crosschain Arrival:</p>
          <p class="info-text">10-30 min</p>
        </div>
        <div class="info-row">
          <p class="info-text">
            Crosschain amounts larger than
            {{ formatNumber(targetChainInfo.amountLarger) }} MIM estimated
            arrival:
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
    <LocalPopupWrap
      :isOpened="isSettingsOpened"
      @closePopup="isSettingsOpened = false"
    >
      <SettingsPopup
        :value="''"
        :max="10"
        :config="settingConfig"
        @changeSettings="changeSettings"
    /></LocalPopupWrap>

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
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import SelectChainsWrap from "@/components/bridge/SelectChainsWrap.vue";
import NetworkPopup from "@/components/popups/NetworkPopup.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";
import SettingsPopup from "@/components/popups/SettingsPopup.vue";
import filters from "@/filters/index.js";
import bridgeMixin from "@/mixins/bridge";
import chainSwitch from "@/mixins/chainSwitch";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";

import { mapGetters } from "vuex";
export default {
  mixins: [bridgeMixin, chainSwitch],
  data() {
    return {
      isOpenNetworkPopup: false,
      isShowInputAddress: false,
      inputAddressValue: null,
      popupType: null,
      toChainId: null,
      fromChainId: null,
      updateInterval: null,
      amount: "",
      acceptedNetworks: [43114, 1, 250, 56, 42161, 137],
      isSettingsOpened: false,
      gas: 0,
      settingConfig: {
        title: "Advanced settings",
        subtitle: "Gas on destination chain",
        tooltipText:
          "The default amount allows you to perform a couple of transactions (e.g. Approve + Swap). Once you approve the transfer in your wallet, the transaction gas amount will be higher than a regular transaction as this includes the selected amount of destination gas to be sent.",
        linkText: "Learn more",
        text: "about MIM being an Omnichain Fungible Tokens",
      },
    };
  },

  computed: {
    ...mapGetters({
      bridgeObject: "getBridgeObject",
      activeChain: "getChainId",
      address: "getAccount",
    }),

    toAddressBytes() {
      const toAddress = this.inputAddressValue
        ? this.inputAddressValue
        : this.address;

      return this.$ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [toAddress]
      );
    },

    isAcceptedNetworks() {
      return this.acceptedNetworks.indexOf(this.chainId) === -1;
    },

    amountError() {
      if (+this.amount > +this.bridgeObject.balance) {
        return `The value cannot be greater than ${this.bridgeObject.balance}`;
      }

      if (+this.amount > +this.targetChainInfo.maxAmount) {
        return `The value cannot be greater than ${this.targetChainInfo.maxAmount}`;
      }

      if (+this.amount && +this.amount < +this.targetChainInfo.minAmount) {
        return `Minimum bridge requirement not met`;
      }

      return "";
    },

    popupNetworksArr() {
      if (this.popupType === "from") {
        return this.bridgeObject?.fromChains;
      } else {
        return this.bridgeObject?.toChains;
      }
    },

    activeChainPopup() {
      if (this.popupType === "from" && this.activeFrom) {
        return this.activeFrom.chainId;
      } else if (this.activeTo) {
        return this.activeTo.chainId;
      }

      return 1;
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
      if (!this.inputAddressValue && this.isShowInputAddress)
        return "Set destination address";

      if (this.inputAddressError) return "Set destination address";

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
      if (!this.inputAddressValue && this.isShowInputAddress) return true;
      if (this.inputAddressError) return true;
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
          value: `${filters.formatNumber(this.targetChainInfo.maxAmount)} MIM`,
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

    checkInputAddress() {
      return this.inputAddressValue
        ? this.$ethers.utils.isAddress(this.inputAddressValue.toLowerCase())
        : false;
    },

    inputAddressError() {
      if (!this.inputAddressValue) return false;
      return this.isShowInputAddress && !this.checkInputAddress;
    },
  },

  watch: {
    async chainId() {
      if (this.isAcceptedNetworks) await this.bridgeNotAvailable();
      else await this.createBridgeData();
    },
  },

  methods: {
    toggleInputAddress() {
      this.isShowInputAddress = !this.isShowInputAddress;
    },

    formatNumber(value) {
      return filters.formatNumber(value);
    },

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

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
      this.amount = value;
    },

    async actionHandler() {
      if (this.disableBtn) return false;
      if (!this.bridgeObject.isTokenApprove && this.chainId === 1) {
        const notificationId = await this.$store.dispatch(
          "notifications/new",
          notification.approvePending
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
            notification.approveError
          );
        }

        return false;
      }

      await this.bridge();
    },

    async bridge() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      try {
        const parsedAmount = filters.formatToFixed(this.amount, 18);
        const amount = this.$ethers.utils.parseUnits(parsedAmount, 18);

        const fees = await this.getFees(amount);

        console.log(
          `fees[0] (wei): ${fees[0]} / (eth): ${this.$ethers.utils.formatEther(
            fees[0]
          )}`
        );

        let tx = await (
          await this.bridgeObject.contractInstance.sendFrom(
            this.address, // 'from' address to send tokens
            this.$ethers.BigNumber.from(this.targetToChain), // remote LayerZero chainId
            this.toAddressBytes, // 'to' address to send tokens
            amount, // amount of tokens to send (in wei)
            [this.address, this.$ethers.constants.AddressZero, "0x"], // flexible bytes array to indicate messaging adapter services
            { value: fees[0] }
          )
        ).wait();

        console.log(
          `✅ Sent. https://layerzeroscan.com/tx/${tx.transactionHash}`
        );
      } catch (error) {
        console.log("Bridge Error:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async getFees(amount) {
      // quote fee with default adapterParams
      const adapterParams = this.$ethers.utils.solidityPack(
        ["uint16", "uint256"],
        [1, 200_000]
      ); // default adapterParams example

      return await this.bridgeObject.contractInstance.estimateSendFee(
        this.$ethers.BigNumber.from(this.targetToChain),
        this.toAddressBytes,
        amount,
        false,
        adapterParams
      );
    },

    async bridgeNotAvailable() {
      return await this.$store.dispatch(
        "notifications/new",
        notification.bridgeNotAvailable
      );
    },

    async createBridgeData() {
      await this.createBridgeConfig();

      this.updateInterval = setInterval(async () => {
        await this.createBridgeConfig();
      }, 15000);
    },

    changeSettings(value) {
      if (!value) this.gas = 0;
      else this.gas = value;
      this.isSettingsOpened = false;
    },
  },

  async created() {
    if (!this.chainId) return false;
    if (this.isAcceptedNetworks) await this.bridgeNotAvailable();
    else await this.createBridgeData();
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    BaseTokenInput,
    BaseButton,
    SelectChainsWrap,
    NetworkPopup,
    LocalPopupWrap,
    SettingsPopup,
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
  position: relative;
}

.wallet-btn,
.settings-btn {
  position: absolute;
  cursor: pointer;
  top: 50%;
  transform: translateY(-55%);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.active {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.wallet-btn {
  right: 48px;
}

.settings-btn {
  right: 0;
}

.wallet-icon {
  width: 24px;
  height: 24px;
}
.settings-icon {
  width: 20px;
  height: 20px;
}

.input-wrap {
  margin-bottom: 20px;
}

.input-address-wrap {
  margin-bottom: 30px;
}

.input-address {
  width: 100%;
  height: 50px;
  background: rgba(129, 126, 166, 0.2);
  border: 1px solid #494661;
  border-radius: 12px;
  outline: none;
  padding: 12px 20px;
  color: #fff;
}

.error {
  border-color: #e54369;
}

.error-message {
  color: $clrError;
  font-size: 10px;
  margin-top: 5px;
  margin-left: 10px;
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
  cursor: pointer;
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
