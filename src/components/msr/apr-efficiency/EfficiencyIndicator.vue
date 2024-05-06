<template>
  <div class="efficiency-progress">
    <div ref="anim"></div>
    <div class="efficiency-info">
      <p class="title">Your APR</p>
      <p class="percent">{{ APREfficiency }}</p>
    </div>
  </div>
</template>

<script>
import LottiePlayer from "lottie-web";
const TOTAL_FRAMES = 90;
export default {
  props: {
    APREfficiency: { type: [Number, String], default: 0 },
  },

  data() {
    return {
      animation: null,
    };
  },

  methods: {
    initAnimation() {
      const { anim } = this.$refs;

      this.animation = LottiePlayer.loadAnimation({
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: `/apr-efficiency.json`,
        container: anim,
      });

      this.animation.goToAndStop(
        (TOTAL_FRAMES / 100) *
          Number(this.APREfficiency.toString().slice(0, -1)),
        true
      );
    },
  },

  async mounted() {
    this.initAnimation();
  },

  beforeUpdate() {
    this.animation.destroy();
    this.initAnimation();
  },
};
</script>

<style lang="scss" scoped>
.efficiency-progress {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 200px;
  height: 112px;
}

.efficiency-info {
  position: absolute;
  bottom: 10px;
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
