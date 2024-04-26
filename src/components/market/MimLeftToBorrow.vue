<template>
  <div class="mim-left-to-borrow">
    <div ref="anim"></div>
    <div class="info">
      <div class="value">{{ mimLeftToBorrow }}</div>
      <div class="title">MIM Left to Mint</div>
    </div>
    <div class="values-wrap">
      <span class="value-start">0</span>
      <span class="value-end">{{ totalMimToBorrow }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import LottiePlayer from "lottie-web";
import { formatUnits, parseUnits } from "viem";
import { formatLargeSum } from "@/helpers/filters";
import type { CauldronInfo } from "@/helpers/cauldron/types";

const TOTAL_FRAMES = 150;
const MIM_DECIMALS = 18;

export default {
  props: {
    cauldron: {
      type: Object as PropType<CauldronInfo>,
    },
  },

  computed: {
    mimLeftToBorrow(): string {
      return formatLargeSum(
        formatUnits(
          this.cauldron!.mainParams.alternativeData.mimLeftToBorrow,
          MIM_DECIMALS
        )
      );
    },

    totalMimToBorrow(): string {
      const { mimLeftToBorrow, totalBorrowed } =
        this.cauldron!.mainParams.alternativeData;

      return formatLargeSum(
        formatUnits(mimLeftToBorrow + totalBorrowed, MIM_DECIMALS)
      );
    },

    currentFrame(): number {
      const { mimLeftToBorrow, totalBorrowed } =
        this.cauldron!.mainParams.alternativeData;

      const expandDecimals = parseUnits("1", MIM_DECIMALS);
      const totalMimToBorrow = mimLeftToBorrow + totalBorrowed;

      const borrowedPercent =
        ((totalBorrowed * expandDecimals) / totalMimToBorrow) * 100n;

      const leftToBorrowPercent = formatUnits(
        parseUnits("100", MIM_DECIMALS) - borrowedPercent,
        MIM_DECIMALS
      );

      return (TOTAL_FRAMES / 100) * Number(leftToBorrowPercent);
    },
  },

  methods: {
    initAnimation(): void {
      const { anim }: any = this.$refs;

      const player = LottiePlayer.loadAnimation({
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "/mim.json",
        container: anim,
      });

      player.goToAndStop(this.currentFrame, true);
    },
  },

  async mounted() {
    this.initAnimation();
  },
};
</script>

<style lang="scss" scoped>
.mim-left-to-borrow {
  width: 100%;
  max-width: 360px;
  height: 100%;
  margin: 0 auto;
  position: relative;
}

.info {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  margin: 0 auto;
  width: 100%;
  text-align: center;
  transform: translateY(-30%);
}

.value {
  font-size: 35px;
  font-weight: 500;
}

.title {
  color: #99a0b2;
  font-size: 14px;
  font-weight: 500;
}

.values-wrap {
  position: absolute;
  display: flex;
  width: 100%;
  bottom: 20px;
  justify-content: space-between;
  padding: 0 30px 0 50px;
  color: #878b93;
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
}

.value-end {
  text-align: center;
  min-width: 50px;
}
</style>
