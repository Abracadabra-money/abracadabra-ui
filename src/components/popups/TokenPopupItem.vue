<template>
  <button @click="$emit('click')" class="token-wrap">
    <div class="token-data">
      <img class="token-icon" :src="icon" alt="token" />
      <p>{{ name }}</p>
    </div>
    <div class="token-value">
      <p>
        {{ showBalance }}
      </p>
      <p v-if="balance !== '0.0'">$ {{ showPrice }}</p>
    </div>
  </button>
</template>

<script>
export default {
  name: "TokenPopupItem",
  props: {
    name: {
      type: String,
      default: "",
    },
    balance: {
      type: String,
      default: "",
    },
    price: {
      type: [Number, String],
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
  },
  computed: {
    showBalance() {
      return parseFloat(this.balance).toFixed(4);
    },
    showPrice() {
      return parseFloat(Number(this.balance) * Number(this.price)).toFixed(4);
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

.token-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  background-color: white;
  border-radius: 10px;
  margin-right: 10px;
}

.token-value {
  text-align: right;
}
</style>
