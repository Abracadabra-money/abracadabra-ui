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
        :fromChain="originChain"
        :toChain="destinationChain"
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
        <p class="expected-title">Estimate Send Fee:</p>
        <p class="expected-value">
          {{ formatEstimateSendFee }}
        </p>
      </div>
      <!-- <div class="expected">
        <p class="expected-title">Expected MIM</p>
        <p class="expected-value">{{ formatTokenBalance(expectedMim) }}</p>
      </div> -->

      <!-- <div class="info">
        <div class="info-row underline">
          <p class="info-text">Estimated Time of Crosschain Arrival:</p>
          <p class="info-text">10-30 min</p>
        </div>
        <div class="info-row">
          <p class="info-text">
            Crosschain amounts larger than
            {{ formatNumber(targetChainInfo.amountLarger) }} MIM estimated
          </p>
          <p class="info-text">up to 12 hours</p>
        </div>
      </div> -->

      <div class="btn-wrap">
        <BaseButton
          :primary="true"
          :disabled="disableBtn"
          @click="actionHandler"
          >{{ actionBtnText }}</BaseButton
        >
      </div>

      <!-- <div class="expected" v-for="(info, inx) in chainInfo" :key="inx">
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
      </div> -->

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
      :activeChain="activePopupChain"
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
import chainSwitch from "@/mixins/chainSwitch";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
import { mapGetters } from "vuex";
import { createBridgeConfig } from "@/helpers/bridge";
export default {
  mixins: [chainSwitch],
  data() {
    return {
      acceptedNetworks: [1, 10, 56, 137, 250, 1285, 42161, 43114],
      popupType: null,
      bridgeObject: null,
      isOpenNetworkPopup: false,
      isShowInputAddress: false,
      inputAddressValue: null,
      toChainId: null,
      updateInterval: null,
      amount: "",
      isSettingsOpened: false,
      gas: 0,
      estimateSendFee: 0,
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
      account: "getAccount",
      provider: "getProvider",
      chainId: "getChainId",
    }),

    toAddress() {
      return this.inputAddressValue ? this.inputAddressValue : this.account;
    },

    toAddressBytes() {
      return this.$ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [this.toAddress]
      );
    },

    isAcceptedNetworks() {
      return this.acceptedNetworks.indexOf(this.chainId) === -1;
    },

    amountError() {
      if (+this.amount > +this.bridgeObject.balance) {
        return `The value cannot be greater than ${this.bridgeObject.balance}`;
      }
      return "";
    },

    popupNetworksArr() {
      if (this.popupType === "from") return this.bridgeObject?.fromChains;
      return this.bridgeObject?.toChains;
    },

    activePopupChain() {
      if (this.popupType === "from" && this.originChain) {
        return this.originChain.chainId;
      } else if (this.destinationChain) {
        return this.destinationChain.chainId;
      }

      return 1;
    },

    originChain() {
      return this.bridgeObject?.fromChains.find(
        (chain) => chain.chainId === this.chainId
      );
    },

    targetToChain() {
      if (this.toChainId) return this.toChainId;
      return this.bridgeObject.chainsInfo[0].chainId;
    },

    remoteLzChainId() {
      const lzChainId = this.bridgeObject.chainsInfo.find(
        (item) => item.chainId === this.targetToChain
      )?.lzChainId;

      return this.$ethers.BigNumber.from(lzChainId);
    },

    destinationChain() {
      return this.bridgeObject?.toChains.find(
        (chain) => chain.chainId === this.targetToChain
      );
    },

    isMainnetChain() {
      return this.chainId === 1;
    },

    actionBtnText() {
      if (!this.inputAddressValue && this.isShowInputAddress)
        return "Set destination address";

      if (this.inputAddressError) return "Set destination address";

      if (!this.bridgeObject.isTokenApprove && this.isMainnetChain)
        return "Approve";

      return "Bridge";
    },

    mimBalance() {
      return this.bridgeObject?.balance || 0;
    },

    disableBtn() {
      if (!this.account) return true;
      if (!this.inputAddressValue && this.isShowInputAddress) return true;
      if (this.inputAddressError) return true;
      if (!this.bridgeObject.isTokenApprove && this.isMainnetChain)
        return false;
      if (+this.amount === 0) return true;
      return !!this.amountError;
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

    formatEstimateSendFee() {
      if (!this.estimateSendFee[0]) return "0.0";
      return this.$ethers.utils.formatEther(this.estimateSendFee[0]);
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
        this.amount = "";
        this.estimateSendFee = 0;
        this.toChainId = chainId;
      } else {
        this.switchNetwork(chainId);
      }
    },

    switchChain() {
      if (this.account) this.switchNetwork(this.destinationChain.chainId);
      else this.switchNetworkWithoutConnect(this.destinationChain.chainId);
    },

    async updateMainValue(value) {
      this.amount = value;
      await this.getFees(value);
    },

    async actionHandler() {
      if (this.disableBtn) return false;
      if (!this.bridgeObject.isTokenApprove && this.isMainnetChain) {
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
        const fees = await this.getFees(this.amount);

        const tx = await this.bridgeObject.contractInstance.sendFrom(
          this.toAddress, // 'from' address to send tokens
          this.remoteLzChainId, // remote LayerZero chainId
          this.toAddressBytes, // 'to' address to send tokens
          amount, // amount of tokens to send (in wei)
          [this.toAddress, this.$ethers.constants.AddressZero, "0x"], // flexible bytes array to indicate messaging adapter services
          { value: fees[0] }
        );

        tx.wait();

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
      if (!+amount) return 0;
      const parseAmount = await this.$ethers.utils.parseUnits(amount, 18);

      const adapterParams = await this.$ethers.utils.solidityPack(
        ["uint16", "uint256"],
        [1, 200_000]
      );

      this.estimateSendFee =
        await this.bridgeObject.contractInstance.estimateSendFee(
          this.remoteLzChainId,
          this.toAddressBytes,
          parseAmount,
          false,
          adapterParams
        );

      return this.estimateSendFee;
    },

    async bridgeNotAvailable() {
      return await this.$store.dispatch(
        "notifications/new",
        notification.bridgeNotAvailable
      );
    },

    async createBridgeData() {
      this.bridgeObject = await createBridgeConfig(
        this.chainId,
        this.provider,
        this.account
      );

      this.updateInterval = setInterval(async () => {
        this.bridgeObject = await createBridgeConfig(
          this.chainId,
          this.provider,
          this.account
        );
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
