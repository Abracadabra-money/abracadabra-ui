<template>
  <div class="router-wrap">
    <h4 class="title">Auto Router</h4>

    <h5 class="empty-state" v-if="isEmptyState">
      The best route for chosen tokens will appear here
    </h5>

    <div class="router" v-else>
      <div class="dashed"></div>
      <img class="token-icon" src="@/assets/images/tokens/MIM.png" alt="" />
      <img class="token-icon" src="@/assets/images/tokens/SPELL.png" alt="" />
      <img class="token-icon" src="@/assets/images/tokens/ETH.png" alt="" />
    </div>

    <p class="text">
      This route optimizes your total output by considering split routes,
      multiple hops, and the gas cost of each step.
    </p>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    isEmptyState: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.router-wrap {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 16px;
  font-weight: 500;
  line-height: normal;
}

.empty-state {
  height: 48px;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: center;
}

.router {
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dashed {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 1px;
  width: 100%;
  background-image: linear-gradient(
    90deg,
    #7088cc,
    #7088cc 65%,
    transparent 65%,
    transparent 100%
  );
  background-size: 20px 1px;
  border: none;
}

.token-icon {
  z-index: 1;
  width: 20px;
  height: 20px;
}

.text {
  color: #878b93;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}
</style>
