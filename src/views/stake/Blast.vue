<template>
  <div class="stake-view">
    <div class="stake-wrap" v-if="stakeInfo">
      <ActionBlock :stakeInfo="stakeInfo" @updateStakeInfo="createStakeInfo" />

      <StakeInfo :stakeInfo="stakeInfo" :pointsStatistics="pointsStatistics" />
    </div>

    <div class="loader-wrap" v-else>
      <BaseLoader large text="Loading stake" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  fetchPointsStatistics,
  fetchUserPointsStatistics,
} from "@/helpers/blast/stake/points";
import { defineAsyncComponent } from "vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getStakeInfo } from "@/helpers/blast/stake/getStakeInfo";

export default {
  data() {
    return {
      stakeInfo: null as any,
      updateInterval: null as any,
      userPointsEarned: 0 as any,
      pointsStatistics: null as any,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),
    async createStakeInfo() {
      this.stakeInfo = await getStakeInfo(this.account);
      this.userPointsEarned = await fetchUserPointsStatistics(this.account);
      this.pointsStatistics = await fetchPointsStatistics();
    },
  },

  async created() {
    await this.createStakeInfo();

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    ActionBlock: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/Actionsblock.vue")
    ),
    StakeInfo: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/StakeInfo.vue")
    ),
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-view {
  min-height: 100vh;
}

.stake-wrap {
  position: relative;
  max-width: 1310px;
  width: 100%;
  padding: 124px 15px 90px;
  display: grid;
  grid-template-columns: 520px 1fr;
  grid-gap: 24px;
  margin: 0 auto;
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

@media screen and (max-width: 1200px) {
  .stake-wrap {
    grid-template-columns: 100%;
    grid-template-rows: auto;
  }
}
</style>
