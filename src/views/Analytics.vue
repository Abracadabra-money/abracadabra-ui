<template>
  <div class="analytics">
    <h1 class="title">Analytics</h1>
    <TotalInfo :cauldronsData="cauldronsData" />
    <hr />
    <GraphInfo :cauldronsData="cauldronsData" />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { getCauldronsInfo } from "@/helpers/analytics/getCauldronsInfo";

export default {
  data(): any {
    return {
      cauldronsData: null,
    };
  },

  async mounted() {
    this.cauldronsData = await Promise.all(
      [1, 10, 250, 42161, 43114].map(async (chainId: number) =>
        getCauldronsInfo(chainId)
      )
    );
  },

  components: {
    TotalInfo: defineAsyncComponent(
      () => import("@/components/analytics/TotalInfo.vue")
    ),
    GraphInfo: defineAsyncComponent(
      () => import("@/components/analytics/GraphInfo.vue")
    ),
  },
};
</script>

<style lang="scss">
.analytics {
  padding: 120px 15px;
  max-width: 1200px;
  margin: 0 auto;
}

.title {
  text-align: center;
}
</style>
