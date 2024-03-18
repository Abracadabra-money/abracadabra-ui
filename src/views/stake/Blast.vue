<template>
  <div class="stake-view">
    <div class="stake-wrap" v-if="stakeInfo">
      <BlastHead
        class="head"
        :mobileMode="mobileMode"
        :currentMobileTab="currentMobileTab"
        @changeActionTab="changeActionTab"
        @changeCurrentMobileTab="changeCurrentMobileTab"
      />

      <ActionBlock
        class="action"
        :stakeInfo="stakeInfo"
        :actionActiveTab="actionActiveTab"
        :userPointsEarned="userPointsEarned"
        :mobileMode="mobileMode"
        @updateStakeInfo="createStakeInfo"
        v-if="isActionTab"
      />

      <StakeInfo
        class="info"
        :stakeInfo="stakeInfo"
        :pointsStatistics="pointsStatistics"
        :mobileMode="mobileMode"
        v-if="isInfoTab"
      />
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
      actionActiveTab: "Withdraw",
      currentMobileTab: 0,
      mobileMode: false,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),

    isActionTab() {
      if (!this.mobileMode) return true;
      return this.currentMobileTab == 0;
    },

    isInfoTab() {
      if (!this.mobileMode) return true;
      return this.currentMobileTab == 1;
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    changeActionTab(action: string) {
      this.actionActiveTab = action;
    },

    changeCurrentMobileTab(newTabIndex: number) {
      this.currentMobileTab = newTabIndex;
    },

    async createStakeInfo() {
      this.stakeInfo = await getStakeInfo(this.account);
      this.userPointsEarned = await fetchUserPointsStatistics(this.account);
      this.pointsStatistics = await fetchPointsStatistics();
    },

    getWindowSize() {
      if (window.innerWidth <= 600) this.mobileMode = true;
      else {
        this.mobileMode = false;
        this.currentMobileTab = 0;
      }
    },
  },

  async created() {
    await this.createStakeInfo();

    this.getWindowSize();
    window.addEventListener("resize", this.getWindowSize, false);

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
    window.removeEventListener("resize", this.getWindowSize);
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
    BlastHead: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/BlastHead.vue")
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
  grid-template-areas: "head info" "action info";
  grid-gap: 24px;
  margin: 0 auto;
}

.head {
  grid-area: head;
}

.action {
  grid-area: action;
}

.info {
  grid-area: info;
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

@media screen and (max-width: 1200px) {
  .stake-wrap {
    display: flex;
    flex-direction: column;
  }
}
</style>
