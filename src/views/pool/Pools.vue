<template>
  <div class="pools-page" v-if="pools">
    <div class="pools-container">
      <PoolsInfo :pools="pools" />

      <PoolsList :pools="pools" :poolsLoading="poolsLoading" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { mapGetters, mapMutations } from "vuex";
import { PoolConfig } from "@/configs/pools/types";
import { getPoolsList } from "@/helpers/pools/getPoolsList";
import { getPoolConfigs } from "@/helpers/pools/getPoolConfigs";

export default {
  data() {
    return {
      pools: [] as any[],
      poolsLoading: true,
      poolConfigs: [] as PoolConfig[],
      updateInterval: null as NodeJS.Timeout | null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      localPoolsList: "getPoolsList",
    }),
  },

  methods: {
    ...mapMutations({
      setPoolsList: "setPoolsList",
    }),

    checkLocalData(): void {
      if (this.localPoolsList.isCreated) {
        this.pools = this.localPoolsList.data;
        this.poolsLoading = false;
      }
    },

    async createPoolsInfo(): Promise<void> {
      this.pools = await getPoolsList(this.account, this.poolConfigs);
      this.poolsLoading = false;

      this.setPoolsList(this.pools);
    },
  },

  async created() {
    this.poolConfigs = await getPoolConfigs();
    this.checkLocalData();
    await this.createPoolsInfo();

    this.updateInterval = setInterval(async () => {
      this.pools = await getPoolsList(this.account, this.poolConfigs);
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
