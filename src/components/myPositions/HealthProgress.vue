<template>
  <div class="health-progress">

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
  width: 200px;
  height: 110px;
}
.progress {
  border-radius: 20px;
  height: 100%;
}

.safe {
  color: #67A069;
}

.medium {
  color: #DDC237;
}

.high {
  color: #8C4040;
}
</style>
