<template>
  <div class="beam-view" v-if="beamInfoObject">
    <div class="beam">
      <!-- <div class="spell-message" v-if="tokenType === SPELL_ID">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut lab
      </div> -->

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
            v-if="fromChainConfig && toChainConfig"
          />

          <BeamSettingsButton
            :active="isShowDstAddress"
            @click="toggleDstAddress"
          />
        </div>
      </div>

      <div class="tabs">
        <button
          :class="['tab-item', { active: tokenType === tab.id }]"
          v-for="tab in tabsInfo"
          :key="tab.id"
          @click="changeTokenType(tab.id)"
        >
          <img class="tab-icon" :src="tab.icon" alt="" />
          {{ tab.name }}
        </button>
      </div>

      <div class="beam-actions" v-if="!isOpenNetworkPopup && !isSettingsOpened">
        <ChainsWrap
          :toChain="toChainConfig!"
          :fromChain="fromChainConfig"
          :tokenType="tokenType"
          :isChainsDisabled="isLoadingBeamInfo"
          @onChainSelectClick="openNetworkPopup"
          @switchChains="switchChains"
        />

        <div class="inputs-wrap" v-if="tokenConfig">
          <div>
            <h4 class="input-label">{{ tokenSymbol }} to Beam</h4>

            <div class="row-skeleton" v-if="isLoadingBeamInfo"></div>

            <BaseTokenInput
              v-else
              class="beam-input"
              :decimals="tokenConfig.decimals"
              :max="maxTokenAmount"
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
          v-if="beamInfoObject && fromChainConfig"
          :beamInfoObject="beamInfoObject"
          :dstChainConfig="toChainConfig!"
          :gasFee="estimateSendFee"
          :fromChain="fromChainConfig!"
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
        :selectedFromChain="fromChainConfig"
        :selectedToChain="toChainConfig!"
        @closePopup="closeNetworkPopup"
        @changeChain="changeChain"
      />

      <SettingsPopup
        v-if="isSettingsOpened && toChainConfig"
        :beamInfoObject="beamInfoObject"
        :dstChainInfo="toChainConfig"
        :dstNativeTokenAmount="dstTokenAmount"
        :mimAmount="inputAmount"
        :fromChain="fromChainConfig!"
        @onUpdateAmount="updateDstNativeTokenAmount"
        @closeSettings="isSettingsOpened = false"
      />
    </div>
  </div>

  <SuccessPopup
    v-if="isOpenSuccessPopup && beamInfoObject"
    :beamInfoObject="beamInfoObject"
    :successData="successData"
    @close-popup="isOpenSuccessPopup = false"
  />
</template>

