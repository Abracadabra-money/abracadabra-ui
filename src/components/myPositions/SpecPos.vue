<template>
  <div class="spec-pos">
    <div class="title">
      <p>Borrow</p>
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
      <SpecPosItem v-for="i in 2" :key="i" :opened="opened" />
    </div>
  </div>
</template>

<script>
const SpecPosItem = () => import("@/components/myPositions/SpecPosItem");

export default {
  name: "SpecPos",
  components: { SpecPosItem },
  data: () => ({ opened: false }),
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
