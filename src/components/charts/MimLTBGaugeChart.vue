<template>
  <div class="wrap">
    <div ref="player"></div>
  </div>
</template>

<script lang="ts">
import LottiePlayer from "lottie-web";

export default {
  props: {
    chartData: {},
  },

  data(): any {
    return {
      option: null,
    };
  },

  methods: {
    test() {
      LottiePlayer.loadAnimation({
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "/mim.json",
        container: this.$refs.player,
      });
    },
  },

  async mounted() {
    this.test();
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
}
</style>