<script lang="ts">
import {
  BASE_CHAIN_ID,
  LINEA_CHAIN_ID,
  MAINNET_CHAIN_ID,
} from "@/constants/global";
import { ethers, utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import { formatUnits, type Address } from "viem";
import { approveToken } from "@/helpers/approval";
import type { ContractInfo } from "@/types/global";
import { sendFrom } from "@/helpers/beam/sendFrom";
import { sendLzV2 } from "@/helpers/beam/sendLzV2";
import { MIM_ID, SPELL_ID } from "@/constants/beam";
import { trimZeroDecimals } from "@/helpers/numbers";
import type { BeamInfo } from "@/helpers/beam/types";
import { removeDust } from "@/helpers/beam/removeDust";
import { beamConfigs } from "@/configs/beam/beamConfigs";
import { getBeamInfo } from "@/helpers/beam/getBeamInfo";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { openConnectPopup } from "@/helpers/connect/utils";
import { mapGetters, mapActions, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification";
import ErrorHandler from "@/helpers/errorHandler/ErrorHandler";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import { quoteSendFee } from "@/helpers/beam/getEstimateSendFee";
import { getBeamChainInfo } from "@/helpers/beam/getBeamChainInfo";
import { getEstimateSendFee } from "@/helpers/beam/getEstimateSendFee";

export default {
  data() {
    return {
      SPELL_ID,
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
      dstTokenAmount: 0n,
      inputAmount: 0n,
      inputValue: "",
      isShowDstAddress: false,
      estimateSendFee: 0n,
      tokenType: MIM_ID,
      isLoadingBeamInfo: false,
      fromChainId: null as null | number,
      toChainId: null as null | number,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    fromChainConfig() {
      const { fromChain } = getBeamChainInfo(
        this.beamInfoObject!,
        this.fromChainId,
        this.toChainId
      );

      return fromChain;
    },

    toChainConfig() {
      const { toChain } = getBeamChainInfo(
        this.beamInfoObject!,
        this.fromChainId,
        this.toChainId
      );
      return toChain;
    },

    toAddress() {
      return this.dstAddress ? this.dstAddress : this.account;
    },

    tokenConfig() {
      return this.fromChainConfig?.tokenConfig;
    },

    isLzVersion2() {
      return this.toChainConfig?.settings?.lzVersion === 2;
    },

    toAddressBytes() {
      if (this.isLzVersion2) {
        return ethers.utils.defaultAbiCoder.encode(
          ["bytes32"],
          [ethers.utils.hexZeroPad(this.toAddress, 32)]
        );
      }

      return utils.defaultAbiCoder.encode(["address"], [this.toAddress]);
    },

    isTokenApproved() {
      if (!this.beamInfoObject) return false;

      if (this.chainId === BASE_CHAIN_ID) return true;
      if (this.chainId === LINEA_CHAIN_ID) return true;

      return this.fromChainConfig!.userInfo.allowance >= this.inputAmount;
    },

    amountError() {
      if (!this.beamInfoObject) return "";

      if (this.inputAmount > this.fromChainConfig!.userInfo.balance)
        return `The value cannot be greater than ${this.maxTokenAmountParsed}`;
      else return "";
    },

    isEnterDstAddress() {
      return !this.dstAddress && this.isShowDstAddress;
    },

    maxTokenAmount() {
      if (!this.beamInfoObject) return 0n;

      return removeDust(this.fromChainConfig!.userInfo.balance);
    },

    maxTokenAmountParsed() {
      return formatUnits(this.maxTokenAmount, 18);
    },

    isInsufficientBalance() {
      return this.inputAmount > this.maxTokenAmount;
    },

    isWrongChain() {
      return this.fromChainConfig?.chainId !== this.chainId;
    },

    actionState() {
      if (!this.account) return { disable: false, text: "Connect wallet" };

      if (this.isWrongChain) return { disable: false, text: "Switch Chain" };

      if (!this.fromChainConfig)
        return { disable: true, text: "Select Origin Chain" };

      if (!this.toChainConfig)
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

    tabsInfo() {
      return [
        {
          id: MIM_ID,
          name: "MIM",
          icon: useImage("assets/images/tokens/MIM.png"),
        },
        {
          id: SPELL_ID,
          name: "Spell",
          icon: useImage("assets/images/tokens/SPELL.png"),
        },
      ];
    },

    tokenSymbol() {
      return this.tabsInfo.find((tab) => tab.id === this.tokenType)?.name;
    },

    tokenIcon() {
      return this.tabsInfo.find((tab) => tab.id === this.tokenType)?.icon;
    },

    sendParam() {
      const extraOptions = this.dstTokenAmount
        ? Options.newOptions()
            .addExecutorNativeDropOption(
              this.dstTokenAmount,
              this.toAddressBytes
            )
            .toHex()
        : "0x";

      return {
        dstEid: this.toChainConfig?.settings.lzChainId, // uint32
        to: this.toAddressBytes, // bytes32
        amountLD: this.inputAmount, // uint256
        minAmountLD: removeDust(this.inputAmount), // uint256
        extraOptions, // bytes
        composeMsg: "0x", // bytes
        oftCmd: "0x", // bytes
      };
    },
  },

  watch: {
    inputAmount(value) {
      if (value === 0n) this.inputValue = "";
      else this.inputValue = trimZeroDecimals(formatUnits(value, 18));
    },

    fromChainId(value) {
      if (!value) return;
      if (this.toChainConfig && this.toChainId === value) this.toChainId = null;

      if (this.toChainConfig && this.fromChainConfig) {
        const isDisabled =
          this.fromChainConfig!.settings.disabledDestinationChains.includes(
            this.toChainConfig.chainId
          );

        if (isDisabled) this.toChainId = null;
      }

      if (this.beamInfoObject && this.fromChainConfig!.chainId !== value) {
        this.clearData();
        this.initBeamInfo(value);
      }
    },

    async toChainId() {
      if (this.beamInfoObject && this.fromChainConfig && this.toChainConfig) {
        this.estimateSendFee = await this.getEstimatedFees();
      }
    },

    account() {
      this.clearData();
      this.initBeamInfo(this.chainId || MAINNET_CHAIN_ID);
    },

    chainId(value) {
      if (this.fromChainId !== value) {
        this.clearData();
        this.initBeamInfo(value);
      }
    },

    // todo spell
    async tokenType() {
      const fromChainId = this.fromChainConfig?.chainId || 1;

      // this.fromChain = undefined;

      // this.toChain = undefined;
      this.isOpenNetworkPopup = false;
      this.isShowDstAddress = false;
      this.isSettingsOpened = false;

      const currentChain = this.beamInfoObject
        ? this.beamInfoObject.fromChainConfig.chainId
        : this.chainId;
      this.clearData();
      this.isLoadingBeamInfo = true;
      await this.initBeamInfo(currentChain);

      const chainConfig = this.beamInfoObject!.beamConfigs.find(
        (chain) => chain.chainId === fromChainId
      );

      if (this.tokenType === SPELL_ID) {
        // this.fromChain = this.beamInfoObject!.beamConfigs[0];
        // this.toChain = this.beamInfoObject!.beamConfigs[1];
        this.isLoadingBeamInfo = false;
        return;
      }

      // if (!chainConfig) {
      //   this.fromChain = this.beamInfoObject!.beamConfigs[0];
      // } else {
      //   this.fromChain = chainConfig;
      // }

      this.isLoadingBeamInfo = false;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({
      deleteNotification: "notifications/delete",
      updateNotification: "notifications/updateTitle",
    }),

    changeTokenType(type: number) {
      this.tokenType = type;
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

    async getEstimatedFees(getParams = false) {
      if (!this.toChainConfig || !this.fromChainConfig) return 0n;
      if (this.inputAmount === 0n) return 0n;
      if (!this.account) return 0n;

      this.isUpdateFeesData = true;

      if (this.isLzVersion2) {
        const fees = await quoteSendFee(this.fromChainConfig, this.sendParam);
        this.isUpdateFeesData = false;
        if (getParams) return fees;
        else return fees.nativeFee;
      } else {
        // @ts-ignore
        const { fees, params } = await getEstimateSendFee(
          this.fromChainConfig!,
          this.toChainConfig,
          this.account,
          this.dstTokenAmount,
          this.inputAmount
        );

        this.isUpdateFeesData = false;
        if (getParams) return { fees, params };
        else return fees;
      }
    },

    async updateDstNativeTokenAmount(value: bigint) {
      this.dstTokenAmount = value;
      this.estimateSendFee = await this.getEstimatedFees();
    },

    closeNetworkPopup() {
      this.isOpenNetworkPopup = false;
    },

    async changeChain(chainId: number, type: string) {
      if (type === "from") this.fromChainId = chainId;
      if (type === "to") this.toChainId = chainId;

      this.clearData();
    },

    // todo chainIds params
    async switchChains() {
      if (this.toChainConfig?.settings?.disabledFrom) return;

      const fromChainId = this.fromChainConfig!.chainId;
      const toChainId = this.toChainConfig!.chainId;

      this.fromChainId = toChainId;
      this.toChainId = fromChainId;

      this.clearData();

      await this.initBeamInfo(this.fromChainId);
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

    async actionHandler() {
      if (this.actionState.disable) return false;

      if (!this.account) return openConnectPopup();

      if (this.isWrongChain) {
        await switchNetwork(this.fromChainConfig!.chainId);
        return false;
      }

      const tokenContract: ContractInfo = {
        address: this.tokenConfig!.address as Address,
        abi: this.tokenConfig!.abi,
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

        const isTokenApproved = await approveToken(
          tokenContract,
          this.fromChainConfig!.contract.address,
          this.inputAmount
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

      if (this.isLzVersion2) {
        await this.seendBeamV2(notificationId);
      } else await this.seendBeam(notificationId);
    },

    async seendBeam(notificationId: number) {
      this.isBeaming = true;

      try {
        const { fees, params } = await this.getEstimatedFees(true);

        const payload = {
          fees,
          params,
          amount: this.inputAmount,
          dstLzChainId: this.toChainConfig!.settings.lzChainId,
          to: this.toAddressBytes,
          account: this.account,
        };

        const hash = await sendFrom(this.fromChainConfig, payload);

        this.deleteNotification(notificationId);
        this.isBeaming = false;

        const successPopupData = {
          originChain: {
            ...this.fromChainConfig,
          },
          dstChain: {
            ...this.toChainConfig,
          },
          txPayload: {
            ...payload,
            to: this.toAddress,
          },
          tokenType: this.tokenType,
          txHash: hash,
          dstNativeTokenAmount: this.dstTokenAmount,
        };

        this.successData = successPopupData;
        this.successData.tokenIcon = this.tokenIcon;
        this.isOpenSuccessPopup = true;
        await this.initBeamInfo(this.fromChainConfig!.chainId);
        this.clearData();
      } catch (error) {
        console.log("Seend Beam Error:", error);
        this.isBeaming = false;
        ErrorHandler.handleError(error as Error);
      }
    },

    async seendBeamV2(notificationId: number) {
      this.isBeaming = true;

      try {
        const fees = await this.getEstimatedFees(true);

        const hash = await sendLzV2(
          this.account,
          this.sendParam,
          this.fromChainConfig!,
          fees
        );

        this.deleteNotification(notificationId);

        this.isBeaming = false;

        const successPopupData = {
          originChain: {
            ...this.fromChainConfig,
          },
          dstChain: {
            ...this.toChainConfig,
          },
          txPayload: {
            fees: fees.nativeFee,
            dstLzChainId: this.toChainConfig!.settings.lzChainId,
            amount: this.inputAmount,
            account: this.account,
            to: this.toAddress,
          },
          tokenType: this.tokenType,
          txHash: hash,
          dstNativeTokenAmount: this.dstTokenAmount,
        };

        this.successData = successPopupData;
        this.successData.tokenIcon = this.tokenIcon;
        this.isOpenSuccessPopup = true;
        await this.initBeamInfo(this.fromChainConfig!.chainId);
        this.clearData();
      } catch (error) {
        console.log("Seend Beam Error:", error);
        this.isBeaming = false;
        ErrorHandler.handleError(error as Error);
      }
    },

    async initBeamInfo(chainId: number): Promise<number | undefined> {
      try {
        const configs = beamConfigs[this.tokenType as keyof typeof beamConfigs];
        const isChainIdValid = configs.some((item) => item.chainId === chainId);
        const beamChainId = isChainIdValid ? chainId : configs[0].chainId;

        this.beamInfoObject = await getBeamInfo(
          beamChainId,
          this.account,
          this.tokenType
        );

        return this.beamInfoObject.fromChainConfig.chainId;
      } catch (error) {
        console.log("Beam Info Error:", error);
      }
    },
  },

  async created() {
    this.fromChainId =
      (await this.initBeamInfo(this.chainId)) || MAINNET_CHAIN_ID;
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
  gap: 20px;
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

.tabs {
  display: flex;
  padding: 6px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(16, 18, 23, 0.38);
  backdrop-filter: blur(20px);
  max-width: 236px;
}

.tab-item {
  padding: 6px 24px;
  gap: 8px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: transparent;
  outline: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  line-height: normal;
  background: transparent;
  cursor: pointer;
}

.active {
  background: rgba(111, 111, 111, 0.06);
}

.tab-icon {
  width: 20px;
  height: 20px;
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

.row-skeleton {
  height: 82px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(73, 70, 97, 0.4);
  background-image: linear-gradient(
    90deg,
    rgba(8, 14, 31, 0.6) 0px,
    rgba(35, 41, 64, 1) 60px,
    rgba(19, 24, 42, 1) 120px
  );
  background-size: 1000px;
  animation: skeleton 1.6s infinite forwards;
}

.spell-message {
  position: absolute;
  top: 138px;
  right: -290px;
  padding: 28px 16px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  max-width: 261px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid var(--Primary-Gradient, #2d4a96);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  background: url("@/assets/images/beam/message-bg.png");
  background-repeat: no-repeat;
  background-size: cover;
}

@keyframes skeleton {
  0% {
    background-position: -100px;
  }

  50%,
  100% {
    background-position: 480px;
  }
}

@media (max-width: 1200px) {
  .beam {
    margin-top: 24px;
  }

  .spell-message {
    max-width: 100%;
    position: initial;
  }
}

@media (max-width: 600px) {
  .settings-btns {
    gap: 12px;
  }
}
</style>
