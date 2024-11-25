<template>
  <div :class="['pills-reward', { card }]">
    <p class="title">
      <img src="@/assets/images/pools/rewards/pills-icon.svg" v-if="icon" />
      <span class="title-text" v-if="name">Pills</span>
      <span class="multiplier-value" v-if="multiplier && card">1x</span>
    </p>
    <span class="multiplier-text" v-if="multiplier && card">Multiplier</span>
    <span class="multiplier" v-if="multiplier && !card">1x Multiplier</span>
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
.pills-reward {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  text-align: center;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.pills-reward.card {
  flex-direction: column;
  gap: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 600px) {
  .pills-reward {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
