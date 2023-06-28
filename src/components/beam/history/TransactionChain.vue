<template>
  <div class="chain from">
    <img class="chain-icon" :src="chain.icon" />
    <div class="chain-info">
      <p class="name">{{ destination }}: {{ chain.name }}</p>
      <p class="address">
        {{ formatAddress(chain.address) }}
      </p>
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
      required: true,
    },
  },

  methods: {
    formatAddress(address) {
      return `${address.slice(0, 4)}...${address.slice(-3)}`;
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
