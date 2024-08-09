<template>
  <div class="popup-content">
    <h3 class="title">Mint MIM against stdeUSD</h3>

    <div class="popup-content-wrap">
      <div class="notification-wrap">
        <img
          class="notification-image"
          src="@/assets/images/notification-icons/info-icon.png"
        />
        <p class="notification-text">
          Important Notice: Deleveraging Efficiency Depends on deUSD / stdeUSD
          Liquidity
        </p>
      </div>

      <p class="description-text">
        Please be aware that deleveraging will not always be automatic and may
        become a challenging, manual process. A sudden lack of staked deUSD
        liquidity could hinder your ability to deleverage efficiently, or at
        all, unless you have substantial additional capital in MIM, held outside
        of your position. This situation could lead to significant risks and
        complications. Always check liquidity before proceeding.
      </p>

      <p class="repayment">
        You will need to repay
        <span class="mim-repay">
          <BaseTokenIcon :icon="mimIcon" name="MIM" size="24px" />
          {{ formattedAmountToRepay }}
          MIM
        </span>
        to unwind
      </p>

      <BaseButton @click="confirmAction" primary>Got it</BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";
import mimIcon from "@/assets/images/tokens/MIM.png";
import { expectedAlternativeBorrowMimAmount } from "@/helpers/cauldron/getExpectedPosition";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    actionConfig: {
      type: Object as any,
    },
  },

  data() {
    return { mimIcon };
  },

  computed: {
    formattedAmountToRepay() {
      const { userPosition, mainParams } = this.cauldron;
      const { borrowFee } = mainParams;
      const { userBorrowAmount } = userPosition.alternativeData.borrowInfo;

      const expectedRepayAmount = expectedAlternativeBorrowMimAmount(
        userBorrowAmount,
        this.actionConfig,
        borrowFee
      );
      return formatTokenBalance(formatUnits(expectedRepayAmount, 18));
    },
  },

  methods: {
    confirmAction() {
      this.$emit("confirmAction");
    },
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.popup-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.title {
  font-size: 24px;
  font-weight: 500;
}

.popup-content-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.notification-image {
  width: 52px;
  height: 52px;
}

.notification-text,
.description-text,
.repayment {
  font-size: 16px;
  font-weight: 400;
}

.repayment {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 24px;
}

.mim-repay {
  display: flex;
  align-items: center;
}
</style>
