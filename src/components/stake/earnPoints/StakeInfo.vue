<template>
  <div class="stake-info">
    <LiquidityInfo :stakeInfo="stakeInfo" v-if="!mobileMode" />

    <Totals :stakeInfo="stakeInfo" :pointsStatistics="pointsStatistics" />

    <div class="audits">
      <div>Security Audits Completed</div>
      <div class="icons-wrap">
        <a
          href="https://guardianaudits.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            class="guardian-audits"
            src="@/assets/images/blast/guardian-audits.png"
            alt=""
        /></a>

        <a
          href="https://code4rena.com/audits/2024-03-abracadabra-mimswap#top"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            class="code4rena"
            src="@/assets/images/blast/code4rena.png"
            alt=""
        /></a>
      </div>
    </div>

    <Accordion />
  </div>
</template>

<script lang="ts">
import Accordion from "@/components/ui/Accordion.vue";
import LiquidityInfo from "@/components/stake/earnPoints/LiquidityInfo.vue";
import Totals from "@/components/stake/earnPoints/Totals.vue";

export default {
  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
    pointsStatistics: {
      type: Object,
      requared: true,
    },
    mobileMode: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {};
  },

  components: { LiquidityInfo, Totals, Accordion },
};
</script>

<style lang="scss" scoped>
.stake-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.audits {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 500;
}

.icons-wrap {
  gap: 20px;
  display: flex;
  align-items: center;
}

.guardian-audits {
  max-width: 124px;
  width: 100%;
}

.code4rena {
  max-width: 145px;
  width: 100%;
}
</style>
