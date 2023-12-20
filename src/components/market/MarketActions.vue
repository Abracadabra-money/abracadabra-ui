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
      "
    ></div>

    <div class="deposit-block">
      <div>
        <div class="row">
          <h3 class="title">Deposit collateral</h3>

          <Toggle
            :selected="useOtherToken"
            text="Use magicGLP"
            @updateToggle="updateActiveToken"
          />
        </div>
        <h4 class="subtitle">
          Select the amount of GLP to deposit in the Cauldron
        </h4>
      </div>

      <div
        style="
          height: 79px;
          border-radius: 16px;
          border: 1px solid rgba(73, 70, 97, 0.4);
          background: rgba(8, 14, 31, 0.6);
        "
      ></div>
    </div>

    <div class="borrow-block">
      <div>
        <div class="row">
          <h3 class="title">Borrow MIM</h3>

          <Toggle
            :selected="useLeverage"
            text="Leverage"
            @updateToggle="updateActionType"
          />
        </div>

        <h4 class="subtitle">
          Select the amount of MIM to borrow from the Cauldron
        </h4>
      </div>

      <div
        style="
          height: 79px;
          border-radius: 16px;
          border: 1px solid rgba(73, 70, 97, 0.4);
          background: rgba(8, 14, 31, 0.6);
        "
      ></div>

      <div style="height: 80px"></div>

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
  data() {
    return {
      useOtherToken: true,
      useLeverage: false,
    };
  },

  methods: {
    updateActiveToken() {
      this.useOtherToken = !this.useOtherToken;
    },

    updateActionType() {
      this.useLeverage = !this.useLeverage;
    },

    updateMultiplier(value: any) {
      console.log("1111", value);
    },
  },

  components: {
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
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

.deposit-block,
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

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 0.45px;
}

.subtitle {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
}
</style>
