<template>
  <div class="blast-statistics-view" v-if="stakeInfo">
    <div class="blast-statistics-page" v-if="!isFounderBuffOpened">
      <BlastStatisticsTotalInfo
        :stakeInfo="stakeInfo"
        :totalDistributedPoints="totalDistributedPoints"
      />

      <div class="statistics-wrap">
        <div class="statistics-cards">
          <PointsEarnedCard :userPointsEarned="userPointsEarned" />

          <UserDeposits
            :stakeInfo="stakeInfo"
            :pointsStatistics="pointsStatistics"
            @openFounderPopup="isFounderPopupOpened = true"
          />
        </div>

        <div class="chart-wrap">
          <div class="chart">
            <p class="chart-description top-left">
              <img
                class="top-description-corner"
                src="@/assets/images/blast/blast-corner.svg"
              />
              <img
                class="top-description-corner-mobile"
                src="@/assets/images/blast/blast-corner-mobile.svg"
              />
              Users of Abracadabra products on Blast will receive rewards
            </p>
            <img
              class="chart-image"
              src="../assets/images/blast/blast-chart-image.png"
            />
            <p class="chart-description bottom-right">
              <img
                class="bottom-description-corner"
                src="@/assets/images/blast/blast-corner.svg"
              />
              <img
                class="bottom-description-corner-mobile"
                src="@/assets/images/blast/blast-corner-mobile.svg"
              />
              30 % of all Points will be destributed to Founders
            </p>
          </div>
          <button class="button-next" @click="nextHandler">Next</button>
        </div>
      </div>
    </div>

    <FounderBuff
      :stakeInfo="stakeInfo"
      v-if="isFounderBuffOpened"
      @openFounderPopup="isFounderPopupOpened = true"
    />

    <FounderPopup
      :stakeInfo="stakeInfo"
      @close="isFounderPopupOpened = false"
      v-if="isFounderPopupOpened"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";
import {
  fetchPointsStatistics,
  fetchUserPointsStatistics,
} from "@/helpers/blast/stake/points";
import { getStakeInfo } from "@/helpers/blast/stake/getStakeInfo";
import { getLpInfo } from "@/helpers/pools/swap/magicLp";
import blastPools from "@/configs/pools/blastPools";

