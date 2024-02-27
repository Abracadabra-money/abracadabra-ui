<template>
  <div class="arrows-total-info">
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

    <div class="arrows">
      <button @click="$emit('prev')" class="arrow left">&lt;</button>
      <button @click="$emit('next')" class="arrow right">&gt;</button>
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
.arrows-total-info {
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
</style>
