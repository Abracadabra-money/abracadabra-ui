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
import { dataRefresher, type RefresherInfo } from "@/helpers/dataRefresher";

export default {
  data() {
    return {
      stakeList: [] as StakeListItem[],
      refresherInfo: {
        refresher: null as unknown as dataRefresher<StakeListItem[]>,
        remainingTime: 0,
        isLoading: false,
        intervalTime: 60,
      } as RefresherInfo<StakeListItem[]>,
    };
  },

  methods: {
    fetchStakeListData: async function (): Promise<StakeListItem[]> {
      return getStakeList();
    },

    createDataRefresher() {
      this.refresherInfo.refresher = new dataRefresher<StakeListItem[]>(
        this.fetchStakeListData.bind(this),
        this.refresherInfo.intervalTime,
        (time) => (this.refresherInfo.remainingTime = time),
        (loading) => (this.refresherInfo.isLoading = loading),
        (updatedData: StakeListItem[]) => {
          this.stakeList = updatedData;
        }
      );
    },

    async createOrUpdateInfo() {
      const refresher = this.refresherInfo?.refresher;
      try {
        if (!refresher) {
          this.createDataRefresher();
          await this.refresherInfo.refresher.start();
        } else {
          await refresher.manualUpdate();
        }
      } catch (error) {
        console.error("Error creating or updating StakeList info:", error);
      }
    },
  },

  async created() {
    await this.createOrUpdateInfo();
  },

  beforeUnmount() {
    if (this.refresherInfo.refresher) {
      this.refresherInfo.refresher.stop();
    }
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
