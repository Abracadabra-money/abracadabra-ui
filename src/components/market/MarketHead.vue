<template>
  <div class="market-head-wrap">
    <div class="market-head">
      <div class="column">
        <div class="token-info-wrap">
          <TokenInfo />
        </div>

        <IconButton wallet />
        <IconButton link tag-name="a" href="https://etherscan.io/" />

        <BaseLink href="google.com" target="_blank" text="DEGENBOX" />
        <BaseLink href="google.com" target="_blank" text="GET LP’s" />
      </div>

      <div class="column">
        <InfoButton title="Chain" value="ARB" />
        <InfoButton title="TMB" value="8.88m" />
        <InfoButton title="TVL" value="8.88m" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  components: {
    TokenInfo: defineAsyncComponent(
      () => import("@/components/market/TokenInfo.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
    BaseLink: defineAsyncComponent(
      () => import("@/components/ui/links/BaseLink.vue")
    ),
    InfoButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/InfoButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-head-wrap {
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.07) 0%,
    rgba(116, 92, 210, 0.07) 100%
  );
  backdrop-filter: blur(10.75px);
}

.market-head {
  max-width: 1310px;
  width: 100%;
  padding: 4px 15px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.column {
  gap: 8px;
  display: flex;
  align-items: center;
}

.token-info-wrap {
  margin-right: 16px;
}
</style>
