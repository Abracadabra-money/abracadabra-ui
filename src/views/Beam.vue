<template>
  <div class="beam-view">
    <div class="beam" v-if="beamConfig">
      <h3 class="title">Beam</h3>

      <div class="settings-btns">
        <WalletButton :active="isShowDstAddress" @click="toggleDstAddress" />
        <SettingsButton
          :active="isSettingsOpened"
          @click="isSettingsOpened = true"
        />
      </div>

      <ChainsWrap
        :fromChain="originChain"
        :toChain="dstChain"
        :selectChain="isSelectedChain"
        @switch-chain="switchChain"
        @change-network="openNetworkPopup"
      />

      <div class="inputs-wrap">
        <div>
          <InputLabel title="Token to beam" :amount="mimBalance" />
          <BaseTokenInput
            :max="beamConfig.balance"
            :value="amount"
            :name="'MIM'"
            :icon="$image('assets/images/tokens/MIM.png')"
            :error="amountError"
            @update-value="updateMainValue"
          />
        </div>

        <InputAddress
          v-if="isShowDstAddress"
          @update-input="updateDestinationAddress"
          @error-input="errorDestinationAddress"
        />
      </div>

      <ExpectedBlock :data="expectedConfig" />

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
      @close-popup="isSettingsOpened = false"
    >
      <SettingsPopup
        :value="dstTokenAmount"
        :max="dstMaxAmount"
        :defaultValue="dstDefaultValue"
        :config="settingConfig"
        @change-settings="changeSettings"
        @close-settings="isSettingsOpened = false"
        @error-settings="errorSettings"
    /></LocalPopupWrap>

    <LocalPopupWrap
      :isOpened="isOpenSuccessPopup"
      @close-popup="isOpenSuccessPopup = false"
    >
      <SuccessPopup :config="successConfig" />
    </LocalPopupWrap>

    <ChainsPopup
      :isOpen="isOpenNetworkPopup"
      :networksArr="popupNetworksArr"
      :activeChain="activePopupChain"
      :popupType="popupType"
      :selectChain="isSelectedChain"
      @close-popup="closeNetworkPopup"
      @enter-chain="changeChain"
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
import WalletButton from "@/components/ui/buttons/WalletButton.vue";
import SettingsButton from "@/components/ui/buttons/SettingsButton.vue";
import InputAddress from "@/components/ui/inputs/InputAddress.vue";
import InputLabel from "@/components/ui/inputs/InputLabel.vue";
import ExpectedBlock from "@/components/bridge/ExpectedBlock.vue";

import { mapGetters } from "vuex";
import { getNativeTokenPrice } from "@/helpers/priceHelper.js";
import { createBeamConfig } from "@/helpers/beam/createBeamConfig";
import { approveToken } from "@/helpers/approve/approveToken.ts";
import { getTokenInfo } from "@/helpers/getTokenInfo";
import { waitForMessageReceived } from "@layerzerolabs/scan-client";
import { getDstTokenMax } from "@/helpers/beam/getDstTokenMax.ts";
import { getEstimateSendFee } from "@/helpers/beam/getEstimateSendFee";
import { sendFrom } from "@/helpers/beam/sendFrom.ts";
import notification from "@/helpers/notification/notification.js";
import filters from "@/filters/index.js";

import chainSwitch from "@/mixins/chainSwitch";

