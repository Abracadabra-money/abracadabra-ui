<template>
  <div class="router-wrap">
    <h4 class="title">Auto Router</h4>

    <h5
      class="empty-state"
      v-if="
        !routes?.length || !fromTokenIcon || !toTokenIcon || !routesInfo?.length
      "
    >
      The best route for chosen tokens will appear here
    </h5>

    <div class="router" v-else>
      <div class="dashed"></div>

      <img class="token-icon" :src="fromTokenIcon" alt="" />

      <div class="route-item" v-for="route in routesInfo" :key="route.address">
        <img class="token-icon" :src="route.icon" alt="" />
        <span class="route-value">{{ route.percent }}</span>
      </div>

      <img class="token-icon" :src="toTokenIcon" alt="" />
    </div>

    <p class="text">
      This route optimizes your total output by considering split routes,
      multiple hops, and the gas cost of each step.
    </p>
  </div>
</template>

<script lang="ts">
import type { TokenInfo } from "@/helpers/pools/swap/tokens";
import type { RouteInfo } from "@/helpers/pools/swap/getSwapInfo";
import { getRoutesInfo } from "@/helpers/pools/swap/getRoutesInfo";

export default {
  props: {
    routes: Array<RouteInfo>,
    tokensList: Array<TokenInfo>,
    fromTokenIcon: String,
    toTokenIcon: String,
  },

  computed: {
    routesInfo() {
      return getRoutesInfo(this.tokensList, this.routes);
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

.route-item {
  z-index: 10;
  gap: 4px;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  background: #0c1121;
}

.text {
  color: #878b93;
  text-align: center;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}
</style>
