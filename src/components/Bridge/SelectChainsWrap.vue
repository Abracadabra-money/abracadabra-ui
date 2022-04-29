<template>
  <div class="network-wrap">
    <div class="network-item">
      <h5 class="network-title">Origin Chain</h5>
      <div class="select-network" @click="handlerNetwork('from')">
        <div class="icon-wrap">
          <div class="token-icon-wrap">
            <img
              class="token-icon"
              :src="fromChain.icon"
              :alt="fromChain.title"
            />
          </div>
          <p class="network-name">{{ fromChain.title }}</p>
        </div>
        <img
          class="network-arrow"
          src="@/assets/images/arrow-down.svg"
          alt="Arrow Down"
        />
      </div>
    </div>
    <img
      class="switch-network"
      @click="switchHandle"
      src="@/assets/images/swith.svg"
      alt="Switch network"
    />
    <div class="network-item">
      <h5 class="network-title">Destination Chain</h5>
      <div class="select-network" @click="handlerNetwork('to')">
        <div class="icon-wrap">
          <div class="token-icon-wrap">
            <img class="token-icon" :src="toChain.icon" :alt="toChain.title" />
          </div>
          <p class="network-name">{{ toChain.title }}</p>
        </div>
        <img
          class="network-arrow"
          src="@/assets/images/arrow-down.svg"
          alt="Arrow Down"
        />
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

  methods: {
    handlerNetwork(action) {
      this.$emit("handlerNetwork", action);
    },

    switchHandle() {
      this.$emit("switchHandle");
    },
  },
  mounted() {
    console.log("fromChain", this.fromChain);
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

.token-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.token-icon {
  width: 32px;
  height: 32px;
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

.network-arrow {
  margin-left: 10px;
}
</style>
