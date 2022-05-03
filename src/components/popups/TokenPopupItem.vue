<template>
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
</template>

<script>
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");

export default {
  name: "TokenPopupItem",
  components: { BaseTokenIcon },
  props: {
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
.token-wrap {
  display: flex;
  justify-content: space-between;
  padding: 14px 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
  min-height: 65px;
}

.token-data {
  display: flex;
  align-items: center;
}

.token-value {
  text-align: right;
}
</style>
