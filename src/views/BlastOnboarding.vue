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

          <UsersLockedTokensCard :stakeInfo="stakeInfo" />
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
              Receive multiple rewards including Blast Points, Gold and the
              upcoming SPELL airdrop.
            </p>

            <p class="chart-description top-right">
              <img
                class="bottom-description-corner"
                src="@/assets/images/blast/blast-corner.svg"
              />
              <img
                class="bottom-description-corner-mobile"
                src="@/assets/images/blast/blast-corner-mobile.svg"
              />
              Base yield from USDB will be distributed to Founder's including
              all yield from USDB, collected during the LLE.
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
              20% of all future Points received by the Abracadabra Ecosystem
              will be distributed towards the Founder Boost.
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
import {
  fetchPointsStatistics,
  fetchUserPointsStatistics,
} from "@/helpers/blast/stake/points";
import { mapGetters } from "vuex";
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { formatTokenBalance } from "@/helpers/filters";
import { blastStakeConfig } from "@/configs/blast/stake";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
import { getPublicClient } from "@/helpers/getPublicClient";
import {
  getStakeTokenInfo,
  getStakeInfo,
} from "@/helpers/blast/stake/getStakeInfo";
import BlastLockingMultiRewardsAbi from "@/abis/BlastLockingMultiRewards";

import { BlastLockingMultiRewards } from "@/constants/blast";

// NOTICE: Pool ID and Chain ID are hardcoded for now
const MIM_USDB_POOL_ID = 1;
const MIM_USDB_POOL_CHAIN_ID = 81457;

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
  },

  watch: {
    account() {
      this.createStakeInfo();
    },

    chainId() {
      this.createStakeInfo();
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
      const userHasLockedAmounts = this.stakeInfo.data.tokensInfo.some(
        (token) => token.userInfo.balances.locked > 0n
      );

      if (userHasLockedAmounts) {
        this.isFounderBuffOpened = true;
      } else {
        this.$router.push({ name: "PointsDashboard" });
      }
    },

    async createStakeInfo() {
      const publicClient = getPublicClient(MIM_USDB_POOL_CHAIN_ID);

      const stakeInfo = await getStakeInfo(this.account);

      // console.log("stakeInfo", stakeInfo);

      const [balance] = await publicClient.multicall({
        contracts: [
          {
            address: BlastLockingMultiRewards,
            abi: BlastLockingMultiRewardsAbi,
            functionName: "unlocked",
            args: [this.account],
          },
        ],
      });

      const config = blastStakeConfig;

      const tokensInfo = await Promise.all(
        config.tokens.map((tokenConfig) =>
          getStakeTokenInfo(config, tokenConfig, publicClient, this.account)
        )
      );

      const lpInfo = await getPoolInfo(
        MIM_USDB_POOL_CHAIN_ID,
        MIM_USDB_POOL_ID,
        this.account
      );

      this.stakeInfo = {
        contract: {
          address: BlastLockingMultiRewards,
          abi: BlastLockingMultiRewardsAbi,
        },
        lpBalance: balance.result || 0n,
        lpInfo,
        tokensInfo,
        data: stakeInfo,
      };

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
      import("@/components/blastOnboarding/BlastStatisticsTotalInfo.vue")
    ),
    UsersLockedTokensCard: defineAsyncComponent(() =>
      import("@/components/blastOnboarding/cards/UsersLockedTokensCard.vue")
    ),
    FounderPopup: defineAsyncComponent(() =>
      import("@/components/blastOnboarding/founderBuff/FounderPopup.vue")
    ),
    FounderBuff: defineAsyncComponent(() =>
      import("@/components/blastOnboarding/founderBuff/FounderBuff.vue")
    ),
    PointsEarnedCard: defineAsyncComponent(() =>
      import("@/components/blastOnboarding/cards/PointsEarnedCard.vue")
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
  width: 262px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.top-left {
  top: 0;
  left: 0;
  text-align: start;
}

.top-right {
  top: 0;
  right: 0;
  text-align: end;
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
  bottom: 36px;
  right: -14px;
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
    gap: 16px;
  }

  .chart {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 13px;
    padding: 16px;
    height: auto;
    max-width: 343px;
  }

  .chart-description {
    position: static;
    text-align: start;
    font-size: 14px;
  }

  .chart-image {
    align-self: center;
    width: 318px;
    height: 285px;
  }

  .top-description-corner-mobile {
    top: 0;
    left: 8px;
    display: block;
    transform: rotate(90deg);
  }

  .bottom-description-corner-mobile {
    bottom: 4px;
    left: 4px;
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
