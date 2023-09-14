<template>
  <div class="fork-info-block">
    <h3 class="title">Forks Info</h3>
    <ForkInfoItem
      v-for="forkData in testForkData"
      :forkData="forkData"
      :key="forkData.forkId"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      testForkData: JSON.parse(localStorage.getItem("tenderly_fork_data")),
    };
  },

  async mounted() {
    window.addEventListener("tenderly_fork_data-changed", () => {
      this.testForkData = JSON.parse(
        localStorage.getItem("tenderly_fork_data")
      );
    });
  },

  components: {
    ForkInfoItem: defineAsyncComponent(() =>
      import("@/components/tenderly/ForkInfoItem.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.fork-info-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: rgba(35, 33, 45, 0.3019607843);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  padding: 15px 5px 0;
}

.title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}
</style>
