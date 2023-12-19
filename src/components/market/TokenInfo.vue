<template>
  <div class="token-info">
    <CauldronIcon />

    <ArrowRightIcon />

    <img
      class="token-icon"
      src="@/assets/images/tokens/AETH.png"
      alt="Token icon"
    />

    <div>
      <div class="token-name">MagicGLP</div>
      <div class="tokens-rate">1 GLP = 4 MIM</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  components: {
    CauldronIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/CauldronIcon.vue")
    ),
    ArrowRightIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/ArrowRightIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.token-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.token-icon {
  width: 50px;
  height: 50px;
  margin-right: 6px;
}

.token-name {
  font-size: 28px;
  font-weight: 600;
  line-height: 150%;
}

.tokens-rate {
  color: #787a9b;
  font-size: 12px;
  font-weight: 400;
  line-height: 150%;
}
</style>
