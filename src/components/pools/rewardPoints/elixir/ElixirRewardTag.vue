<template>
  <div :class="['elixir-reward', { card }]">
    <p class="title">
      <img src="@/assets/images/pools/rewards/elixir-icon.svg" v-if="icon" />
      <span class="title-text" v-if="name">Potions</span>
      <span class="multiplier-value" v-if="multiplier && card">5x</span>
    </p>
    <span class="multiplier-text" v-if="multiplier && card">Multiplier</span>
    <span class="multiplier" v-if="multiplier && !card">5x Multiplier</span>
  </div>
</template>

<script>
export default {
  props: {
    icon: Boolean,
    name: Boolean,
    multiplier: Boolean,
    card: Boolean,
  },
};
</script>

<style lang="scss" scoped>
.elixir-reward {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.elixir-reward.card {
  flex-direction: column;
  align-items: normal;
  gap: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 600px) {
  .elixir-reward {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
