<template>
  <div class="backdrop">
    <div class="box-popup">
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
        :icon="mimIcon"
        name="MIM"
        :value="amount"
        @updateValue="amount = $event"
        :max="balance"
        :error="error"
      />

      <BaseButton @click="actionHandler" :disabled="isDisabled">{{
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
import filters from "@/filters/index.js";
import actions from "@/helpers/bentoBox/actions";
import { approveTokenViem } from "@/helpers/approval";
import { getChainIcon } from "@/helpers/chains/getChainIcon";
import { getChainById } from "@/helpers/chains/index";

import { formatUnits, parseUnits } from "viem";

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
      amount: "",
      mimIcon,
      updateInfoInterval: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),

    parsedAmount() {
      return parseUnits(this.amount, 18);
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

      return formatUnits(balance.toString(), 18);
    },

    isDisabled() {
      return !this.isValid || !!this.error;
    },

    isValid() {
      return !!this.parsedAmount;
    },

    error() {
      if (+this.amount > +this.balance)
        return `The value cannot be greater than ${this.balance}`;
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

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    getChainIcon,

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

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
  position: absolute;
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
  background: #101622;
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
  font-size: 18px;
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
</style>
