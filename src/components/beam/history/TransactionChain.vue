<template>
  <div class="chain from">
    <img class="chain-icon" :src="chain.icon" />
    <div class="chain-info">
      <p class="name">{{ destination }}: {{ chain.title }}</p>
      <p class="address">{{ formatAddress }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    chain: {
      type: Object,
      required: true,
    },
    destination: {
      type: String,
      default: "From",
    },
    address: {
      type: String,
      required: true,
    },
  },

  computed: {
    formatAddress() {
      return `${this.address.slice(0, 4)}...${this.address.slice(-3)}`;
    },
  },
};
</script>

<style lang="scss" scoped>
.chain {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chain-icon {
  height: 32px;
  width: 32px;
  border-radius: 50px;
}
.chain-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.name {
  text-transform: capitalize;
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  letter-spacing: 0.35px;
}

.address {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  letter-spacing: 0.3px;
}
</style>
