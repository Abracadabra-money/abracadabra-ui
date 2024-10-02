<template>
  <div class="stake-view">

    <div class="actions-wrap" v-if="stakeInfo">
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
          :mobileMode="mobileMode"
          @updateStakeInfo="createStakeInfo"
        />
      </div>

    <div class="loader-wrap" v-else>
      <BaseLoader large text="Loading stake" />
    </div>
  </div>
</template>

<script lang="ts">
//@ts-nocheck
import { defineAsyncComponent } from "vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { getStakeInfo } from "@/helpers/blast/stake/getStakeInfo";
import moment from "moment";

export default {
  data() {
    return {
      stakeInfo: null as any,
      updateInterval: null as any,
      actionActiveTab: "Withdraw",
      currentMobileTab: 0,
      mobileMode: false,
      timerInterval: null as any,
      timeInfo: {
        percentagePassed: 0,
        timerValues: ["00m", "00s"],
      },
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),
  },

  methods: {
    changeActionTab(action: string) {
      this.actionActiveTab = action;
    },

    async createStakeInfo() {
      [this.stakeInfo] = await Promise.all([getStakeInfo(this.account)]);
    },

    stopIntervals() {
      clearInterval(this.updateInterval);
    },

    createIntervals() {
      this.updateInterval = setInterval(async () => {
        await this.createStakeInfo();
      }, 60000);
    },
  },

  async created() {
    await this.createStakeInfo();

    this.createIntervals();
  },

  beforeUnmount() {
    this.stopIntervals();
  },

  components: {
    ActionBlock: defineAsyncComponent(
      () => import("@/components/stake/earnPoints/Actionsblock.vue")
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
  padding: 40px 15px 90px;
  display: grid;
  grid-template-columns: 520px 1fr;
  grid-template-areas: "head info" "action info";
  grid-gap: 24px;
  margin: 0 auto;
}

.actions-wrap {
  gap: 32px;
  display: flex;
  flex-direction: column;
  max-width: 520px;
  margin: 0 auto;
  padding-top: 150px;
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

.launch-wrap {
  display: none;
}

@media screen and (max-width: 1200px) {
  .stake-wrap {
    display: flex;
    flex-direction: column;
  }
}

@media screen and (max-width: 600px) {
  .launch-wrap {
    width: 100%;
    padding: 24px 16px;
    border-radius: 16px;
    border: 1px solid #00296b;
    background: linear-gradient(
      146deg,
      rgba(0, 10, 35, 0.07) 0%,
      rgba(0, 80, 156, 0.07) 101.49%
    );
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
    backdrop-filter: blur(12.5px);
    gap: 12px;
    display: flex;
    flex-direction: column;
  }

  .launch-title {
    font-size: 18px;
    font-weight: 500;
    line-height: normal;
  }

  .launch-subtitle {
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
  }

  .launch-link {
    width: 100%;
    height: 39px;
    border-radius: 10px;
    background: rgba(252, 253, 2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
    transition: all 0.3s ease;

    &.disabled {
      background: rgba(252, 252, 3, 0.2);
      pointer-events: none;
    }

    &:hover {
      background: rgba(252, 253, 2, 0.8);
    }
  }
}
</style>
