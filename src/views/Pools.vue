<template>
  <div class="pools-page" v-if="pools">
    <div class="pools-container">
      <PoolsInfo :pools="pools" />

      <PoolsList :pools="pools" :poolsLoading="poolsLoading" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { getPoolsList } from "@/helpers/pools/getPoolsList";
// import type { MagicLPInfo } from "@/helpers/pools/swap/types";

export default {
  data() {
    return {
      pools: [] as any[],
      poolsLoading: true,
      updateInterval: null as NodeJS.Timeout | null,
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),
  },

  async created() {
    this.pools = await getPoolsList(this.account);

    this.poolsLoading = false;
    this.updateInterval = setInterval(async () => {
      this.pools = await getPoolsList(this.account);
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(Number(this.updateInterval));
  },

  components: {
    PoolsInfo: defineAsyncComponent(
      () => import("@/components/pools/PoolsInfo.vue")
    ),
    PoolsList: defineAsyncComponent(
      () => import("@/components/pools/PoolsList.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pools-page {
  min-height: 100vh;
  width: 100%;
  height: 100%;
}

.pools-container {
  padding: 125px 15px 100px;
  max-width: 1310px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

@media screen and (max-width: 768px) {
  .pools-container {
    padding: 100px 12px 60px;
    gap: 16px;
  }
}
</style>
