<template>
  <div class="reward-points-wrap">
    <ElixirPotionsBanner v-if="rewardPointsType === RewardPointsTypes.Elixir" />
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
    ElixirPotionsBanner: defineAsyncComponent(
      () =>
        import("@/components/pools/rewardPoints/elixir/ElixirPotionsBanner.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.reward-points-wrap {
  width: 100%;
}
</style>
