<template>
  <div class="fork-info-block">
    <h3 class="title">Forks Info</h3>
    <ForkInfoItem
      v-for="forkData in sortData"
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
      ForksData: JSON.parse(localStorage.getItem("tenderly_fork_data")),
    };
  },

  computed: {
    sortData() {
      if (!this.ForksData?.length) return [];
      return [...this.ForksData].sort((fork) => (fork.useFork ? -1 : 1));
    },
  },

  async mounted() {
    window.addEventListener("tenderly_fork_data-changed", () => {
      this.ForksData = JSON.parse(localStorage.getItem("tenderly_fork_data"));
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
  max-width: 380px;
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

@media screen and (max-width: 1024px) {
  .fork-info-block {
    max-width: 100%;
  }
}
</style>
