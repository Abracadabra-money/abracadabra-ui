<template>
  <div class="beam-view">
    <div class="beam" v-if="bridgeObject">
      <h3 class="title">Beam</h3>

      <div class="settings-btns">
        <WalletButton
          :active="isShowInputAddress"
          @click="toggleInputAddress"
        />
        <SettingsButton
          :active="isSettingsOpened"
          @click="isSettingsOpened = true"
        />
      </div>

      <ChainsWrap
        :fromChain="originChain"
        :toChain="destinationChain"
        :selectChain="selectChain"
        @switchChain="switchChain"
        @changeNetwork="openNetworkPopup"
      />

      <div class="inputs-wrap">
        <div>
          <InputLabel title="Token to beam" :amount="mimBalance" />
          <BaseTokenInput
            :max="bridgeObject.balance"
            :value="amount"
            :name="'MIM'"
            :icon="$image('assets/images/tokens/MIM.png')"
            :error="amountError"
            @updateValue="updateMainValue"
          />
        </div>

        <InputAddress
          v-if="isShowInputAddress"
          @update-input="updateDestinationAddress"
          @error-input="errorDestinationAddress"
        />
      </div>

      <ExpectedBlock :data="expectedData" />

      <BaseButton
        :primary="true"
        :disabled="disableBtn"
        @click="actionHandler"
        >{{ actionBtnText }}</BaseButton
      >

      <p class="caption">
        <span class="caption-text">Powered By</span
        ><img
          class="caption-icon"
          src="@/assets/images/bridge/layer-zero.svg"
          alt=""
        />
      </p>
    </div>

    <LocalPopupWrap
      :isOpened="isSettingsOpened"
      @closePopup="isSettingsOpened = false"
    >
      <SettingsPopup
        :value="destinationTokenAmount"
        :max="destinationTokenMax"
        :defaultValue="destinationTokenDefaultValue"
        :config="settingConfig"
        @changeSettings="changeSettings"
        @closeSettings="isSettingsOpened = false"
        @errorSettings="errorSettings"
    /></LocalPopupWrap>

    <LocalPopupWrap
      :isOpened="isSuccessPopup"
      @closePopup="isSuccessPopup = false"
    >
      <SuccessPopup :link="transactionLink" :config="successConfig" />
    </LocalPopupWrap>

    <ChainsPopup
      :isOpen="isOpenNetworkPopup"
      @closePopup="closeNetworkPopup"
      @enterChain="changeChain"
      :networksArr="popupNetworksArr"
      :activeChain="activePopupChain"
      :popupType="popupType"
      :selectChain="selectChain"
    />
  </div>
</template>

<script>
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import ChainsWrap from "@/components/bridge/ChainsWrap.vue";
import ChainsPopup from "@/components/bridge/ChainsPopup.vue";
import LocalPopupWrap from "@/components/popups/LocalPopupWrap.vue";
import SettingsPopup from "@/components/bridge/SettingsPopup.vue";
import SuccessPopup from "@/components/bridge/SuccessPopup.vue";
import filters from "@/filters/index.js";
import chainSwitch from "@/mixins/chainSwitch";
import notification from "@/helpers/notification/notification.js";
import WalletButton from "@/components/ui/buttons/WalletButton.vue";
import SettingsButton from "@/components/ui/buttons/SettingsButton.vue";
import InputAddress from "@/components/ui/inputs/InputAddress.vue";
import InputLabel from "@/components/ui/inputs/InputLabel.vue";
import ExpectedBlock from "@/components/bridge/ExpectedBlock.vue";

import { getNativeTokenPrice } from "@/helpers/priceHelper.js";
import { mapGetters } from "vuex";
import { createBridgeConfig } from "@/helpers/bridge";
import { approveToken } from "@/helpers/approve/approveToken.ts";
import { getTokenInfo } from "@/helpers/getTokenInfo";
import { nextTick } from "vue";
import { waitForMessageReceived } from "@layerzerolabs/scan-client";
import { getDstTokenMax } from "@/helpers/bridge/getDstTokenMax.ts";
import { getEstimateSendFee } from "@/helpers/beam/getEstimateSendFee";
import { sendFrom } from "@/helpers/beam/sendFrom.ts";

