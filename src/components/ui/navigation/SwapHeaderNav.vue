<template>
  <HeaderLink to="MimSwap">Swap</HeaderLink>
  <HeaderLink to="Pools">Pools</HeaderLink>
  <HeaderLink to="PotionPoints">
    <img
      class="link-icon"
      src="@/assets/images/potion/potion-icon.png"
      alt="Potion icon"
    />
    Potion
  </HeaderLink>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      blastMimUsdbPool: {
        id: 1,
        poolChainId: 81457,
      },
    };
  },

  components: {
    HeaderLink: defineAsyncComponent(() =>
      import("@/components/ui/links/HeaderLink.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.link-icon {
  width: 20px;
  height: 20px;
}
</style>