export default {
  data() {
    return {
      stakeInfo: null,
      updateInterval: null,
      userPointsEarned: 0,
      pointsStatistics: null,
      isFounderBuffOpened: false,
      isFounderPopupOpened: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    totalDistributedPoints() {
      return this.formatAmount(this.pointsStatistics?.total);
    },

    lpConfig() {
      return blastPools.find(
        (config) =>
          config.contract.address ===
          "0xC83D75Dd43cc7B11317b89b7163604aFb184EFF8"
        // "0xC83D75Dd43cc7B11317b89b7163604aFb184EFF8"
        // "0xB2Eb529F4A461aaCa1a8A5E1E2E454c742cB7061" lp address from stake contract
      );
    },
  },

  methods: {
    formatTokenBalance(value) {
      return formatTokenBalance(formatUnits(value, 18));
    },

    formatAmount(value) {
      return formatTokenBalance(value);
    },

    nextHandler() {
      if (this.stakeInfo.lpInfo.userInfo.balance > 0) {
        this.isFounderBuffOpened = true;
      } else {
        this.$router.push({ name: "MyPoints" });
      }
    },

    async createStakeInfo() {
      this.stakeInfo = await getStakeInfo(this.account);
      this.stakeInfo.lpInfo = await getLpInfo(
        this.lpConfig,
        this.chainId,
        this.account
      );

      this.userPointsEarned = (
        await fetchUserPointsStatistics(this.account)
      ).total;
      this.pointsStatistics = await fetchPointsStatistics();
    },
  },

  async created() {
    await this.createStakeInfo();
    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  components: {
    BlastStatisticsTotalInfo: defineAsyncComponent(() =>
      import("@/components/blastStatistics/BlastStatisticsTotalInfo.vue")
    ),
    UserDeposits: defineAsyncComponent(() =>
      import("@/components/blastStatistics/UserDeposits.vue")
    ),
    FounderPopup: defineAsyncComponent(() =>
      import("@/components/blastStatistics/founderBuff/FounderPopup.vue")
    ),
    FounderBuff: defineAsyncComponent(() =>
      import("@/components/blastStatistics/founderBuff/FounderBuff.vue")
    ),
    PointsEarnedCard: defineAsyncComponent(() =>
      import("@/components/blastStatistics/cards/PointsEarnedCard.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.blast-statistics-view {
  position: relative;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.blast-statistics-page {
  margin: 150px 25px 60px 25px;
  width: 1280px;
  max-width: 100%;
  box-sizing: border-box;
}

.statistics-wrap {
  display: flex;
  gap: 60px;
}

.statistics-cards {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  max-width: 410px;
}

.points-earned-title {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 61px;
  margin-bottom: -1px;
  clip-path: polygon(0 58%, 4% 24%, 22% 22%, 26% 0, 100% 0%, 100% 100%, 0 100%);
  background-color: #fcfd02;
  border: 2px solid #fcfd02;
  color: #000;
  border-radius: 16px 16px 0 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  text-transform: uppercase;
}

.points-earned-value-border {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 101px;
  clip-path: polygon(100% 0, 100% 65%, 90% 100%, 0 100%, 0 0);
  background-color: #fcfd02;
  border-radius: 0 0 16px 16px;
}

.points-earned-value {
  display: flex;
  justify-content: center;
  align-items: center;
  width: calc(100% - 6px);
  height: 95px;
  clip-path: polygon(100% 0, 100% 65%, 90% 100%, 0 100%, 0 0);
  background-color: rgb(15, 16, 31);
  color: #fcfd02;
  border-radius: 0 0 16px 16px;

  font-size: 34px;
  font-weight: 500;
  line-height: 24px;
  text-transform: uppercase;
}

.chart-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 50px;
  width: 100%;
}

.chart {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 458px;
}

.chart-image {
  width: 402px;
  height: 342px;
}

.chart-description {
  position: absolute;
  width: 219px;
}

.top-left {
  top: 0;
  left: 0;
  text-align: start;
}

.bottom-right {
  bottom: 0;
  right: 0;
  text-align: end;
}

.top-description-corner {
  position: absolute;
  top: -23px;
  left: -4px;
  transform: rotate(270deg);
}

.bottom-description-corner {
  position: absolute;
  bottom: -7px;
  right: -21px;
}

.top-description-corner-mobile,
.bottom-description-corner-mobile {
  position: absolute;
  display: none;
}

.button-next {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  gap: 10px;
  width: 330px;
  padding: 12px 24px;
  border-radius: 16px;
  border: none;
  background: #fcfd02;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.button-next:hover {
  background: #d4d402;
}

.mobile-button {
  display: none;
}

.distributed-points {
  color: #fcfc03;
  font-size: 16px;
  font-weight: 600;
}

@media screen and (max-width: 1000px) {
  .statistics-wrap {
    align-items: center;
    flex-direction: column;
  }

  .chart {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 13px;
    max-width: 343px;
  }

  .chart-description {
    position: static;
    text-align: start;
    padding: 0px 13px;
  }

  .chart-image {
    align-self: center;
    width: 318px;
    height: 285px;
  }

  .top-description-corner-mobile {
    top: 0;
    left: 0;
    display: block;
    transform: rotate(90deg);
  }

  .bottom-description-corner-mobile {
    bottom: 0;
    left: 0;
    display: block;
  }

  .top-description-corner,
  .bottom-description-corner {
    display: none;
  }

  .mobile-button {
    display: flex;
  }
}

@media screen and (max-width: 600px) {
  .blast-statistics-page {
    padding: 0 10px;
  }
}
</style>
