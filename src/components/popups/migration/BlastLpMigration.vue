<template>
  <div class="popup">
    <img
      class="close-btn"
      @click="closePopup"
      src="@/assets/images/close.svg"
      alt="close"
    />

    <BaseStep
      v-if="steap === 1"
      :poolInfo="popupData.poolInfo"
      :userInfo="popupData.userInfo"
      :availableAmount="availableAmount"
      @changeSteap="changeSteap"
    />

    <UnstakeStep
      v-if="steap === 2"
      :poolInfo="popupData.poolInfo"
      :availableAmount="availableAmount"
      :previewRemoveLiquidityResult="previewRemoveLiquidityResult"
      @changeSteap="steap = 3"
    />

    <MigrateStep
      v-if="steap === 3"
      :userInfo="popupData.userInfo"
      :poolInfo="popupData.poolInfo"
      :availableAmount="availableAmount"
      :previewRemoveLiquidityResult="previewRemoveLiquidityResult"
    />
  </div>
</template>

<script lang="ts">
import store from "@/store";
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import type { UserInfo } from "@/helpers/blastLpMigration/getUserInfo";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { applySlippageToMinOutBigInt } from "@/helpers/gm/applySlippageToMinOut";

export default {
  data() {
    return {
      userInfo: null as null | UserInfo,
      poolInfo: null as any,
      steap: 1,
      slippage: 100n,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", popupData: "getPopupData" }),

    availableAmount() {
      if (!this.popupData.userInfo) return 0n;

      const { amountAllowed, amountAllowedInitial } = this.popupData.userInfo;
      const { initialized, amount } = amountAllowed;

      if (initialized) return amount;

      return amountAllowedInitial;
    },

    previewRemoveLiquidityResult() {
      if (!this.popupData.poolInfo || !this.popupData.userInfo)
        return { baseAmountOut: 0n, quoteAmountOut: 0n };

      const previewRemoveLiquidityResult = previewRemoveLiquidity(
        this.popupData.userInfo.amountAllowedInitial,
        this.popupData.poolInfo
      );

      previewRemoveLiquidityResult.baseAmountOut = applySlippageToMinOutBigInt(
        this.slippage,
        previewRemoveLiquidityResult.baseAmountOut
      );

      previewRemoveLiquidityResult.quoteAmountOut = applySlippageToMinOutBigInt(
        this.slippage,
        previewRemoveLiquidityResult.quoteAmountOut
      );

      return previewRemoveLiquidityResult;
    },
  },

  methods: {
    closePopup() {
      store.commit("closePopups");
    },

    changeSteap(steap: number) {
      this.steap = steap;
    },
  },

  components: {
    BaseStep: defineAsyncComponent(
      () => import("@/components/popups/migration/BaseStep.vue")
    ),
    UnstakeStep: defineAsyncComponent(
      () => import("@/components/popups/migration/UnstakeStep.vue")
    ),
    MigrateStep: defineAsyncComponent(
      () => import("@/components/popups/migration/MigrateStep.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.popup {
  position: relative;
  gap: 24px;
  display: flex;
  flex-direction: column;
  max-width: 534px;
  width: 100%;
  padding: 32px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.close-btn {
  width: 24px;
  height: 24px;
  cursor: pointer;
  position: absolute;
  top: 32px;
  right: 32px;
}
</style>
