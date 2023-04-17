<template>
  <div class="spec-pos">
    <div class="title">
      <p>{{ title }}</p>
      <button v-if="!isFarm" @click="opened = !opened" class="open-btn">
        <p>{{ openBtnText }}</p>

        <img
          v-if="opened"
          src="@/assets/images/myposition/Icon-Minus.png"
          alt="close"
        />
        <img v-else src="@/assets/images/myposition/Icon-Plus.png" alt="open" />
      </button>
    </div>
    <div class="items">
      <template v-if="!isFarm">
        <SpecPosBorrowItem
          v-for="pool in pools"
          :key="pool.id"
          :opened="opened"
          :pool="pool"
      /></template>
      <template v-else>
        <SpecPosFarmItem v-for="pool in pools" :key="pool.id" :pool="pool"
      /></template>
    </div>
  </div>
</template>

<script>
import SpecPosBorrowItem from "@/components/myPositions/SpecPosBorrowItem.vue";
import SpecPosFarmItem from "@/components/myPositions/SpecPosFarmItem.vue";

export default {
  name: "SpecPos",
  props: {
    isFarm: { type: Boolean, default: false },
    pools: { type: Array, default: () => [] },
  },
  components: { SpecPosBorrowItem, SpecPosFarmItem },
  data() {
    return {
      opened: false,
    };
  },
  computed: {
    title() {
      return this.isFarm ? "Farm" : "Borrow";
    },
    openBtnText() {
      if (this.opened) return "Show less";

      return "Show more";
    },
  },
};
</script>

<style lang="scss" scoped>
.spec-pos {
  background: #2a2835;
  border-radius: 30px;
  padding: 20px;

  .title {
    display: flex;
    justify-content: space-between;
    font-weight: 600;
    font-size: 18px;
    line-height: 27px;
    text-transform: uppercase;
  }

  .open-btn {
    display: flex;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;

    p {
      font-weight: 400;
      font-size: 14px;
      line-height: 21px;

      background: linear-gradient(107.5deg, #5282fd -3.19%, #76c3f5 101.2%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }

    img {
      width: 20px;
      height: auto;
      object-fit: contain;
      margin-left: 8px;
    }
  }

  .items {
    display: grid;
    grid-template-rows: repeat(auto-fill, auto);
    row-gap: 16px;
    margin-top: 18px;
  }
}
</style>
