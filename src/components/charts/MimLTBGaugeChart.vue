<template>
  <div class="wrap">
    <div id="player"></div>
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
      const player = LottiePlayer.loadAnimation({
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "/mim.json",
        container: document.querySelector("#player"),
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
