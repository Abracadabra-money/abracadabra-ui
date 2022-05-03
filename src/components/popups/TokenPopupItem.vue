<template>
  <div class="farm-list-item">
    <StatusBar :isFarm="true" :pool="farmItem" />
    <button @click="$emit('click')" class="token-wrap">
      <div class="token-data">
        <BaseTokenIcon :icon="icon" :name="name" />
        <p>{{ name }}</p>
      </div>
      <div v-if="balance !== null" class="token-value">
        <p>
          {{ balance | formatTokenBalance }}
        </p>
        <p v-if="+balance !== 0">{{ balanceInUSD | formatUSD }}</p>
      </div>
    </button>
  </div>
</template>

<script>
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
const StatusBar = () => import("@/components/ui/StatusBar");
export default {
  name: "TokenPopupItem",
  components: { BaseTokenIcon, StatusBar },
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
};
</script>

<style lang="scss" scoped>
.farm-list-item {
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
.token-wrap {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
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
