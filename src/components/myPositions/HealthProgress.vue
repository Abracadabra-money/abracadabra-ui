<template>
  <div class="health-progress">
    <div ref="anim"></div>
    <div class="health-info">
      <p class="percent">{{ positionHealth }}</p>
      <p class="title">Position health</p>
      <p :class="['position-risk', positionRisk]">{{ positionRisk }}</p>
    </div>
  </div>
</template>

<script>
import LottiePlayer from "lottie-web";
const TOTAL_FRAMES = 150;
export default {
  props: {
    positionHealth: { type: [Number, String], default: 0 },
    positionRisk: { type: String, default: "safe" },
  },

  methods: {
    initAnimation() {
      const { anim } = this.$refs;

      const player = LottiePlayer.loadAnimation({
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: `/${this.positionRisk}.json`,
        container: anim,
      });

      console.log("player", player);

      player.goToAndStop(
        (TOTAL_FRAMES / 100) * Number(+this.positionHealth.slice(0, -1)),
        true
      );
    },
  },

  async mounted() {
    this.initAnimation();
  },
};
</script>

<style lang="scss" scoped>
.health-progress {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 200px;
  height: 112px;
}

.health-info {
  position: absolute;
  bottom: -10px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.percent {
  font-size: 29px;
  font-weight: 600;
}

.title {
  color: #878b93;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
}

.position-risk {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  width: 97px;
  padding: 2px 12px;
  border-radius: 12px;
  text-transform: capitalize;
  font-size: 16px;
  font-weight: 400;
}

.safe {
  background-color: #67a069;
}

.medium {
  background-color: #ddc237;
}

.high {
  background-color: #8c4040;
}
</style>
