<template>
  <div class="elixir-reward">
    <p class="title">
      <img src="@/assets/images/pools/elixir-icon.svg" />
      <span
        :class="['title-text', { 'gradient-text': isGradient }]"
        v-if="isTitleText"
      >
        Elixir Potion
      </span>
    </p>
    <span :class="{ 'gradient-text': isGradient }">5x Multiplier</span>
  </div>
</template>

<script>
export default {
  props: {
    isGradient: Boolean,
    isTitleText: Boolean,
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

.title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.gradient-text {
  background: -webkit-linear-gradient(
    271.25deg,
    #ffe47c -2.69%,
    #ff43c3 51.91%,
    #4156e0 101.11%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@media (max-width: 600px) {
  .elixir-reward {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