export default {
  mixins: [chainSwitch],
  data() {
    return {
      acceptedNetworks: [1, 10, 56, 137, 250, 1285, 42161, 43114],
      popupType: null,
      bridgeObject: null,
      isOpenNetworkPopup: false,
      isShowInputAddress: false,
      destinationAddress: null,
      toChainId: null,
      updateInterval: null,
      amount: "",
      isSettingsOpened: false,
      isSuccessPopup: false,
      destinationTokenAmount: "",
      estimateSendFee: 0,
      transactionLink: "",
      isSettingsError: false,
      selectChain: false,
      startGasCost: 0,
      transaction: null,
      destinationTokenPrice: null,
      transactionInfo: null,
      destinationTokenMax: 0,
      inputAddressError: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      signer: "getSigner",
      provider: "getProvider",
      chainId: "getChainId",
    }),

    isTokenApproved() {
      return !this.bridgeObject.isTokenApprove && this.isMainnetChain;
    },

    beamConfig() {
      return {
        contract: this.bridgeObject.contractInstance,
        account: this.account,
        dstChainId: this.remoteLzChainId,
        toAddressBytes: this.toAddressBytes,
      };
    },

    expectedData() {
      return {
        mimAmount: this.amount,
        dstTokenAmount: this.destinationTokenAmount || "0.0",
        dstTokenSymbol: this.destinationTokenInfo.symbol,
        gasCost: this.formatEstimateSendFee,
        srcTokenSymbol: this.nativeTokenInfo.symbol,
      };
    },

    toAddress() {
      return this.destinationAddress ? this.destinationAddress : this.account;
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

    dstChainId() {
      return this.bridgeObject.chainsInfo.find(
        (item) => item.chainId === this.targetToChain
      )?.lzChainId;
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
      if (!this.destinationAddress && this.isShowInputAddress)
        return "Set destination address";

      if (this.inputAddressError) return "Set destination address";

      if (!this.bridgeObject.isTokenApprove && this.isMainnetChain)
        return "Approve";

      return "Beam";
    },

    mimBalance() {
      return this.bridgeObject?.balance || 0;
    },

    disableBtn() {
      if (!this.account || !this.selectChain) return true;
      if (!this.destinationAddress && this.isShowInputAddress) return true;
      if (this.inputAddressError) return true;
      if (!this.bridgeObject.isTokenApprove && this.isMainnetChain)
        return false;
      if (+this.amount === 0) return true;
      return !!this.amountError;
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
        icon: this.destinationTokenInfo.icon,
        nativeTokenBalance: this.bridgeObject.nativeTokenBalance,
        gasCost: this.getGasCost,
        destinationSymbol: this.destinationTokenInfo.symbol,
        nativeSymbol: this.nativeTokenInfo.symbol,
        contract: this.bridgeObject.contractInstance,
        address: this.toAddress,
        dstChainId: this.remoteLzChainId,
      };
    },

    getGasCost() {
      if (!this.estimateSendFee[0]) return 0;
      return this.$ethers.utils.formatEther(this.estimateSendFee[0]);
    },

    destinationTokenDefaultValue() {
      return (
        this.bridgeObject.fromChains.find(
          (chain) => chain.chainId === this.originChain.chainId
        )?.defaultValue[this.targetToChain] || "0"
      );
    },

    successConfig() {
      return {
        sendFrom: this.account,
        sendTo: this.toAddress,
        originChain: this.originChain,
        mimAmount: this.amount,
        nativeSymbol: this.nativeTokenInfo.symbol,
        gasCost: filters.formatToFixed(this.getGasCost, 6),
        tokenToGas: filters.formatToFixed(
          +this.getGasCost - +this.startGasCost,
          3
        ),
        destinationTokenAmount: this.destinationTokenAmount,
        destinationSymbol: this.destinationTokenInfo.symbol,
        transaction: this.transaction,
        destinationchain: this.destinationChain,
        destinationTokenPrice: this.destinationTokenPrice,
        transactionInfo: this.transactionInfo,
      };
    },
  },

  watch: {
    async chainId() {
      if (this.isAcceptedNetworks) await this.bridgeNotAvailable();
      else await this.createBridgeData();
    },
  },

  methods: {
    updateDestinationAddress(address, error) {
      this.destinationAddress = address;
      this.inputAddressError = error;
    },

    errorDestinationAddress(error) {
      this.inputAddressError = error;
    },

    toggleInputAddress() {
      this.isShowInputAddress = !this.isShowInputAddress;
    },

    openNetworkPopup(type) {
      this.popupType = type;
      this.isOpenNetworkPopup = !this.isOpenNetworkPopup;
    },

    closeNetworkPopup() {
      this.isOpenNetworkPopup = false;
    },

    async changeChain(chainId, type) {
      if (type === "to") {
        this.selectChain = true;
        this.destinationTokenAmount = "";
        this.estimateSendFee = 0;
        this.toChainId = chainId;
        this.startGasCost = 0;
        this.destinationTokenMax = await getDstTokenMax(
          this.bridgeObject.contractInstance,
          this.signer,
          this.dstChainId
        );

        if (!this.startGasCost) {
          const startGasCost = await this.getEstimatedFees();
          this.startGasCost = this.$ethers.utils.formatEther(startGasCost[0]);
        }

        this.estimateSendFee = await this.getEstimatedFees();
      } else {
        this.switchNetwork(chainId);
      }
    },

    switchChain() {
      if (!this.selectChain) return false;
      if (this.account) this.switchNetwork(this.destinationChain.chainId);
      else this.switchNetworkWithoutConnect(this.destinationChain.chainId);
    },

    async updateMainValue(value) {
      this.amount = value;
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
      await nextTick();
      if (!value || this.isSettingsError) this.destinationTokenAmount = "";
      else this.destinationTokenAmount = value;
      this.estimateSendFee = await this.getEstimatedFees();
    },

    errorSettings(value) {
      this.isSettingsError = value;
    },

    async actionHandler() {
      if (this.disableBtn) return false;
      if (this.isTokenApproved) {
        return await approveToken(
          this.bridgeObject.tokenContractInstance,
          this.bridgeObject.contractInstance.address
        );
      }

      await this.seendBeam();
    },

    async getEstimatedFees(getParams = false) {
      const { fees, params } = await getEstimateSendFee(
        this.bridgeObject.contractInstance,
        this.toAddress,
        this.remoteLzChainId,
        this.destinationTokenAmount || "0",
        this.amount || "1"
      );

      if (getParams) return { fees, params };
      else return fees;
    },

    async errorTransaction(error, notificationId) {
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
    },

    async seendBeam() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      this.destinationTokenPrice = await getNativeTokenPrice(this.toChainId);

      try {
        const mimAmount = this.$ethers.utils.parseUnits(
          filters.formatToFixed(this.amount, 18),
          18
        );

        const { fees, params } = await this.getEstimatedFees(true);
        const tx = await sendFrom(fees, params, mimAmount, this.beamConfig);
        await this.$store.commit("notifications/delete", notificationId);

        this.isSuccessPopup = true;
        await tx.wait();

        this.transaction = tx;
        this.transactionLink = `https://layerzeroscan.com/tx/${tx.hash}`;
        this.transactionInfo = await waitForMessageReceived(
          this.dstChainId,
          tx.hash
        );
      } catch (error) {
        console.log("Bridge Error:", error);
        this.errorTransaction(error, notificationId);
      }
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
    ChainsWrap,
    ChainsPopup,
    LocalPopupWrap,
    SettingsPopup,
    SuccessPopup,
    WalletButton,
    SettingsButton,
    InputAddress,
    InputLabel,
    ExpectedBlock,
  },
};
</script>

<style lang="scss" scoped>
.beam-view {
  padding: 100px 15px;
}

.beam {
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  padding: 30px 65px;
  background: #2a2835;
  backdrop-filter: blur(100px);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  position: relative;
}

.title {
  font-weight: 600;
  font-size: 24px;
  line-height: 150%;
  text-align: center;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.settings-btns {
  position: absolute;
  top: 30px;
  right: 65px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 1;
}

.inputs-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.caption {
  font-weight: 300;
  font-size: 12px;
  line-height: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.caption-text {
  margin-top: 2px;
}

.caption-icon {
  max-width: 85px;
}

@media (max-width: 600px) {
  .beam {
    padding: 30px 15px;
    gap: 15px;
  }

  .settings-btns {
    right: 5%;
    gap: 10px;
  }
}
</style>
