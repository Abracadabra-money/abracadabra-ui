<template>
  <ul class="beam-history">
    <p class="title">Transaction overview</p>
    <HistoryItem v-for="item in items" />
  </ul>
</template>

<script>
import HistoryItem from "@/components/beam/history/HistoryItem.vue";
export default {
  data() {
    return {
      items: [1, 1, 1, 1, 1, 1, 1],
    };
  },
  components: { HistoryItem },
};
</script>

<style lang="scss" scoped>
.beam-history {
  list-style: none;
}
.title {
  margin: 0 0 20px 0;
  font-weight: 600;
  font-size: 18px;
  line-height: 150%;
}
</style>
