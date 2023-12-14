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
    cauldronsLoading: { type: Boolean },
  },

  computed: {
    icon() {
      return this.cauldronsLoading
        ? useImage("assets/images/cauldrons/loader.gif")
        : useImage("assets/images/cauldrons/empty.png");
    },

    text() {
      return this.cauldronsLoading
        ? "Loading cauldrons."
        : "There are no cauldrons.";
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
