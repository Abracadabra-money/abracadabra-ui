<template>
  <div class="token-info">
    <CauldronIcon />

    <ArrowRightIcon />

    <div class="icons-wrap">
      <img
        class="token-icon"
        src="@/assets/images/tokens/AETH.png"
        alt="Token icon"
      />

      <img class="chain-icon" :src="getChainIcon(42161)" alt="" />
    </div>

    <div>
      <div class="token-name">MagicGLP</div>
      <div class="tokens-rate">1 GLP = 4 MIM</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { getChainIcon } from "@/helpers/chains/getChainIcon";

export default {
  methods: { getChainIcon },

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
  @include font;
  display: flex;
  gap: 8px;
  align-items: center;
}

.icons-wrap {
  position: relative;
  width: 50px;
  height: 50px;
  margin-right: 6px;
}

.token-icon {
  width: 50px;
  height: 50px;
}

.chain-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  position: absolute;
  top: -5px;
  right: -10px;
  border: 1px solid #0d1427;
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
