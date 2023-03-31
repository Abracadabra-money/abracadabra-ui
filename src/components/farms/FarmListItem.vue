<template>
  <button @click="$emit('click')" class="farm-list-item">
    <StatusBar :isFarm="true" :pool="farmItem" :small="true" />
    <div class="token-wrap">
      <div class="token-data">
        <BaseTokenIcon :icon="icon" :name="name" />
        <p>{{ name }}</p>
      </div>
      <div v-if="balance !== null" class="token-value">
        <p>
          {{ formatTokenBalance(balance) }}
        </p>
        <p v-if="+balance !== 0">{{ formatUSD(balanceInUSD) }}</p>
      </div>
    </div>
  </button>
</template>

<script>
import { defineAsyncComponent } from "vue";
import filters from "@/filters/index.js";
export default {
  name: "TokenPopupItem",
  components: { 
    BaseTokenIcon: defineAsyncComponent(() => import("@/components/base/BaseTokenIcon.vue")), 
    StatusBar: defineAsyncComponent(() => import("@/components/ui/StatusBar.vue")) 
  },
  props: {
    farmItem: {
      type: Object,
      require: true,
    },
    name: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: null,
    },
    balance: {
      type: String,
      default: "",
    },
    price: {
      type: [Number, String],
      default: null,
    },
  },
  computed: {
    balanceInUSD() {
      return Number(this.balance) * Number(this.price);
    },
  },
  methods: {
    formatUSD(value) {
      return filters.formatUSD(value);
    },
    formatTokenBalance(value) {
      return filters.formatTokenBalance(value);
    },
  }
};
</script>

<style lang="scss" scoped>
.farm-list-item {
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
.token-wrap {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 5px 0;
}

.token-data {
  display: flex;
  align-items: center;
}

.token-value {
  text-align: right;
}
</style>
