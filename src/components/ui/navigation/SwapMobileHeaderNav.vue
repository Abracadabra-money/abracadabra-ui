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

      <li @click="$emit('close-popup')">
        <MobileHeaderLink to="PoolFarms">
          <img src="@/assets/images/header/dropdown/more/pool-farms-icon.svg" />
          Farms
        </MobileHeaderLink>
      </li>
      <!-- <li @click="$emit('close-popup')">
        <MobileHeaderLink to="PotionPoints">
          <img src="@/assets/images/potion/potion-icon.png" />
          Potions
        </MobileHeaderLink>
      </li> -->
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";

export default {
  methods: {
    closePopup() {
      this.$emit("close-popup");
    },
  },

  components: {
    MobileHeaderLink: defineAsyncComponent(
      // @ts-ignore
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
