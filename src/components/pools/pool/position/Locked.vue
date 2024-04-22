<template>
  <div class="locked">
    <FounderBoostCard :lpToken="lpToken" :rewardsList="rewardsList" />

    <ul class="locks-list">
      <UserLock
        :pool="pool"
        :lock="lock"
        v-for="(lock, index) in userLocks"
        :key="index"
      />
    </ul>

    <BaseButton primary @click="goToDashboard()">See dashbord</BaseButton>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { formatUnits } from "viem";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import { getUserLocks } from "@/helpers/pools/getPoolInfo";
import { useImage } from "@/helpers/useImage";

export default {
  props: {
    pool: { type: Object },
    userPointsStatistics: { type: Object },
  },

  data() {
    return { userLocks: [] };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    lpToken() {
      return {
        name: this.pool.name,
        icon: this.pool.icon,
        amount: this.formatTokenBalance(
          this.pool.lockInfo.balances.locked || 0n,
          this.pool.decimals
        ),
        amountUsd: this.formatUSD(
          formatUnits(
            this.pool.lockInfo.balances.locked || 0n,
            this.pool.decimals
          ) * this.pool.price
        ),
      };
    },

    rewardsList() {
      return [
        {
          title: "Points",
          icon: useImage("assets/images/points-dashboard/blast.png"),
          value: formatTokenBalance(
            this.userPointsStatistics?.liquidityPoints?.founder?.finalized || 0
          ),
        },
        {
          title: "Gold",
          icon: useImage("assets/images/points-dashboard/gold-points.svg"),
          value: formatTokenBalance(
            this.userPointsStatistics?.developerPoints?.founder?.finalized || 0
          ),
        },
        {
          title: "Potion",
          icon: useImage("assets/images/points-dashboard/potion.png"),
          value: "0.0",
        },
      ];
    },
  },

  methods: {
    formatUSD,

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },

    goToDashboard() {
      this.$router.push({
        name: "PointsDashboard",
      });
    },
  },

  async created() {
    this.userLocks = await getUserLocks(
      this.account,
      this.pool.chainId,
      this.pool
    );
  },

  components: {
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    FounderBoostCard: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/cards/FounderBoostCard.vue")
    ),
    UserLock: defineAsyncComponent(() =>
      import("@/components/pools/pool/position/UserLock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.locked {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.locks-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 111px;
  max-height: 122px;
  padding-right: 10px;
  margin-right: -18px;
  list-style: none;
  overflow: auto;
}
</style>
