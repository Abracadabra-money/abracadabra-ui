<template>
  <div class="backdrop" @click.self="closePopup">
    <div :class="['box-popup', isBento ? 'bento-bg' : 'degen-bg']">
      <div class="box-header">
        <p class="title">
          <img class="bento-img" :src="boxIcon" alt="Box" />
          {{ title }} withdraw
        </p>

        <img
          class="close-img"
          src="@/assets/images/cross.svg"
          alt="Close popup"
          @click="closePopup"
        />
      </div>

      <p class="description">
        <span class="desc-line"> Withdraw your MIM from {{ title }} on </span>
        <span class="desc-line">
          <img :src="getChainIcon(infoObject.chainId)" class="mim-symbol" />
          {{ chainInfo.name }} network
        </span>
      </p>

      <BaseTokenInput
        class="withdraw-input"
        name="MIM"
        :icon="mimIcon"
        :decimals="18"
        :value="inputValue"
        @updateInputValue="onUpdateValue"
        :max="balance"
        :error="error"
        isBigNumber
      />

      <BaseButton @click="actionHandler" primary :disabled="isDisabled">{{
        buttonText
      }}</BaseButton>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import degenIcon from "@/assets/images/degenbox.svg";
import bentoIcon from "@/assets/images/bento-box.jpeg";
import mimIcon from "@/assets/images/tokens/MIM.png";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification.js";
import { formatTokenBalance } from "@/helpers/filters";
import actions from "@/helpers/bentoBox/actions";
import { approveTokenViem } from "@/helpers/approval";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { getChainById } from "@/helpers/chains/index";
import { trimZeroDecimals } from "@/helpers/numbers";
import { formatUnits, parseUnits } from "viem";
import { BigNumber, utils } from "ethers";

export default {
  props: {
    infoObject: {
      type: Object,
      required: true,
    },
    isBento: { type: Boolean, default: false },
    isDeposit: { type: Boolean, default: false },
  },

  data() {
    return {
      inputValue: "",
      inputAmount: BigNumber.from(0),
      mimIcon,
      updateInfoInterval: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),

    parsedAmount() {
      return parseUnits(this.inputValue, 18);
    },

    boxIcon() {
      return this.isBento ? bentoIcon : degenIcon;
    },

    activeContract() {
      return this.isBento
        ? this.infoObject.bentoContractInfo
        : this.infoObject.degenContractInfo;
    },

    isApproved() {
      return this.isBento
        ? this.infoObject.bentoAllowance > this.parsedAmount
        : this.infoObject.degenAllowance > this.parsedAmount;
    },

    balance() {
      const balance = this.isDeposit
        ? this.infoObject.mimBalance
        : this.isBento
        ? this.infoObject.mimInBentoBalance
        : this.infoObject.mimInDegenBalance;

      return balance;
    },

    isDisabled() {
      return !this.isValid || !!this.error;
    },

    isValid() {
      return !!this.parsedAmount;
    },

    error() {
      if (+this.inputValue > formatUnits(this.balance, 18))
        return `The value cannot be greater than ${formatUnits(
          this.balance,
          18
        )}`;
      return null;
    },

    title() {
      return `${this.isBento ? "BentoBox" : "DegenBox"} `;
    },

    buttonText() {
      return this.isDeposit ? "Deposit" : "Withdraw";
    },

    chainInfo() {
      return getChainById(this.infoObject.chainId);
    },
  },

  watch: {
    inputAmount(value) {
      if (value.eq(0)) {
        this.inputValue = "";
        return false;
      }

      this.inputValue = trimZeroDecimals(utils.formatUnits(value, 18));
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    getChainIcon,
    formatTokenBalance,

    async actionHandler() {
      if (this.isDisabled) return false;
      await this.withdraw();
    },

    async withdraw() {
      const notificationId = await this.createNotification(
        notification.pending
      );
      const tokenAddress = this.infoObject.tokenInfo.address;
      const contractInfo = {
        address: this.activeContract.address,
        abi: this.activeContract.abi,
      };

      const { error } = await actions.withdraw(
        contractInfo,
        tokenAddress,
        this.account,
        this.parsedAmount
      );

      if (error) {
        const errorNotification = {
          msg: await notificationErrorMsg({ message: error.msg }),
          type: "error",
        };
        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      } else {
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }

      this.closePopup();
    },

    async approveToken() {
      if (this.isDisabled) return false;
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const mimContractInfo = {
        address: this.infoObject.tokenInfo.address,
        abi: this.infoObject.tokenInfo.abi,
      };

      const approve = await approveTokenViem(
        mimContractInfo,
        this.activeContract.address
      );

      if (approve) await await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);

      return false;
    },

    setEmptyState() {
      this.inputAmount = BigNumber.from(0);
      this.inputValue = "";
    },

    onUpdateValue(value) {
      if (value === null) return this.setEmptyState();
      this.inputAmount = value;
    },

    closePopup() {
      this.$emit("close");
    },
  },

  beforeUnmount() {
    clearInterval(this.updateInfoInterval);
  },

  components: { BaseTokenInput, BaseButton },
};
</script>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 300;
  display: flex;
  justify-content: center;
  background: rgba(25, 25, 25, 0.1);
  backdrop-filter: blur(10px);
}

.bento-bg {
  background: url("../../assets/images/myPositions/bento-popup-img-big.png"),
    #101622;
}

.degen-bg {
  background: url("../../assets/images/myPositions/degen-popup-img-big.png"),
    #101622;
}

.box-popup {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 24px;
  padding: 32px;
  width: 533px;
  max-width: 100%;
  height: 351px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-repeat: no-repeat;
  background-position: 100% 100%;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  margin-top: 270px;
}

.box-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.bento-img {
  width: 33px;
  object-fit: contain;
  margin-right: 8px;
}

.close-img {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.close-img:hover {
  opacity: 0.7;
}

.title {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 24px;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.desc-line {
  display: flex;
  align-items: center;
  gap: 4px;
}

.withdraw-input {
  width: 100%;
}

@media screen and (max-width: 600px) {
  .bento-bg {
    background: url("../../assets/images/myPositions/bento-popup-img-small.png"),
      #101622;
  }

  .degen-bg {
    background: url("../../assets/images/myPositions/degen-popup-img-small.png"),
      #101622;
  }

  .box-popup {
    position: fixed;
    width: 100%;
    max-width: 100%;
    height: 100vh;
    border-radius: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-repeat: no-repeat;
    background-position: -80px 100%;
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
    backdrop-filter: blur(12.5px);
    margin-top: 0;
  }

  .title {
    font-size: 18px;
    font-weight: 500;
  }

  .desc-line {
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
