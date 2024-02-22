<template>
  <div class="action">
    <div class="apr-efficiency">
      <div class="title-tooltip">
        Your APR Efficiency
        <QuestionMarkIcon v-tooltip="'Your APR Efficiency'" />
      </div>

      <div class="efficiency-indicator"></div>
    </div>

    <BaseTokenInput />
    <EpochTimeLine />
    <BaseButton class="action-button" primary>Claim</BaseButton>
  </div>
</template>

<script>
import BaseTokenInput from "@/components/base/BaseTokenInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import EpochTimeLine from "@/components/msr/EpochTimeLine.vue";
import QuestionMarkIcon from "@/components/ui/icons/Tooltip.vue";

export default {
  data() {
    return {};
  },

  computed: {},

  methods: {},

  components: { BaseTokenInput, BaseButton, EpochTimeLine, QuestionMarkIcon },
};
</script>

<style lang="scss" scoped>
.efficiency-indicator {
  width: 418px;
  height: 12px;
  border-radius: 12px;
  background: rgba(109, 248, 114, 0.2);
}
</style>
