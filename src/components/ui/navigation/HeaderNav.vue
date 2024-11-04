<template>
  <HeaderLink to="Cauldrons">Cauldrons</HeaderLink>

  <HeaderLink to="StakeList">Stake</HeaderLink>

  <!-- <HeaderStakeDropdown /> -->

  <HeaderMoreDropdown />

  <HeaderLink to="MyPositions">My Positions</HeaderLink>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  components: {
    HeaderLink: defineAsyncComponent(() =>
      import("@/components/ui/links/HeaderLink.vue")
    ),
    HeaderMoreDropdown: defineAsyncComponent(() =>
      import("@/components/ui/dropdown/HeaderMoreDropdown.vue")
    ),
    // HeaderStakeDropdown: defineAsyncComponent(() =>
    //   import("@/components/ui/dropdown/HeaderStakeDropdown.vue")
    // ),
  },
};
</script>

<style lang="scss" scoped></style>
