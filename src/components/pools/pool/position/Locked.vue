<template>
  <div class="locked">
    <ul class="locks-list">
      <UserLock
        :pool="pool"
        :lock="lock"
        v-for="(lock, index) in userLocks"
        :key="index"
      />
    </ul>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { formatUnits } from "viem";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import { getUserLocks } from "@/helpers/pools/getPoolInfo";

export default {
  props: {
    pool: { type: Object },
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
  },

  methods: {
    formatUSD,

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
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
