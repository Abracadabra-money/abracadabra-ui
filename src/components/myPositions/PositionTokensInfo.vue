<template>
  <div class="token-info">
    <BaseTokenIcon :name="tokenSymbol" :icon="tokenIcon" size="80px" />
    <div>
      <p class="token-name">
        {{ tokenSymbol }}
        <StatusBar :isFarm="true" :pool="position" :small="true" />
      </p>
      <p class="token-rate" v-if="tokenName">{{ tokensRate }}</p>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { ethers } from "ethers";
import StatusBar from "@/components/ui/StatusBar.vue";
export default {
  props: {
    position: {
      type: Object,
      required: true,
    },
    tokenName: {
      type: String,
    },
  },

  computed: {
    tokenIcon() {
      return this.position?.config?.icon || this.position?.icon;
    },

    tokenSymbol() {
      if (this.tokenName) return this.tokenName;
      return this.position?.config?.collateralInfo?.name || this.position?.name;
    },

    oracleRate() {
      return ethers.utils.formatUnits(
        this.position.oracleRate,
        this.position.config.collateralInfo.decimals
      );
    },

    tokenToMim() {
      return filters.formatToFixed(1 / this.oracleRate, 4);
    },

    tokensRate() {
      return `1 ${this.tokenName} = ${this.tokenToMim} ${this.position.config.mimInfo.name}`;
    },
  },

  components: {
    BaseTokenIcon,
    StatusBar,
  },
};
</script>

<style lang="scss" scoped>
.token-info {
  width: 100%;
  display: flex;
  align-items: center;
}

.token-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
}

.token-rate {
  font-size: 14px;
  line-height: 21px;
  color: rgba(255, 255, 255, 0.8);
}
</style>
