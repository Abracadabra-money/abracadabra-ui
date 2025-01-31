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
import type { StakeListItem } from "@/types/stake/stakeList";
import { getStakeList } from "@/helpers/stake/stakeList/getStakeList";

export default {
  data() {
    return {
      stakeList: [] as StakeListItem[],
    };
  },

  async created() {
    this.stakeList = getStakeList();
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
