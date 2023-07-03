<template>
  <div class="state">
    <img
      class="state-icon"
      src="@/assets/images/empty-stats-list.png"
      alt="Empty State"
    />
    <p class="state-text">{{ text }}</p>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default:
        "No pools on this network. In the future they will be displayed here",
    },
  },
};
</script>

<style lang="scss" scoped>
.state {
  min-height: 45vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  gap: 30px;
}

.state-icon {
  max-width: 246px;
}

.state-text {
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
}
</style>
