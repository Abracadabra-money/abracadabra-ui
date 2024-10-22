<template>
  <HeaderLink to="MimSwap">Swap</HeaderLink>
  <HeaderLink to="Pools">Pools</HeaderLink>
  <!-- <HeaderLink to="PotionPoints">
    <img
      class="link-icon"
      src="@/assets/images/potion/potion-icon.png"
      alt="Potion icon"
    />
    Potions
  </HeaderLink> -->
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
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
