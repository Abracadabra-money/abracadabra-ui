<template>
  <div class="stake-list-page">
    <div class="stake-list-container">
      <StakeItemCard
        :stakeItem="item"
        v-for="(item, index) in stakeList"
        :key="index"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { stakeListConfig } from "@/configs/stake/stakeListConfig";
import type { StakeListItem } from "@/types/stake/stakeList";

export default {
  data() {
    return {
      stakeList: stakeListConfig as StakeListItem[],
      poolsLoading: true,
      updateInterval: null as NodeJS.Timeout | null,
    };
  },

  async created() {
    // this.stakeList = [];
    // this.poolsLoading = false;
    // this.updateInterval = setInterval(async () => {
    //   this.stakeList = [];
    // }, 60000);
  },

  beforeUnmount() {
    clearInterval(Number(this.updateInterval));
  },

  components: {
    StakeItemCard: defineAsyncComponent(
      () => import("@/components/stake/stakeList/StakeItemCard.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-list-page {
  min-height: 100vh;
  width: 100%;
  height: 100%;
}

.stake-list-container {
  padding: 125px 15px 100px;
  max-width: 1310px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 23px;
  flex-wrap: wrap;
}

@media (max-width: 1310px) {
  .stake-list-container {
    justify-content: center;
  }
}
</style>
