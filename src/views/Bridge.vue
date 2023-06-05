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

      <div class="input-address-wrap" v-if="isShowInputAddress">
        <input
          class="input-address"
          :class="{ error: inputAddressError }"
          v-model="inputAddressValue"
          type="text"
          placeholder="Add destination address"
        />
        <p class="error-message">
          <span v-if="inputAddressError">Invalid address</span>
          <span v-else>&nbsp;</span>
        </p>
      </div>

      <div class="info">
        <div class="expected">
          <p class="expected-title">Expected MIM:</p>
          <p class="expected-value">{{ amount || "0.0" }} MIM</p>
        </div>
        <div class="expected">
          <p class="expected-title">Native token on destination:</p>
          <p class="expected-value">
            {{ this.gas || "0.0" }} {{ destinationTokenInfo.symbol }}
          </p>
        </div>
        <div class="expected">
          <p class="expected-title">Estimated gas cost:</p>
          <p class="expected-value">
            {{ formatEstimateSendFee }} {{ nativeTokenInfo.symbol }}
          </p>
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

      <p class="caption">Powered By LayerZero</p>
    </div>
    <LocalPopupWrap :isOpened="isSettingsOpened" @closePopup="closePopup">
      <SettingsPopup
        :value="gas"
        :max="destinationTokenMax"
        :config="settingConfig"
        @changeSettings="changeSettings"
        @closeSettings="closeSettings"
        @errorSettings="errorSettings"
    /></LocalPopupWrap>

    <LocalPopupWrap
      :isOpened="isSuccessPopup"
      @closePopup="isSuccessPopup = false"
    >
      <SuccessPopup :link="transactionLink" />
    </LocalPopupWrap>

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
import SettingsPopup from "@/components/bridge/SettingsPopup.vue";
import SuccessPopup from "@/components/bridge/SuccessPopup.vue";
import filters from "@/filters/index.js";
import chainSwitch from "@/mixins/chainSwitch";
import notification from "@/helpers/notification/notification.js";
import { mapGetters } from "vuex";
import { createBridgeConfig } from "@/helpers/bridge";
import { approveToken } from "@/utils/approveHelpers.js";
import { getTokenInfo } from "@/helpers/getTokenInfo";

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
      isSuccessPopup: false,
      gas: "",
      estimateSendFee: 0,
      transactionLink: "",
      isSettingsError: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      signer: "getSigner",
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
      return filters.formatToFixed(
        this.$ethers.utils.formatEther(this.estimateSendFee[0]),
        8
      );
    },

    nativeTokenInfo() {
      return getTokenInfo(this.chainId);
    },

    destinationTokenInfo() {
      return getTokenInfo(this.targetToChain);
    },

    settingConfig() {
      return {
        title: "Advanced settings",
        subtitle: "Gas on destination chain",
        tooltipText:
          "The default amount allows you to perform a couple of transactions (e.g. Approve + Swap). Once you approve the transfer in your wallet, the transaction gas amount will be higher than a regular transaction as this includes the selected amount of destination gas to be sent.",
        linkText: "Learn more",
        text: "about MIM being an Omnichain Fungible Tokens",
        icon: this.destinationTokenInfo.icon,
        nativeTokenBalance: this.bridgeObject.nativeTokenBalance,
        gasCost: this.getGasCost,
        originId: this.originChain.chainId,
        destinationId: this.targetToChain,
        destinationSymbol: this.destinationTokenInfo.symbol,
      };
    },

    getGasCost() {
      if (!this.estimateSendFee[0]) return 0;
      return this.$ethers.utils.formatEther(this.estimateSendFee[0]);
    },

    destinationTokenMax() {
      return this.bridgeObject.fromChains.find(
        (chain) => chain.chainId === this.targetToChain
      )?.destinationMax;
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
        this.gas = "";
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

        const approve = await approveToken(
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

    async adapterParams() {
      const packetType = 0;
      const messageVersion = 2;

      const dstNativeAmount = this.$ethers.utils.parseEther(
        this.gas.toString() || "0"
      );

      const minGas = await this.bridgeObject.contractInstance.minDstGasLookup(
        this.remoteLzChainId,
        packetType
      );

      if (minGas.eq(0))
        console.log(
          `minGas is 0, minDstGasLookup not set for destination chain ${this.remoteLzChainId}`
        );

      console.log(`minGas: ${minGas}`);

      const result = this.$ethers.utils.solidityPack(
        ["uint16", "uint256", "uint256", "address"],
        [messageVersion, minGas, dstNativeAmount, this.account]
      );

      return result;
    },

    async bridge() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      try {
        const parsedAmount = filters.formatToFixed(this.amount, 18);
        const amount = this.$ethers.utils.parseUnits(parsedAmount, 18);
        const fees = await this.getFees(this.amount); // add(dstNativeAmount);

        const estimateGas =
          await this.bridgeObject.contractInstance.estimateGas.sendFrom(
            this.account, // 'from' address to send tokens
            this.remoteLzChainId, // remote LayerZero chainId
            this.toAddressBytes, // 'to' address to send tokens
            amount, // amount of tokens to send (in wei)
            [
              this.account,
              this.$ethers.constants.AddressZero,
              this.adapterParams(),
            ], // flexible bytes array to indicate messaging adapter services
            {
              value: fees[0],
            }
          );

        const gasLimit = 1000 + +estimateGas.toString();

        const tx = await this.bridgeObject.contractInstance.sendFrom(
          this.account, // 'from' address to send tokens
          this.remoteLzChainId, // remote LayerZero chainId
          this.toAddressBytes, // 'to' address to send tokens
          amount, // amount of tokens to send (in wei)
          [
            this.account,
            this.$ethers.constants.AddressZero,
            this.adapterParams(),
          ], // flexible bytes array to indicate messaging adapter services
          {
            gasLimit,
            value: fees[0],
          }
        );

        await tx.wait();
        await this.$store.commit("notifications/delete", notificationId);
        this.transactionLink = `https://layerzeroscan.com/tx/${tx.hash}`;
        this.isSuccessPopup = true;
      } catch (error) {
        console.log("Bridge Error:", error);

        const errorNotification = {
          msg: "Transaction encountered an Error",
          type: "error",
        };

        if (
          String(error?.data?.message).indexOf("insufficient funds") !== -1 ||
          String(error).indexOf("insufficient funds") !== -1 ||
          String(error?.message).indexOf("insufficient funds") !== -1
        ) {
          errorNotification.msg = "Insufficient funds";
        }

        await this.$store.commit("notifications/delete", notificationId);
        await this.$store.dispatch("notifications/new", errorNotification);
      }
    },

    async getFees(amount) {
      if (!+amount) return 0;
      const parseAmount = await this.$ethers.utils.parseUnits(amount, 18);

      this.estimateSendFee =
        await this.bridgeObject.contractInstance.estimateSendFee(
          this.remoteLzChainId,
          this.toAddressBytes,
          parseAmount,
          false,
          this.adapterParams()
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
        this.signer,
        this.account,
        this.provider
      );

      this.updateInterval = setInterval(async () => {
        this.bridgeObject = await createBridgeConfig(
          this.chainId,
          this.signer,
          this.account,
          this.provider
        );
      }, 15000);
    },

    async changeSettings(value) {
      if (!value) this.gas = "";
      else this.gas = value;
      await this.getFees(this.amount || "1");
    },

    closeSettings() {
      this.isSettingsOpened = false;
    },

    async closePopup() {
      this.isSettingsOpened = false;
      if (this.isSettingsError) {
        this.gas = "";
        await this.changeSettings(0);
      }
    },

    errorSettings(value) {
      this.isSettingsError = value;
    },
  },

  async created() {
    if (!this.chainId) return false;
    if (this.isAcceptedNetworks) await this.bridgeNotAvailable();
    else {
      await this.createBridgeData();
      await this.getFees("1");
    }
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
    SuccessPopup,
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

.info {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.caption {
  font-weight: 300;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  letter-spacing: 0.025em;
  text-transform: uppercase;
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
}
</style>
