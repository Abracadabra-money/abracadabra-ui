<template>
  <div class="spec-pos">
    <div class="title">
      <p>{{ title }}</p>
      <button @click="opened = !opened" class="open-btn">
        <img
          v-if="opened"
          src="@/assets/images/myposition/minus.svg"
          alt="close"
        />
        <img v-else src="@/assets/images/myposition/plus.svg" alt="open" />
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
        <SpecPosFarmItem
          v-for="pool in pools"
          :key="pool.id"
          :opened="opened"
          :pool="pool"
      /></template>
    </div>
  </div>
</template>

<script>
const SpecPosBorrowItem = () =>
  import("@/components/myPositions/SpecPosBorrowItem");
const SpecPosFarmItem = () =>
  import("@/components/myPositions/SpecPosFarmItem");

export default {
  name: "SpecPos",
  props: {
    isFarm: { type: Boolean, default: false },
    pools: { type: Array, default: () => [] },
  },
  components: { SpecPosBorrowItem, SpecPosFarmItem },
  data: () => ({ opened: false }),
  computed: {
    title() {
      return this.isFarm ? "Farm" : "Borrow";
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
    background-color: transparent;
    border: none;
    cursor: pointer;
  }

  .items {
    display: grid;
    grid-template-rows: repeat(auto-fill, auto);
    row-gap: 16px;
    margin-top: 18px;
  }
}
</style>
