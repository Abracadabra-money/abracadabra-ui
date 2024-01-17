<template>
  <button
    class="deposit-button"
    v-if="!!depositConfig"
    @click.stop="openCollateralPopup"
  >
    <span class="inner-wrap">
      {{ depositConfig.title }}
      <ArrowTopRight />
    </span>
  </button>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { getAdditionalStakeConfig } from "@/helpers/stake/getAdditionalStakeConfig";
import { defineAsyncComponent } from "vue";
export default {
  props: {
    cauldron: { type: Object, required: true },
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    depositConfig(): any {
      return getAdditionalStakeConfig(
        this.cauldron.config.id,
        this.cauldron.config.chainId
      );
    },
  },

  methods: {
    openCollateralPopup() {
      // @ts-ignore
      this.$store.commit("setPopupState", {
        type: this.depositConfig.type,
        isShow: true,
        data: this.depositConfig?.data,
      });
    },
  },

  components: {
    ArrowTopRight: defineAsyncComponent(
      () => import("@/components/ui/icons/ArrowTopRightIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.deposit-button {
  padding: 1px;
  background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
  border-radius: 8px;
  border: transparent;
}

.inner-wrap {
  height: 30px;
  padding: 5px 8px;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #1a1f3d;
  color: #7088cc;
  font-size: 12px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.36px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #191f2f;
    box-shadow: 0px 0px 4px 0px rgba(255, 255, 255, 0.13);
    color: #86a2f1;
  }
}
</style>
