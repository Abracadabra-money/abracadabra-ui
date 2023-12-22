<template>
  <div class="market-actions-wrap">
    <div class="deposit-wrap">
      <DepositForm
        :useUnwrapToken="useUnwrapToken"
        :cauldron="cauldron"
        @updateActiveToken="updateActiveToken"
        @updateCollateralValues="updateCollateralValues"
      />
    </div>

    <div class="borrow-wrap">
      <div>
        <div class="row">
          <h3 class="title">
            {{ borrowBlockTitle }} <IconButton seting v-if="useLeverage" />
          </h3>

          <Toggle
            :selected="useLeverage"
            text="Leverage"
            @updateToggle="updateActionType"
          />
        </div>

        <h4 class="subtitle">{{ borrowBlockSubtitle }}</h4>
      </div>

      <LeverageForm v-if="useLeverage" :cauldron="cauldron" />
      <BorrowForm v-else :cauldron="cauldron" />

      <!-- :disabled="isButtonDisabled" -->
      <BaseButton @click="$emit('actionHandler')" primary>Borrow </BaseButton>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
    useUnwrapToken: {
      type: Boolean,
    },
  },

  data() {
    return {
      useLeverage: false,
    };
  },

  computed: {
    borrowBlockTitle() {
      if (this.useLeverage) return "Leverage Up";
      return "Borrow MIM";
    },

    borrowBlockSubtitle() {
      if (this.useLeverage) return "Select leverage ‘’x’’";
      return "Select the amount of MIM to borrow from the Cauldron";
    },
  },

  methods: {
    updateCollateralValues(value: any) {
      this.$emit("updateCollateralValues", value);
    },

    updateActiveToken() {
      this.$emit("updateActiveToken");
    },

    updateActionType() {
      this.useLeverage = !this.useLeverage;
    },
  },

  components: {
    DepositForm: defineAsyncComponent(
      () => import("@/components/market/DepositForm.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    BorrowForm: defineAsyncComponent(
      () => import("@/components/market/BorrowForm.vue")
    ),
    LeverageForm: defineAsyncComponent(
      () => import("@/components/market/LeverageForm.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-actions-wrap {
  @include font;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 410px;
  width: 100%;
}

.deposit-wrap {
  @include block-wrap;
}

.borrow-wrap {
  @include block-wrap;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 370px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.title {
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
}

.dynamic-fee {
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dynamic-fee-title {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  display: flex;
  gap: 4px;
  align-items: center;
}

.dynamic-fee-value {
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  text-transform: uppercase;
}
</style>