export default {
  mixins: [chainSwitch],
  data() {
    return {
      acceptedNetworks: [1, 10, 56, 137, 250, 1285, 42161, 43114],
      isShowDstAddress: false,
      toChainId: null,
      dstAddress: null,
      dstAddressError: false,
      dstTokenAmount: "",
      popupType: null,
      amount: "",
      isOpenNetworkPopup: false,
      updateInterval: null,
      isSettingsOpened: false,
      beamConfig: null,
      estimateSendFee: 0,
      dstMaxAmount: 0,
      dstTokenPrice: null,
      isSettingsError: false,
      startFee: 0,
      isSelectedChain: false,
      isOpenSuccessPopup: false,
      tx: null,
      txInfo: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      signer: "getSigner",
      provider: "getProvider",
      chainId: "getChainId",
    }),

    isAcceptedNetworks() {
      return this.acceptedNetworks.indexOf(this.chainId) === -1;
    },

    toAddress() {
      return this.dstAddress ? this.dstAddress : this.account;
    },

    toAddressBytes() {
      return this.$ethers.utils.defaultAbiCoder.encode(
        ["address"],
        [this.toAddress]
      );
    },

    isTokenApproved() {
      return !this.beamConfig.isTokenApprove && this.chainId === 1;
    },

    amountError() {
      if (+this.amount > +this.beamConfig.balance) {
        return `The value cannot be greater than ${this.beamConfig.balance}`;
      }
      return "";
    },

    popupNetworksArr() {
      if (this.popupType === "from") return this.beamConfig?.fromChains;
      return this.beamConfig?.toChains;
    },

    activePopupChain() {
      if (this.popupType === "from" && this.originChain) {
        return this.originChain.chainId;
      } else if (this.dstChain) {
        return this.dstChain.chainId;
      }

      return 1;
    },

    originChain() {
      return this.beamConfig?.fromChains.find(
        (chain) => chain.chainId === this.chainId
      );
    },

    targetToChain() {
      if (this.toChainId) return this.toChainId;
      return this.beamConfig.chainsInfo[0].chainId;
    },

    dstChainId() {
      return this.beamConfig.chainsInfo.find(
        (item) => item.chainId === this.targetToChain
      )?.lzChainId;
    },

    lzChainId() {
      const lzChainId = this.beamConfig.chainsInfo.find(
        (item) => item.chainId === this.targetToChain
      )?.lzChainId;

      return this.$ethers.BigNumber.from(lzChainId);
    },

    dstChain() {
      return this.beamConfig?.toChains.find(
        (chain) => chain.chainId === this.targetToChain
      );
    },

    isEnterDstAddress() {
      return !this.dstAddress && this.isShowDstAddress;
    },

    actionBtnText() {
      if (this.isEnterDstAddress) return "Set destination address";
      if (this.dstAddressError) return "Set destination address";
      if (this.isTokenApproved) return "Approve";
      return "Beam";
    },

    mimBalance() {
      return this.beamConfig?.balance || 0;
    },

    disableBtn() {
      if (!this.account || !this.isSelectedChain) return true;
      if (this.isEnterDstAddress) return true;
      if (this.dstAddressError) return true;
      if (this.isTokenApproved) return false;
      if (+this.amount === 0) return true;
      return !!this.amountError;
    },

    dstDefaultValue() {
      return (
        this.beamConfig.fromChains.find(
          (chain) => chain.chainId === this.originChain.chainId
        )?.defaultValue[this.targetToChain] || "0"
      );
    },

    srcTokenInfo() {
      return getTokenInfo(this.chainId);
    },

    dstTokenInfo() {
      return getTokenInfo(this.targetToChain);
    },

    getFee() {
      if (!this.estimateSendFee[0]) return 0;
      return this.$ethers.utils.formatEther(this.estimateSendFee[0]);
    },

    formatFee() {
      if (!this.getFee) return "0.0";
      return filters.formatToFixed(this.getFee, 8);
    },

    expectedConfig() {
      return {
        mimAmount: this.amount,
        dstTokenAmount: this.dstTokenAmount,
        dstTokenSymbol: this.dstTokenInfo.symbol,
        gasCost: this.formatFee,
        srcTokenSymbol: this.srcTokenInfo.symbol,
      };
    },

    settingConfig() {
      return {
        icon: this.dstTokenInfo.icon,
        nativeTokenBalance: this.beamConfig.nativeTokenBalance,
        nativeSymbol: this.srcTokenInfo.symbol,
        contract: this.beamConfig.contractInstance,
        address: this.toAddress,
        dstChainId: this.lzChainId,
      };
    },

    txConfig() {
      return {
        contract: this.beamConfig.contractInstance,
        account: this.account,
        dstChainId: this.lzChainId,
        toAddressBytes: this.toAddressBytes,
      };
    },

    successConfig() {
      return {
        sendFrom: this.account,
        sendTo: this.toAddress,
        originChain: this.originChain,
        mimAmount: this.amount,
        nativeSymbol: this.srcTokenInfo.symbol,
        gasOnDst: filters.formatToFixed(+this.getFee - +this.startFee, 3),
        dstTokenSymbol: this.dstTokenInfo.symbol,
        dstChain: this.dstChain,
        dstTokenAmount: this.dstTokenAmount,
        dstTokenPrice: this.dstTokenPrice,
        tx: this.tx,
        txInfo: this.txInfo,
      };
    },
  },

  watch: {
    async chainId() {
      if (this.isAcceptedNetworks) await this.beamNotAvailable();
      else await this.createBeamData();
    },
  },

  methods: {
    toggleDstAddress() {
      this.isShowDstAddress = !this.isShowDstAddress;
    },

    switchChain() {
      if (!this.isSelectedChain) return false;
      if (this.account) this.switchNetwork(this.dstChain.chainId);
      else this.switchNetworkWithoutConnect(this.dstChain.chainId);
    },

    openNetworkPopup(type) {
      this.popupType = type;
      this.isOpenNetworkPopup = !this.isOpenNetworkPopup;
    },

    async updateMainValue(value) {
      this.amount = value;
    },

    updateDestinationAddress(address, error) {
      this.dstAddress = address;
      this.dstAddressError = error;
    },

    errorDestinationAddress(error) {
      this.dstAddressError = error;
    },

    async actionHandler() {
      if (this.disableBtn) return false;
      if (this.isTokenApproved) {
        return await approveToken(
          this.beamConfig.tokenContractInstance,
          this.beamConfig.contractInstance.address
        );
      }

      await this.seendBeam();
    },

    async seendBeam() {
      const notificationId = await this.$store.dispatch(
        "notifications/new",
        notification.pending
      );

      this.dstTokenPrice = await getNativeTokenPrice(this.toChainId);

      try {
        const mimAmount = this.$ethers.utils.parseUnits(
          filters.formatToFixed(this.amount, 18),
          18
        );

        const { fees, params } = await this.getEstimatedFees(true);
        this.tx = await sendFrom(fees, params, mimAmount, this.txConfig);
        console.log("this.tx", this.tx);
        await this.$store.commit("notifications/delete", notificationId);
        this.isOpenSuccessPopup = true;
        await this.tx.wait();
        console.log("this.tx", this.tx);

        this.txInfo = await waitForMessageReceived(
          this.dstChainId,
          this.tx.hash
        );
      } catch (error) {
        console.log("Bridge Error:", error);
        this.errorTransaction(error, notificationId);
      }
    },

    async getEstimatedFees(getParams = false) {
      const { fees, params } = await getEstimateSendFee(
        this.beamConfig.contractInstance,
        this.toAddress,
        this.lzChainId,
        this.dstTokenAmount || "0",
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

    async changeSettings(value) {
      if (!value || this.isSettingsError) this.dstTokenAmount = "";
      else this.dstTokenAmount = value;
      this.estimateSendFee = await this.getEstimatedFees();
    },

    errorSettings(value) {
      this.isSettingsError = value;
    },

    closeNetworkPopup() {
      this.isOpenNetworkPopup = false;
    },

    async changeChain(chainId, type) {
      if (type === "to") {
        this.isSelectedChain = true;
        this.dstTokenAmount = "";
        this.estimateSendFee = 0;
        this.toChainId = chainId;
        this.startFee = 0;
        this.dstMaxAmount = await getDstTokenMax(
          this.beamConfig.contractInstance,
          this.signer,
          this.dstChainId
        );

        if (!this.startFee) {
          const startFee = await this.getEstimatedFees();
          this.startFee = this.$ethers.utils.formatEther(startFee[0]);
        }

        this.estimateSendFee = await this.getEstimatedFees();
      } else {
        this.switchNetwork(chainId);
      }
    },

    async beamNotAvailable() {
      return await this.$store.dispatch(
        "notifications/new",
        notification.beamNotAvailable
      );
    },

    async createBeamData() {
      this.beamConfig = await createBeamConfig(
        this.chainId,
        this.signer,
        this.account,
        this.provider
      );

      this.updateInterval = setInterval(async () => {
        this.beamConfig = await createBeamConfig(
          this.chainId,
          this.signer,
          this.account,
          this.provider
        );
      }, 15000);
    },
  },

  async created() {
    if (!this.chainId) return false;
    if (this.isAcceptedNetworks) await this.beamNotAvailable();
    else await this.createBeamData();
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
