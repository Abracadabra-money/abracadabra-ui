<template>
  <div class="title">Beam history</div>
  <ul class="beam-history" v-if="historyArr">
    <HistoryItem
      v-for="history in historyArr"
      :beam-history="history"
      :key="history.tx.hash"
    />
  </ul>
  <div class="empty" v-else>
    <img class="empty-img" src="@/assets/images/empty_borrow.png" alt="" />
    <p class="empty-text">The transaction history will be displayed here</p>
  </div>
</template>

<script>
import HistoryItem from "@/components/beam/history/HistoryItem.vue";
export default {
  props: {
    historyArr: {
      type: Array,
    },
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

.empty {
  padding: 0 30px 50px;
  text-align: center;
}

.empty-img {
  max-width: 155px;
  width: 100%;
}

.empty-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
  letter-spacing: 0.45px;
}

@media screen and (max-width: 400px) {
  .empty {
    padding: 0 10px 30px;
    text-align: center;
  }
}
</style>
