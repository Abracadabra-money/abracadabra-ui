<template>
  <div class="market-item-wrap">
    <StatusBar :pool="configItem" :small="true" />
    <button @click="choseItem(marketItem)" class="market-item">
      <div class="cauldron-info">
        <BaseTokenIcon :icon="configItem.icon" :name="configItem.name" />
        <div>
          <span>{{ configItem.name }}</span>
          <span class="tooltip" v-tooltip="'Interest'"
            >{{ marketItem.interest }}%</span
          >
          <MiniStatusTag v-if="isMigrated" />
          <MiniStatusTag v-if="isUnrappedToken" text="Leverage" />
        </div>
      </div>

      <div class="cauldron-balance" v-if="isUnrappedToken">
        <p>
          {{ formatTokenBalance(userInfo.collateralAmount) }}
          {{ configItem.name }}
        </p>
        <p>
          {{ formatTokenBalance(userInfo.unwrappedTokenAmount) }}
          {{ configItem.wrapInfo.unwrappedToken.name }}
        </p>
        <p class="price" v-if="userTotalBalance">
          Total amount: {{ formatUSD(userTotalBalance) }}
        </p>
      </div>

      <div class="cauldron-balance" v-else>
        <p>{{ formatTokenBalance(userInfo.collateralAmount) }}</p>
        <p class="price" v-if="+userInfo.collateralAmount">
          {{ formatUSD(userInfo.collateralAmountUsd) }}
        </p>
      </div>
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import filters from "@/filters/index.js";
import StatusBar from "@/components/ui/StatusBar.vue";
import MiniStatusTag from "@/components/ui/MiniStatusTag.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";

export default {
  props: {
    marketItem: {
      type: Object,
      require: true,
    },
  },

  computed: {
    ...mapGetters({ chainId: "getChainId" }),

    configItem() {
      return this.marketItem.config;
    },

    userInfo() {
      return this.marketItem.userInfo;
    },

    isMigrated() {
      return !!this.configItem.cauldronSettings?.isMigrated;
    },

    isUnrappedToken() {
      return (
        this.configItem?.wrapInfo && !this.configItem?.wrapInfo?.isHiddenWrap
      );
    },

    userTotalBalance() {
      return (
        +this.userInfo.collateralAmountUsd +
        +this.userInfo.unwrappedTokenAmountUsd
      );
    },
  },

  methods: {
    formatUSD(value) {
      return filters.formatUSD(value);
    },

    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },

    choseItem(item) {
      this.$emit("changeActiveMarket", item.config.id);
    },
  },

  components: {
    StatusBar,
    BaseTokenIcon,
    MiniStatusTag,
  },
};
</script>

<style lang="scss" scoped>
.market-item-wrap {
  padding: 10px 12px;
  border-radius: 20px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &::after {
    content: "";
    position: absolute;
    width: 90%;
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    bottom: 0;
    left: 5%;
  }
}

.market-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #fff;
}

.cauldron-info {
  display: flex;
  align-items: center;
}

.tooltip {
  display: inline-block;
  margin-left: 5px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.cauldron-balance {
  text-align: right;
}

.price {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 21px;
}
</style>
