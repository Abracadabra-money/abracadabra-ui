<template>
  <div class="beam-view" v-if="beamInfoObject">
    <div class="beam">
      <div class="beam-header">
        <div class="title-desc">
          <h3 class="title">Beam</h3>
          <p class="description">Move Your MIM Across Networks</p>
        </div>

        <div class="settings-btns">
          <BeamSettingsButton
            :active="isSettingsOpened"
            @click="toggleSettings"
            buttonType="settings"
            v-if="fromChain && toChain"
          />
          <BeamSettingsButton
            :active="isShowDstAddress"
            @click="toggleDstAddress"
          />
        </div>
      </div>

      <div class="beam-actions" v-if="!isOpenNetworkPopup && !isSettingsOpened">
        <ChainsWrap
          :fromChain="fromChain"
          :toChain="toChain"
          @onChainSelectClick="openNetworkPopup"
          @switchChains="switchChains"
        />

        <div class="inputs-wrap" v-if="tokenConfig">
          <div>
            <h4 class="input-label">MIM to Beam</h4>
            <BaseTokenInput
              class="beam-input"
              :decimals="tokenConfig.decimals"
              :max="maxMimAmount"
              :value="inputValue"
              :name="tokenConfig.symbol"
              :icon="tokenConfig.image"
              @updateInputValue="updateMainValue"
              :error="amountError"
            />
          </div>

          <InputAddress
            v-if="isShowDstAddress"
            @update-input="updateDestinationAddress"
            @error-input="errorDestinationAddress"
          />
        </div>

        <ExpectedBlock
          v-if="beamInfoObject"
          :beamInfoObject="beamInfoObject"
          :dstChainConfig="toChain"
          :gasFee="estimateSendFee"
          :dstNativeTokenAmount="dstTokenAmount"
          :isLoading="isUpdateFeesData"
        />

        <div class="wrap-btn">
          <BaseButton
            :primary="true"
            :disabled="actionState.disable"
            @click="actionHandler"
            >{{ actionState.text }}</BaseButton
          >
        </div>

        <p class="caption">
          <span class="caption-text">Powered By</span
          ><img
            class="caption-icon"
            src="@/assets/images/beam/layer-zero.svg"
            alt=""
          />
        </p>
      </div>

      <ChainsPopup
        v-if="isOpenNetworkPopup"
        :isOpen="isOpenNetworkPopup"
        :popupType="popupType"
        :beamInfoObject="beamInfoObject"
        :selectedFromChain="fromChain"
        :selectedToChain="toChain"
        @closePopup="closeNetworkPopup"
        @changeChain="changeChain"
      />

      <TransitionWrapper>
        <SettingsPopup
          v-if="isSettingsOpened && toChain"
          :beamInfoObject="beamInfoObject"
          :dstChainInfo="toChain"
          :dstNativeTokenAmount="dstTokenAmount"
          :mimAmount="inputAmount"
          @onUpdateAmount="updateDstNativeTokenAmount"
          @closeSettings="isSettingsOpened = false"
        />
      </TransitionWrapper>
    </div>
  </div>

  <TransitionWrapper>
    <SuccessPopup
      v-if="isOpenSuccessPopup && beamInfoObject"
      :beamInfoObject="beamInfoObject"
      :successData="successData"
      @close-popup="isOpenSuccessPopup = false"
    />
  </TransitionWrapper>
</template>

