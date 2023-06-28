<template>
  <div class="title">Transaction overview</div>
  <ul class="beam-history">
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
  margin: -20px 0 0 0;
  list-style: none;
}
.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 150%;
}
</style>
