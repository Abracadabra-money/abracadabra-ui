<template>
  <div class="network-wrap">
    <div class="network-item">
      <h5 class="network-title">Network from bridge</h5>
      <div class="select-network" @click="handlerNetwork('from')">
        <div class="icon-wrap">
          <TokenIcon :url="fromChain.icon" :title="fromChain.title" />
          <p class="network-name">{{ fromChain.title }}</p>
        </div>
        <img src="@/assets/images/arrow-down.svg" alt="Arrow Down" />
      </div>
    </div>
    <img
      class="switch-network"
      src="@/assets/images/swith.svg"
      alt="Switch network"
    />
    <div class="network-item">
      <h5 class="network-title">Network to bridge</h5>
      <div class="select-network" @click="handlerNetwork('to')">
        <div class="icon-wrap">
          <TokenIcon :url="toChain.icon" :title="toChain.title" />
          <p class="network-name">{{ toChain.title }}</p>
        </div>
        <img src="@/assets/images/arrow-down.svg" alt="Arrow Down" />
      </div>
    </div>
  </div>
</template>

<script>
const TokenIcon = () => import("@/components/UIComponents/TokenIcon");
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

  methods: {
    handlerNetwork(action) {
      this.$emit("handlerNetwork", action);
    },
  },

  components: {
    TokenIcon,
  },
};
</script>

<style lang="scss" scoped>
.network-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.network-title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.025em;
  margin-bottom: 10px;
}

.switch-network {
  margin-top: 37px;
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.select-network {
  width: 220px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  padding: 14px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.icon-wrap {
  display: flex;
  align-items: center;
}

.network-name {
  font-size: 16px;
  line-height: 24px;
  margin-left: 10px;
}
</style>
