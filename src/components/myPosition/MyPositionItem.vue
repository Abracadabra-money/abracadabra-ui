<template>
  <div
    class="position-item"
    @click="enterPosition"
    :class="{ active: activePosition === inx }"
  >
    <img class="position-icon" :src="item.icon" alt="" />
    <div class="position-info">
      <div class="info">
        <div class="info-top">
          <p class="info-name">{{ item.name }}</p>
          <div class="info-status" :class="status">{{ item.status }}</div>
        </div>
        <div class="info-wrap">
          <div class="info-item">
            <p class="info-text">Collateral deposited</p>
            <p class="info-value">{{ item.collateral }}</p>
            <p class="info-text">$ {{ item.total }}</p>
          </div>
          <div class="info-item">
            <p class="info-text">MIM Borrowed</p>
            <p class="info-value">{{ item.borrowed }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      require: true,
    },
    activePosition: {
      type: Number,
    },
    inx: {
      type: Number,
    },
  },

  computed: {
    status() {
      if (this.item.status === "Safe") return "safe";
      if (this.item.status === "Medium") return "medium";
      if (this.item.status === "High") return "high";
      return false;
    },
  },

  methods: {
    enterPosition() {
      this.$emit("enterPosition", this.inx);
    },
  },
};
</script>

<style lang="scss" scoped>
.position-item {
  display: flex;
  cursor: pointer;
  padding: 20px 10px 0;
}

.position-item:not(:last-child) {
  margin-bottom: 20px;
}

.position-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
}

.position-info {
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-name {
  margin: 4px 0;
  line-height: 24px;
}

.info-wrap {
  display: flex;
}

.info-row {
  display: flex;
}

.info-item:not(:last-child) {
  margin-right: 30px;
}

.info-text {
  font-size: 14px;
  line-height: 21px;
  color: rgba(255, 255, 255, 0.6);
}

.info-value {
  margin: 4px 0;
}

.info-status {
  width: 60px;
  height: 30px;
  border-radius: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 18px;
}

.active {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(100px);
  border-radius: 20px;
  .position-info {
    border: transparent;
  }
}

.safe {
  background: #63caf8;
}

.medium {
  background: #ffb800;
}

.high {
  background: #fe1842;
}
</style>
