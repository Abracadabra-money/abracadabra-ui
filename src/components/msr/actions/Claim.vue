<template>
  <div class="action">
    <div class="apr-efficiency">
      <div class="title-tooltip">
        Your APR Efficiency
        <QuestionMarkIcon v-tooltip="'Your APR Efficiency'" />
      </div>

      <div class="efficiency-indicator"></div>
    </div>

    <Assets />

    <Rewards />

    <EpochTimeLine :mimSavingRateInfo="mimSavingRateInfo" />
    <BaseButton class="action-button" primary>Claim</BaseButton>
  </div>
</template>

<script>
import BaseButton from "@/components/base/BaseButton.vue";
import EpochTimeLine from "@/components/msr/EpochTimeLine.vue";
import QuestionMarkIcon from "@/components/ui/icons/Tooltip.vue";
import Assets from "@/components/msr/Assets.vue";
import Rewards from "@/components/msr/Rewards.vue";

export default {
  props: {
    mimSavingRateInfo: { type: Object },
  },

  data() {
    return {};
  },

  computed: {},

  methods: {},

  components: {
    BaseButton,
    EpochTimeLine,
    QuestionMarkIcon,
    Assets,
    Rewards,
  },
};
</script>

<style lang="scss" scoped>
.apr-efficiency {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.efficiency-indicator {
  width: 418px;
  height: 12px;
  border-radius: 12px;
  background: rgba(109, 248, 114, 0.2);
  margin: auto;
}
</style>
