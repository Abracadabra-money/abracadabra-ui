<template>
  <HeaderLink to="Cauldrons">Cauldrons</HeaderLink>

  <HeaderLink to="BSpell">
    <img class="bspell-icon" src="@/assets/images/header/bSpell.png" alt="" />
    bSpell</HeaderLink
  >

  <HeaderMenuDropdown />
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  components: {
    HeaderLink: defineAsyncComponent(
      () => import("@/components/ui/links/HeaderLink.vue")
    ),
    HeaderMenuDropdown: defineAsyncComponent(
      // @ts-ignore
      () => import("@/components/ui/dropdown/HeaderMenuDropdown.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.bspell-icon {
  width: 24px;
  height: 24px;
}
</style>
