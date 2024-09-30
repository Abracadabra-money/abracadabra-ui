<template>
  <div class="stake-view">
    <div class="stake-wrap" v-if="stakeInfo">
      <div class="actions-wrap">
        <BlastHead
          class="head"
          :mobileMode="mobileMode"
          :currentMobileTab="currentMobileTab"
          @changeActionTab="changeActionTab"
          @changeCurrentMobileTab="changeCurrentMobileTab"
        />

        <div class="launch-wrap" v-if="currentMobileTab === 0">
          <div>
            <h3 class="launch-title">The LLE Event has concluded!</h3>
            <h4 class="launch-subtitle">
              Head to MIMSwap to participate in Phase 3!
            </h4>
          </div>
          <div class="launch-link">
            Launch
          </div>
        </div>

        <ActionBlock
          class="action"
          :stakeInfo="stakeInfo"
          :actionActiveTab="actionActiveTab"
          :userPointsEarned="userPointsEarned"
          :mobileMode="mobileMode"
          @updateStakeInfo="createStakeInfo"
          v-if="isActionTab"
        />
      </div>

      <StakeInfo
        class="info"
        :stakeInfo="stakeInfo"
        :pointsStatistics="pointsStatistics"
        :mobileMode="mobileMode"
        :timeInfo="timeInfo"
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
import moment from "moment";

import notification from "@/helpers/notification/notification";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { claim } from "@/helpers/blast/stake/actions/claim";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { formatUnits } from "viem";

export default {
  data() {
    return {
      stakeInfo: null as any,
      updateInterval: null as any,
      userPointsEarned: null as any,
      pointsStatistics: null as any,
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

    isActionTab() {
      if (!this.mobileMode) return true;
      return this.currentMobileTab == 0;
    },

    isInfoTab() {
      if (!this.mobileMode) return true;
      return this.currentMobileTab == 1;
    },

    tokensInfo() {
      return this.stakeInfo.tokensInfo.map((token) => {
        return {
          name: token.config.name,
          icon: token.config.icon,
          amount: this.formatTokenBalance(
            token.userInfo.balances.locked,
            token.config.decimals
          ),
          amountUsd: formatUSD(
            this.formatTokenBalance(
              token.userInfo.balances.locked,
              token.config.decimals
            ) * token.config.price
          ),
        };
      });
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatTokenBalance(value) {
      return formatTokenBalance(formatUnits(value, 18));
    },

    formatAmount(value) {
      return formatTokenBalance(value);
    },

    async claimHandler(lock = false) {
      const notificationId = await this.createNotification(
        notification.pending
      );

      const { contract } = this.stakeInfo.data.config;

      console.log(contract);

      const { error } = await claim(contract, lock);

      this.deleteNotification(notificationId);

      if (error) {
        const errorNotification = {
          msg: notificationErrorMsg({ message: error.msg }),
          type: "error",
        };

        this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      } else {
        await this.createNotification(notification.success);
        this.$router.push({ name: "PointsDashboard" });
      }
    },

    changeActionTab(action: string) {
      this.actionActiveTab = action;
    },

    changeCurrentMobileTab(newTabIndex: number) {
      this.currentMobileTab = newTabIndex;
    },

    async createStakeInfo() {
      [this.stakeInfo, this.userPointsEarned, this.pointsStatistics] = await Promise.all([
        getStakeInfo(this.account),
        fetchUserPointsStatistics(this.account),
        fetchPointsStatistics(),
      ]);
    },

    getWindowSize() {
      if (window.innerWidth <= 600) this.mobileMode = true;
      else {
        this.mobileMode = false;
        this.currentMobileTab = 0;
      }
    },

    updateTimeInfo() {
      const now = moment().utc();

      let duration;

      const nextHour = moment.utc().startOf("hour").add(1, "hours"); // next hour
      duration = moment.duration(nextHour.diff(now));

      if (duration.asSeconds() <= 0) {
        clearInterval(this.timerInterval);
        this.timerInterval = ["00m", "00s"];
        return;
      }

      const minutes = Math.max(duration.minutes(), 0);
      const seconds = Math.max(duration.seconds(), 0);

      const timerValues = [
        `${minutes.toString().padStart(2, "0")}m`,
        `${seconds.toString().padStart(2, "0")}s`,
      ];

      const secondsPassed = now.seconds() + now.minutes() * 60;
      const percentagePassedInSeconds = (secondsPassed / 3600) * 100;

      const timerInfo = {
        percentagePassed: percentagePassedInSeconds,
        timerValues,
      };

      this.timeInfo = timerInfo;
    },

    stopIntervals() {
      clearInterval(this.updateInterval);
      clearInterval(this.timerInterval);
    },

    createIntervals() {
      this.updateInterval = setInterval(async () => {
        await this.createStakeInfo();
      }, 60000);

      this.timerInterval = setInterval(this.updateTimeInfo, 1000);
    },
  },

  async created() {
    await this.createStakeInfo();

    this.getWindowSize();
    window.addEventListener("resize", this.getWindowSize, false);

    this.createIntervals();
  },

  beforeUnmount() {
    this.stopIntervals();
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

.actions-wrap {
  gap: 32px;
  display: flex;
  flex-direction: column;
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
