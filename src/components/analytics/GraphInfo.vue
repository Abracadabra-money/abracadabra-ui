<template>
  <h3>Graph info</h3>
</template>

<script lang="ts">
import { getFeesGeneratedSnapshots } from "@/helpers/analytics/getFeesGeneratedSnapshots";
import { getTotalValueLockedSnapshots } from "@/helpers/analytics/getTotalValueLockedSnapshots";

export default {
  props: {
    cauldronsData: {},
  },

  methods: {
    async totalValueLocked() {
      const lockedData = await getTotalValueLockedSnapshots();

      const locked: any = {};

      lockedData.map(({ snapshots }: any) => {
        snapshots.map(({ totalValueLockedUsd, timestamp }: any) => {
          if (!locked[timestamp]) {
            locked[timestamp] = +totalValueLockedUsd;
          } else {
            locked[timestamp] += +totalValueLockedUsd;
          }
        });
      });

      const graphData: any = {
        labels: [],
        values: [],
      };

      for (const [key, value] of Object.entries(locked)) {
        graphData.labels.push(key);
        graphData.values.push(value);
      }

      console.log("graphData", graphData);
    },

    async feesGeneratedSnapshots() {
      const feesGeneratedData = await getFeesGeneratedSnapshots();

      console.log("feesGeneratedData", feesGeneratedData);

      const feesGenerate: any = {};

      feesGeneratedData.map(({ snapshots }: any) => {
        snapshots.map(({ feesGenerated, timestamp }: any) => {
          if (!feesGenerate[timestamp]) {
            feesGenerate[timestamp] = +feesGenerated;
          } else {
            feesGenerate[timestamp] += +feesGenerated;
          }
        });
      });

      const graphData: any = {
        labels: [],
        values: [],
      };

      for (const [key, value] of Object.entries(feesGenerate)) {
        graphData.labels.push(key);
        graphData.values.push(value);
      }

      console.log("feesGenerate", graphData);
    },
  },

  mounted() {
    console.time("timer");
    this.totalValueLocked();
    this.feesGeneratedSnapshots();
    console.timeEnd("timer");
  },
};
</script>
