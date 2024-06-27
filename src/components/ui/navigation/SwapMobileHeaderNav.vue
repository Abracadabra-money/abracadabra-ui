<template>
  <nav>
    <ul class="popup-links">
      <li @click="$emit('close-popup')">
        <MobileHeaderLink to="MimSwap">
          <img src="@/assets/images/header/dropdown/more/swap-icon.svg" />
          MimSwap
        </MobileHeaderLink>
      </li>

      <li @click="$emit('close-popup')">
        <MobileHeaderLink to="Pools">
          <img src="@/assets/images/header/dropdown/more/pool-icon.png" />
          Pools
        </MobileHeaderLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
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

  methods: {
    closePopup() {
      this.$emit("close-popup");
    },
  },

  components: {
    MobileHeaderLink: defineAsyncComponent(
      () => import("@/components/ui/links/MobileHeaderLink.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.popup-links {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 23px;
  list-style: none;
}
</style>
