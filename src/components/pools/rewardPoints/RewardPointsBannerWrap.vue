<template>
  <div class="reward-points-banner-wrap">
    <div class="promo-text">
      Earning
      <span class="points-type">{{ "" + rewardPointsType + "" }}</span>
      Rewards
      <a class="reward-link" href="">
        <img class="reward-link-icon" src="@/assets/images/open-link.svg" />
      </a>
    </div>

    <RewardPointsTagWrap icon multiplier :rewardPointsType />
  </div>
</template>

<script lang="ts">
import { RewardPointsTypes } from "@/configs/pools/types";
import { defineAsyncComponent, type PropType } from "vue";

export default {
  props: {
    rewardPointsType: {
      type: String as PropType<RewardPointsTypes>,
      required: true,
    },
  },

  data() {
    return { RewardPointsTypes };
  },

  components: {
    RewardPointsTagWrap: defineAsyncComponent(
      () => import("@/components/pools/rewardPoints/RewardPointsTagWrap.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.reward-points-banner-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.promo-text {
  display: flex;
  align-items: center;
  gap: 4px;
}

.points-type {
  text-transform: capitalize;
}

.reward-link {
  display: flex;
  align-items: center;
}

.reward-link-icon {
  width: 20px;
  height: 20px;
}
</style>
