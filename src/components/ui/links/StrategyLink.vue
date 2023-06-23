<template>
  <a
    class="strategy-link"
    v-if="strategyLink"
    :href="strategyLink"
    target="_blank"
    rel="noreferrer noopener"
  >
    <img src="@/assets/images/degenbox.svg" alt="degenbox" />
    <span>Degenbox strategy</span>
    <img src="@/assets/images/arrow_right.svg" alt="degenbox"
  /></a>
</template>

<script>
export default {
  props: {
    cauldron: { type: Object, require: true },
  },

  computed: {
    strategyLink() {
      return this.cauldron?.cauldronSettings.strategyLink;
    },
  },
};
</script>

<style lang="scss" scoped>
.strategy-link {
  color: #fff;
  display: grid;
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
