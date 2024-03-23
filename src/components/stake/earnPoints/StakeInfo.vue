<template>
  <div class="stake-info">
    <div class="launch-wrap">
      <div>
        <!-- <h3 class="launch-title">The LLE Event has concluded!</h3> -->
        <h4 class="launch-subtitle">
          The MIMswap infrastructure is being deployed, Phase 3 is coming!
          <br />
          Stay tuned in the next 24 hours!
        </h4>
      </div>

      <router-link class="launch-link" :to="{ name: 'BlastOnboarding' }">
        Launch
      </router-link>
    </div>

    <LiquidityInfo :stakeInfo="stakeInfo" v-if="!mobileMode" />

    <Totals
      :stakeInfo="stakeInfo"
      :pointsStatistics="pointsStatistics"
      :timeInfo="timeInfo"
    />

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

    <PointsInfo />
  </div>
</template>

<script lang="ts" scoped>
import Accordion from "@/components/ui/Accordion.vue";
import LiquidityInfo from "@/components/stake/earnPoints/LiquidityInfo.vue";
import Totals from "@/components/stake/earnPoints/Totals.vue";
import PointsInfo from "@/components/stake/earnPoints/PointsInfo.vue";

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
    timeInfo: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {};
  },

  components: { LiquidityInfo, Totals, Accordion, PointsInfo },
};
</script>

<style lang="scss" scoped>
.stake-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.launch-wrap {
  width: 100%;
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
}

.launch-title {
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

.launch-subtitle {
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
}

.launch-link {
  max-width: 163px;
  width: 100%;
  height: 39px;
  border-radius: 10px;
  background: rgba(252, 253, 2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  transition: all 0.3s ease;

  &.disabled {
    background: rgba(252, 252, 3, 0.2);
    pointer-events: none;
  }

  &:hover {
    background: rgba(252, 253, 2, 0.8);
  }
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

@media screen and (max-width: 600px) {
  .audits {
    gap: 8px;
    flex-direction: column;
    align-items: flex-start;
  }

  .launch-wrap {
    display: none;
  }
}
</style>
