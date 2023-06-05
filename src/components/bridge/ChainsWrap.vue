<template>
  <div class="chains-wrap">
    <div class="select-item" @click="$emit('changeNetwork', 'from')">
      <h3 class="title">Origin Chain</h3>
      <div class="description">
        <img class="chain-icon" :src="fromChain.icon" alt="Icon" />
        <p>{{ fromChain.title }}</p>
      </div>
    </div>

    <img
      class="switch-chain"
      @click="$emit('switchChain')"
      src="@/assets/images/bridge/bridge-refresh.svg"
      alt="Switch network"
    />

    <div class="select-item" @click="$emit('changeNetwork', 'to')">
      <h3 class="title">Destination Chain</h3>
      <div class="description">
        <img class="chain-icon" :src="toChain.icon" alt="" />
        <p>{{ toChain.title }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    fromChain: {
      type: Object,
      require: true,
    },

    toChain: {
      type: Object,
      require: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.chains-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 30px;
}

.select-item {
  width: 200px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 16px;
  cursor: pointer;
}

.title {
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  margin-bottom: 8px;
}

.description {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
}

.chain-icon {
  width: 60px;
  height: 60px;
}

.switch-chain {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

@media (max-width: 600px) {
  .chains-wrap {
    flex-direction: column;
    gap: 15px;
  }

  .select-item {
    width: 100%;
  }
}
</style>
