<template>
  <div class="empty-block">
    <img class="icon" :src="icon" alt="Icon" />
    <p class="text">{{ text }}</p>
  </div>
</template>

<script>
import { useImage } from "@/helpers/useImage";
export default {
  props: {
    isFarmsLoading: { type: Boolean },
  },

  computed: {
    icon() {
      return this.isFarmsLoading
        ? useImage("assets/gifs/MIM_loader.gif")
        : useImage("assets/images/empty.png");
    },

    text() {
      return this.isFarmsLoading ? "Loading farms." : "There are no farms.";
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-block {
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
  font-weight: 600;
  line-height: 150%;
}
</style>
