<template>
  <div class="total-info-wrap">
    <div class="total-info">
      <div class="tag" v-if="account">
        <span class="title">Total deposited:</span>
        <span class="value">{{ formatTokenBalance(totalDeposited) }}</span>
      </div>

      <div class="tag">
        <span class="title">APR:</span>
        <span class="value">60%</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";

export default {
  props: { mimSavingRateInfo: { type: Object } },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),

    totalDeposited() {
      if (!this.mimSavingRateInfo?.userInfo) return "";
      return formatUnits(
        this.mimSavingRateInfo.userInfo.locked +
          this.mimSavingRateInfo.userInfo.unlocked,
        this.mimSavingRateInfo.stakingToken.decimals
      );
    },
  },

  methods: {
    formatTokenBalance,
  },
};
</script>

<style lang="scss" scoped>
.total-info-wrap {
  position: absolute;
  bottom: 98.67px;
  display: flex;
  gap: 24px;
}

.total-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.tag {
  display: flex;
  gap: 12px;
}

.arrow {
  background-color: transparent;
  border: none;
  color: rgb(249, 245, 245);
  font-size: 40px;
  cursor: pointer;
  z-index: 2;
}

@media (max-width: 760px) {
  .total-info-wrap {
    bottom: 20px;
    font-size: 14px;
    font-weight: 400;
  }
}
</style>
