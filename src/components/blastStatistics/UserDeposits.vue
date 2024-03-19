<template>
  <div class="user-deposits">
    <h3 class="user-deposits-title">Your deposit</h3>

    <PoolCard :stakeInfo="stakeInfo" isLocked v-if="isLpPosition" />
    <BaseSearchEmpty class="empty" v-else />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isLpPosition() {
      return this.stakeInfo.lpInfo?.userInfo?.balance > 0;
    },
  },

  components: {
    PoolCard: defineAsyncComponent(() =>
      import("@/components/blastStatistics/cards/PoolCard.vue")
    ),
    BaseSearchEmpty: defineAsyncComponent(() =>
      import("@/components/base/BaseSearchEmpty.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.user-deposits,
.deposit-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  cursor: pointer;
}

.user-deposits-title {
  font-size: 24px;
  font-weight: 500;
}

.empty {
  padding: 0px 0px !important;
}

@media (max-width: 600px) {
  .user-deposits {
    padding: 16px;
  }
}
</style>
