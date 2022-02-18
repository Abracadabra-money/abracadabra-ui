<template>
  <div class="tabs">
    <button
      class="tab"
      :class="{ active: activeTab === 'repay' }"
      @click="handleTab('repay')"
    >
      Repay MIMs
    </button>
    <button
      class="tab"
      :class="{ active: activeTab === 'collateral' }"
      @click="handleTab('collateral')"
    >
      Remove Collateral
    </button>
    <button
      class="tab"
      :class="{ active: activeTab === 'deleverage' }"
      @click="handleTab('deleverage')"
    >
      Deleverage
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "repay",
    };
  },

  methods: {
    handleTab(name) {
      this.activeTab = name;
      this.$emit("activeTab", name);
    },
  },
};
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  max-width: 525px;
  margin: 0 auto;
  justify-content: space-between;
}
.tab {
  max-width: 155px;
  width: 100%;
  line-height: 24px;
  padding: 15px 0;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(40px);
  border-radius: 20px;
  color: #fff;
  border: none;
  outline: transparent;
  cursor: pointer;
}

.active {
  background: rgba(255, 255, 255, 0.2);
}
</style>
