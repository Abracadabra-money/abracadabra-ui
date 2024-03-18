<template>
  <div class="user-deposits">
    <h3 class="user-deposits-title">Your deposits</h3>

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

.user-deposits {
  max-width: 411px;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
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
