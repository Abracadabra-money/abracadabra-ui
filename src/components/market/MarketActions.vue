<template>
  <div class="market-actions-wrap">
    <div
      class="tabs-wrap"
      style="
        height: 48px;
        width: 215px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.04);
        background: rgba(16, 18, 23, 0.38);
        display: flex;
        justify-content: space-between;
      "
    ></div>

    <div class="block-wrap">
      <DepositForm
        :useUnwrapToken="useUnwrapToken"
        :cauldron="cauldron"
        @updateActiveToken="updateActiveToken"
        @updateCollateralValues="updateCollateralValues"
      />
    </div>

    <div class="borrow-block">
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

      <template v-if="!useLeverage">
        <div
          style="
            height: 79px;
            border-radius: 16px;
            border: 1px solid rgba(73, 70, 97, 0.4);
            background: rgba(8, 14, 31, 0.6);
          "
        ></div>
        <LtvRange
          :value="multiplier"
          :max="10"
          :min="0"
          :step="0.1"
          :risk="'medium'"
          :collateralValue="5"
          :disabled="false"
          tooltipText="Allows users to leverage their position. Read more about this in the documents!"
          @updateValue="updateMultiplier"
        />
      </template>

      <template v-else>
        <LeverageRange
          :value="multiplier"
          :max="10.999999"
          :min="0"
          :step="0.1"
          :risk="'medium'"
          :collateralValue="1"
          :disabled="false"
          tooltipText="Allows users to leverage their position. Read more about this in the documents!"
          @updateValue="updateMultiplier"
        />

        <div class="dynamic-fee">
          <div class="dynamic-fee-title">
            Dynamic Opening Fee
            <TooltipIcon
              :width="20"
              :height="20"
              fill="#878B93"
              tooltip="Dynamic Opening Fee"
            />
          </div>
          <div class="dynamic-fee-value">$8.88 / 0.13%</div>
        </div>
      </template>

      <div
        style="
          height: 48px;
          border-radius: 16px;
          background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
        "
      ></div>
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
      multiplier: 0,
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

    updateMultiplier(value: any) {
      this.multiplier = value;
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
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    LtvRange: defineAsyncComponent(
      () => import("@/components/ui/range/LtvRange.vue")
    ),
    LeverageRange: defineAsyncComponent(
      () => import("@/components/ui/range/LeverageRange.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
    TooltipIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/Tooltip.vue")
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

.block-wrap {
  @include block-wrap;
}

.borrow-block {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.borrow-block {
  height: 350px;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
