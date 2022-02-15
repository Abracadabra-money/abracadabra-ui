<template>
  <div class="position-type">
    <button
      class="type-btn"
      :class="{ active: isDegenBox }"
      @click="changeType('DegenBox')"
    >
      <img
        class="type-img"
        src="@/assets/images/myposition/degenbox.svg"
        alt="DegenBox"
      />
      <span class="type-text">DegenBox</span>
    </button>
    <button
      class="type-btn bentobox"
      :class="{ active: isBentoBox }"
      @click="changeType('BentoBox')"
    >
      <img
        class="type-img"
        src="@/assets/images/myposition/bentobox.svg"
        alt="BentoBox"
      />
      <span class="type-text">BentoBox</span>
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeType: null,
    };
  },

  computed: {
    isDegenBox() {
      return this.activeType === "DegenBox";
    },
    isBentoBox() {
      return this.activeType === "BentoBox";
    },
  },

  methods: {
    changeType(type) {
      this.activeType = type;
      this.$emit("changeType", type);
    },
  },
};
</script>

<style lang="scss" scoped>
.position-type {
  padding: 15px 0;
  display: flex;
  justify-content: center;
}

.type-btn {
  padding: 9px 10px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  outline: transparent;
  cursor: pointer;
}

.type-btn:not(:last-child) {
  margin-right: 40px;
}

.type-img {
  margin-right: 10px;
}

.type-text {
  font-size: 16px;
  line-height: 24px;
  color: #fff;
}

.active {
  background: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
}
</style>
