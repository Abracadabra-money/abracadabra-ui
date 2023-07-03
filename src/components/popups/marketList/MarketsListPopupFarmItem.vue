<template>
  <button class="market-item" @click="choseItem(marketItem)">
    <StatusBar :isFarm="true" :pool="marketItem" :small="true" />
    <div class="market-info">
      <div class="token-info">
        <BaseTokenIcon :icon="marketItem.icon" :name="marketItem.name" />
        <p>{{ marketItem.name }}</p>
      </div>
      <div class="price" v-if="balance">
        <p>{{ formatTokenBalance(balance) }}</p>
        <p v-if="balance">{{ formatUSD(balanceInUSD) }}</p>
      </div>
    </div>
  </button>
</template>

<script>
import filters from "@/filters/index.js";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import StatusBar from "@/components/ui/StatusBar.vue";

export default {
  props: {
    marketItem: {
      type: Object,
      require: true,
    },
  },

  computed: {
    balance() {
      return +this.marketItem.accountInfo?.balance || 0;
    },

    balanceInUSD() {
      return this.balance * +this.marketItem.lpPrice;
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
      this.$emit("changeActiveMarket", item.id);
    },
  },

  components: {
    BaseTokenIcon,
    StatusBar,
  },
};
</script>

<style lang="scss" scoped>
.market-item {
  padding: 10px 12px;
  background-color: transparent;
  border: none;
  border-radius: 20px;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;

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

.market-info {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 5px 0;
}

.token-info {
  display: flex;
  align-items: center;
}

.price {
  text-align: right;
}
</style>
