<template>
  <div class="pool-creation-view">
    <div class="pool-creation-wrap">
      <div class="actions-block">
        <h3 class="pool-creation-title">Pool Creation</h3>

        <div class="action-form">
          <TokensSelector />

          <PriceSelector />

          <FeeTierSelector />

          <BaseButton primary>Create</BaseButton>
        </div>
      </div>

      <div class="pool-creation-info-wrap">
        <CreationTypeTabs />
        <PoolCreationInfo @openSlippagePopup="slippagePopupOpened = true" />
      </div>
    </div>

    <SlippageCoefficientPopup
      v-if="slippagePopupOpened"
      @close="slippagePopupOpened = !slippagePopupOpened"
    />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      slippagePopupOpened: false,
    };
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    TokensSelector: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/TokensSelector.vue")
    ),
    PriceSelector: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/PriceSelector.vue")
    ),
    FeeTierSelector: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/FeeTierSelector.vue")
    ),
    CreationTypeTabs: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/CreationTypeTabs.vue")
    ),
    PoolCreationInfo: defineAsyncComponent(
      () => import("@/components/pools/poolCreation/PoolCreationInfo.vue")
    ),
    SlippageCoefficientPopup: defineAsyncComponent(
      () =>
        import(
          "@/components/pools/poolCreation/popups/SlippageCoefficientPopup.vue"
        )
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-creation-view {
  min-height: 100vh;
}

.pool-creation-wrap {
  position: relative;
  max-width: 1310px;
  width: 100%;
  padding: 124px 15px 90px;
  display: grid;
  grid-template-columns: 520px 1fr;
  grid-gap: 24px;
  margin: 0 auto;
}

.actions-block {
  gap: 20px;
  display: flex;
  flex-direction: column;
}

.action-form {
  @include block-wrap;
  gap: 40px;
  display: flex;
  flex-direction: column;
}

.action-form::v-deep(.action-title) {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  font-weight: 500;
}

.pool-creation-info-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media screen and (max-width: 1200px) {
  .pool-creation-wrap {
    grid-template-columns: 400px 1fr;
  }
}

@media screen and (max-width: 1024px) {
  .pool-creation-wrap {
    grid-template-columns: 100%;
    grid-template-rows: auto;
  }
}

@media screen and (max-width: 600px) {
  .action-form {
    padding: 16px;
  }
}
</style>
