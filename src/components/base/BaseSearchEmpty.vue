<template>
  <div class="search-empty">
    <img
      class="icon"
      src="@/assets/images/cauldrons/empty.png"
      alt="Empty icon"
    />
    <p class="text">{{ text }}</p>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.search-empty {
  padding: 100px 0;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.icon {
  width: 120px;
  height: 120px;
}

.text {
  text-align: center;
  font-weight: 600;
  line-height: 150%;
}
</style>