<script lang="ts">
import { utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { trimZeroDecimals } from "@/helpers/numbers";
import { approveTokenViem } from "@/helpers/approval";
import { sendFrom } from "@/helpers/beam/sendFromNew";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import beamConfigs from "@/configs/beam/beamConfigs";
import { getEstimateSendFee } from "@/helpers/beam/getEstimateSendFeeNew";

import { getBeamInfo } from "@/helpers/beam/getBeamInfo";
import { formatUnits, type Address } from "viem";

import type {
  BeamConfig,
  BeamInfo,
  DestinationChainInfo,
} from "@/helpers/beam/types";
import type { ContractInfo } from "@/types/global";

export default {
  data() {
    return {
      dstAddress: null as string | null,
      dstAddressError: false,
      popupType: "to" as "to" | "from",
      isOpenNetworkPopup: false,
      updateInterval: null,
      isSettingsOpened: false,
      isOpenSuccessPopup: false,
      tx: null,
      successData: null as any,

      isApproving: false,
      isBeaming: false,
      isUpdateFeesData: false,

      beamInfoObject: undefined as BeamInfo | undefined,
      fromChain: undefined as BeamConfig | undefined,
      toChain: undefined as BeamConfig | undefined,

      dstTokenAmount: 0n,

      inputAmount: 0n,
      inputValue: "",

      isShowDstAddress: false,

      estimateSendFee: 0n,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      getChainById: "getChainById",
    }),

    toAddress() {
      return this.dstAddress ? this.dstAddress : this.account;
    },

    tokenConfig() {
      return this.beamInfoObject?.tokenConfig;
    },

    toAddressBytes() {
      return utils.defaultAbiCoder.encode(["address"], [this.toAddress]);
    },

    isTokenApproved() {
      if (!this.beamInfoObject) return false;

      // TODO: fix naming & conditions
      if (this.chainId === 8453) return true;
      if (this.chainId === 59144) return true;

      return this.beamInfoObject.userInfo.allowance >= this.inputAmount;
    },

    amountError() {
      if (!this.beamInfoObject) return "";

      if (this.inputAmount > this.beamInfoObject.userInfo.balance) {
        return `The value cannot be greater than ${this.maxMimAmountParsed}`;
      }
      return "";
    },

    isEnterDstAddress() {
      return !this.dstAddress && this.isShowDstAddress;
    },

    maxMimAmount() {
      if (!this.beamInfoObject) return 0n;

      return this.beamInfoObject.userInfo.balance;
    },

    maxMimAmountParsed() {
      return formatUnits(this.maxMimAmount, 18);
    },

    isInsufficientBalance() {
      return this.inputAmount > this.maxMimAmount;
    },

    isWrongChain() {
      return this.fromChain?.chainId !== this.chainId;
    },

    actionState() {
      if (!this.account) return { disable: false, text: "Connect wallet" };

      if (this.isWrongChain) return { disable: false, text: "Switch Chain" };

      if (!this.fromChain)
        return { disable: true, text: "Select Origin Chain" };
      if (!this.toChain)
        return { disable: true, text: "Select Destination Chain" };

      if (this.inputAmount === 0n) return { disable: true, text: "Set amount" };
      if (this.isInsufficientBalance)
        return { disable: true, text: "Insufficient balance" };

      if (this.isEnterDstAddress)
        return { disable: true, text: "Set destination address" };
      if (this.dstAddressError)
        return { disable: true, text: "Set destination address" };

      if (!this.isTokenApproved) return { disable: false, text: "Approve" };
      if (this.isApproving) return { disable: true, text: "Approving" };

      if (this.isBeaming) return { disable: true, text: "Beaming" };
      return { disable: false, text: "Beam" };
    },
  },

  watch: {
    inputAmount(value) {
      if (value === 0n) {
        this.inputValue = "";
        return false;
      }

      this.inputValue = trimZeroDecimals(formatUnits(value, 18));
    },
    fromChain(value) {
      if (this.toChain && this.toChain.chainId === value.chainId)
        this.toChain = undefined;

      if (this.toChain) {
        const isDisabled = this.checkChainsCompability(
          value.chainId,
          this.toChain.chainId
        );

        if (isDisabled) {
          this.toChain = undefined;
        }
      }

      if (
        this.beamInfoObject &&
        this.beamInfoObject.fromChainConfig.chainId !== value.chainId
      ) {
        this.clearData();
        this.initBeamInfo(value.chainId);
      }
    },
    async toChain() {
      if (this.beamInfoObject && this.fromChain) {
        this.estimateSendFee = await this.getEstimatedFees();
      }
    },
    account() {
      const currentChain = this.beamInfoObject
        ? this.beamInfoObject.fromChainConfig.chainId
        : this.chainId;
      this.clearData();
      this.initBeamInfo(currentChain);
    },
    chainId(value) {
      if (
        this.beamInfoObject &&
        this.beamInfoObject.fromChainConfig.chainId !== value
      ) {
        this.clearData();
        this.initBeamInfo(value);
      }
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({
      deleteNotification: "notifications/delete",
      updateNotification: "notifications/updateTitle",
    }),

    checkChainsCompability(fromChain: number, toChain: number) {
      if (!this.fromChain || !this.toChain) return false;

      const { beamConfigs } = this.beamInfoObject!;

      const fromChainConfig = beamConfigs.find(
        (chain) => chain.chainId === fromChain
      );

      const isDisabled =
        fromChainConfig!.settings.disabledDestinationChains.includes(toChain);

      return isDisabled;
    },

    toggleDstAddress() {
      this.isShowDstAddress = !this.isShowDstAddress;
    },

    toggleSettings() {
      this.isSettingsOpened = !this.isSettingsOpened;
    },

    openNetworkPopup(type: "from" | "to") {
      this.popupType = type;
      this.isOpenNetworkPopup = !this.isOpenNetworkPopup;
    },

    async updateMainValue(value: any) {
      if (value === null) {
        this.inputAmount = 0n;
        this.estimateSendFee = 0n;
        return false;
      }
      this.inputAmount = value;
      this.estimateSendFee = await this.getEstimatedFees();
    },

    updateDestinationAddress(address: string, error: boolean) {
      this.dstAddress = address;
      this.dstAddressError = error;
    },

    errorDestinationAddress(error: boolean) {
      this.dstAddressError = error;
    },

    async actionHandler() {
      if (this.actionState.disable) return false;

      if (!this.account) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (this.isWrongChain) {
        await switchNetwork(this.fromChain!.chainId);
        return false;
      }

      const beamContract = this.beamInfoObject!.fromChainConfig.contract;
      const mimContract: ContractInfo = {
        address: this.beamInfoObject!.tokenConfig.address as Address,
        abi: this.beamInfoObject!.tokenConfig.abi,
      };

      const notificationId = await this.createNotification(
        notification.pending
      );

      if (!this.isTokenApproved) {
        this.isApproving = true;

        this.updateNotification({
          title: "1/2: Approve MIM",
          id: notificationId,
        });

        const isTokenApproved = await approveTokenViem(
          mimContract,
          beamContract.address
        );

        this.isApproving = false;

        if (!isTokenApproved) {
          this.deleteNotification(notificationId);
          await this.createNotification(notification.approveError);
          return false;
        }
        this.updateNotification({
          title: "Step 2/2: Confirm Beam",
          id: notificationId,
        });
      }

      await this.seendBeam(notificationId);
    },

    async seendBeam(notificationId: number) {
      this.isBeaming = true;

      try {
        const { fees, params } = await this.getEstimatedFees(true);

        const payload = {
          fees,
          params,
          amount: this.inputAmount,
          dstLzChainId: this.toChain!.settings.lzChainId,
          to: this.toAddressBytes,
          account: this.account,
        };

        const hash = await sendFrom(
          this.beamInfoObject!.fromChainConfig,
          payload
        );

        this.deleteNotification(notificationId);
        this.isBeaming = false;

        const dstChainFullInfo =
          this.beamInfoObject!.destinationChainsInfo.find(
            (chain: DestinationChainInfo) =>
              chain.chainConfig.chainId === this.toChain!.chainId
          );

        const dstNativePrice = dstChainFullInfo!.nativePrice;

        const successPopupData = {
          originChain: {
            ...this.fromChain,
            nativePrice: this.beamInfoObject!.nativePrice,
          },
          dstChain: {
            ...this.toChain,
            nativePrice: dstNativePrice,
          },
          txPayload: {
            ...payload,
            to: this.toAddress,
          },
          txHash: hash,
          dstNativeTokenAmount: this.dstTokenAmount,
        };

        console.log("Success Popup Data:", successPopupData);

        this.successData = successPopupData;
        this.isOpenSuccessPopup = true;

        this.clearData();
      } catch (error) {
        console.log("Seend Beam Error:", error);
        this.isBeaming = false;
        this.errorTransaction(error, notificationId);
      }
    },

    async getEstimatedFees(getParams = false) {
      if (!this.toChain || !this.fromChain) return 0n;
      if (this.inputAmount === 0n) return 0n;

      this.isUpdateFeesData = true;

      // @ts-ignore
      const { fees, params } = await getEstimateSendFee(
        this.beamInfoObject!,
        this.toChain,
        this.account,
        this.dstTokenAmount,
        this.inputAmount
      );

      const additionalFee = fees[0] / 100n;
      const updatedFee = fees[0] + additionalFee; // add 1% from base fee to be sure tx success

      this.isUpdateFeesData = false;
      if (getParams) return { fees: updatedFee, params };
      else return updatedFee;
    },

    async errorTransaction(error: any, notificationId: any) {
      const errorNotification = {
        msg: "Transaction encountered an Error",
        type: "error",
      };

      if (
        String(error?.data?.message).indexOf("insufficient funds") !== -1 ||
        String(error?.data?.message).indexOf(
          "insufficient balance for transfer"
        ) !== -1 ||
        String(error).indexOf("insufficient funds") !== -1 ||
        String(error?.message).indexOf("insufficient funds") !== -1
      ) {
        errorNotification.msg = "Insufficient balance for transfer";
      }

      this.deleteNotification(notificationId);
      await this.createNotification(errorNotification);
    },

    async updateDstNativeTokenAmount(value: bigint) {
      this.dstTokenAmount = value;
      this.estimateSendFee = await this.getEstimatedFees();
    },

    closeNetworkPopup() {
      this.isOpenNetworkPopup = false;
    },

    async changeChain(chainId: number, type: string) {
      console.log("changeChain", { chainId, type });
      const chainConfig = this.beamInfoObject!.beamConfigs.find(
        (chain) => chain.chainId === chainId
      );

      if (type === "from") {
        this.fromChain = chainConfig;
        this.clearData();
      } else {
        this.toChain = chainConfig;
      }
    },

    async switchChains() {
      const fromChain = this.fromChain;
      const toChain = this.toChain;

      this.clearData();
      this.fromChain = toChain;
      this.toChain = undefined;
      await this.initBeamInfo(this.fromChain!.chainId);
      this.toChain = fromChain;
    },

    // closeSuccessPopup() {
    //   this.isOpenSuccessPopup = false;
    // },

    // async getMessagesBySrcTxHash() {
    //   const client = createClient("mainnet");
    //   const { messages } = await client.getMessagesBySrcTxHash(
    //     this.successData.tx.hash
    //   );

    //   return messages[0];
    // },

    async initBeamInfo(chainId: number): Promise<number | undefined> {
      try {
        const isChainIdValid = beamConfigs.some(
          (item) => item.chainId === chainId
        );
        const beamChainId = isChainIdValid ? chainId : beamConfigs[0].chainId;

        this.beamInfoObject = await getBeamInfo(beamChainId, this.account);

        return this.beamInfoObject.fromChainConfig.chainId;
      } catch (error) {
        console.log("Beam Info Error:", error);
      }
    },

    setDefaulChain(chainId: number) {
      if (!this.beamInfoObject) return;

      this.fromChain = this.beamInfoObject.beamConfigs.find(
        (chain) => chain.chainId === chainId
      );
    },

    clearData() {
      this.dstAddress = null;
      this.dstAddressError = false;
      this.inputAmount = 0n;
      this.inputValue = "";
      this.isShowDstAddress = false;
      this.estimateSendFee = 0n;
      this.dstTokenAmount = 0n;
    },
  },

  async created() {
    const chainId = await this.initBeamInfo(this.chainId);
    if (chainId) this.setDefaulChain(chainId);
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    ChainsWrap: defineAsyncComponent(
      () => import("@/components/beam/ChainsWrap.vue")
    ),
    ChainsPopup: defineAsyncComponent(
      () => import("@/components/beam/ChainsPopup.vue")
    ),
    SettingsPopup: defineAsyncComponent(
      () => import("@/components/beam/SettingsPopup.vue")
    ),
    SuccessPopup: defineAsyncComponent(
      () => import("@/components/beam/successPopup/SuccessPopup.vue")
    ),
    BeamSettingsButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/BeamSettingsButton.vue")
    ),
    InputAddress: defineAsyncComponent(
      () => import("@/components/beam/InputAddress.vue")
    ),
    ExpectedBlock: defineAsyncComponent(
      () => import("@/components/beam/ExpectedBlock.vue")
    ),
    TransitionWrapper: defineAsyncComponent(
      () => import("@/components/ui/TransitionWrapper.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.beam-view {
  display: flex;
  justify-content: center;
  padding: 100px 15px;
  min-height: 100vh;
  width: 100%;
  height: 100%;
}

.beam {
  max-width: 533px;
  width: 100%;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  position: relative;
}

.beam-header {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-desc {
  display: flex;
  flex-direction: column;
  align-items: start;
}

.title {
  font-weight: 600;
  font-size: 24px;
}

.description {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 400;
}

.beam-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  padding: 28px 28px 38px 28px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.progress-text:first-letter {
  text-transform: uppercase;
}

.completed,
.processing {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #63ff7b;
  display: inline-block;
}
.processing {
  background: $clrYellow;
}

.settings-btns {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 1;
}

.inputs-wrap {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 40px 0 16px 0;
  gap: 16px;
}

.input-label {
  margin-bottom: 6px;
}

.beam-input {
  width: 100%;
}

.wrap-btn {
  width: 100%;
  margin: 40px 0 12px 0;
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
  .settings-btns {
    gap: 12px;
  }
}
</style>
