<template>
  <div class="health-progress">
    <div
      class="progress"
      :class="positionRisk"
      :style="{ width: `${percent}%` }"
    >
      &nbsp;
    </div>
  </div>
</template>

<script>
export default {
  props: {
    positionRisk: { type: String, default: "safe" },
    percent: { type: [Number, String], default: 0 },
  },
};
</script>

<style lang="scss" scoped>
.health-progress {
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
.progress {
  border-radius: 20px;
  height: 100%;
}

.safe {
  background: #63caf8;
}
.medium {
  background: #ffb800;
}
.high {
  background: #fe1842;
}
</style>
