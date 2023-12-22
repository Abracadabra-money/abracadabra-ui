<template>
  <div class="switch" v-if="!isDeprecated">
    <button
      v-for="(item, i) in items"
      class="switch-btn"
      :class="{ 'switch-btn-active': name === item.name }"
      :key="i"
      @click="$emit('select', item)"
      :disabled="currentName === item.name"
    >
      {{ item.title }}
    </button>
  </div>

  <div class="depreciated" v-if="isDeprecated">
    <img
      class="depreciated-icon"
      src="@/assets/images/info-bar/depreciated.png"
    />
    <div class="depreciated-text">
      <h4 class="title">Depreciated</h4>
      <p class="description">Only unstake available</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MarketsSwitch",
  props: {
    name: {
      type: String,
    },
    items: {
      type: Array,
      default: () => [],
    },
    isDeprecated: { type: Boolean },
  },

  emits: ["select"],

  computed: {
    currentName() {
      return this.$route.name;
    },
  },
};
</script>

<style lang="scss" scoped>
.switch {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 220px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  background: rgba(16, 18, 23, 0.38);
  padding: 6px;
}

.switch-btn {
  padding: 6px 24px;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.switch-btn-active {
  color: #7088cc;
  background-color: rgba(111, 111, 111, 0.06);
}

.depreciated {
  display: flex;
  padding: 6px 16px;
  align-items: center;
  gap: 4px;
  border-radius: 12px;
  border: 1px solid rgba(56, 12, 13, 0);
  background: linear-gradient(
    103deg,
    rgba(50, 10, 10, 0.32) 2.48%,
    rgba(135, 29, 31, 0.32) 100%
  );
  box-shadow: 0px 4px 9px 0px rgba(230, 92, 92, 0.08);
}

.depreciated-icon {
  width: 28px;
  height: 28px;
}

.depreciated-text {
  display: flex;
  flex-direction: column;
}

.depreciated-text .title {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.depreciated-text .description {
  color: #878b93;
  font-size: 12px;
  font-weight: 400;
}
</style>
