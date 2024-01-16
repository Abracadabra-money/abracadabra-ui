<template>
  <div class="search-empty">
    <img class="icon" src="@/assets/images/not-found.png" :alt="text" />
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
  display: flex;
  gap: 12px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 60px 0;
}

.icon {
  max-width: 300px;
  width: 100%;
}

.text {
  text-align: center;
  font-weight: 600;
  line-height: 150%;
}
</style>
