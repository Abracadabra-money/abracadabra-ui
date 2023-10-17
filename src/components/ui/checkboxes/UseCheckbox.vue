<template>
  <div
    class="checkbox"
    :class="{ active }"
    @click="actionHandler"
    v-if="isVisibility"
  >
    <img class="checkbox-icon" :src="checkboxIcon" alt="Checkbox" />
    <p>Use {{ tokenSymbol }}</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { useImage } from "@/helpers/useImage";
export default {
  props: {
    config: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      active: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      getChainById: "getChainById",
    }),

    isVisibility() {
      if (!this.config) return false;
      const { cauldronSettings, wrapInfo } = this.config;
      if (cauldronSettings?.acceptUseDefaultBalance) return true;
      if (!!wrapInfo && !wrapInfo?.isHiddenWrap) return true;
      return false;
    },

    checkboxIcon() {
      const icon = this.active ? "active" : "default";
      return useImage(`assets/images/checkbox/${icon}.svg`);
    },

    tokenSymbol() {
      if (this.config?.cauldronSettings?.acceptUseDefaultBalance)
        return this.getChainById(this.chainId).symbol;
      return this.config.collateralInfo.name;
    },
  },

  methods: {
    actionHandler() {
      this.active = !this.active;
      this.$emit("toggle", this.active);
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox {
  background: #333141;
  border-radius: 20px;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  border: 2px solid transparent;
  cursor: pointer;
  gap: 8px;
}

.active {
  border: 2px solid #8180ff;
}

.checkbox-icon {
  width: 24px;
  height: 24px;
}
</style>
