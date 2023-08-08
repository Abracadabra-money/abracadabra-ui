<template>
  <div class="wrapper" v-if="link">
    <a class="link" :href="link" target="_blank">{{ title }}</a>
    <img class="arrow" src="@/assets/images/beam/arrow-link.png" />
  </div>
  <div class="loader-wrap" v-else>
    <BaseLoader type="loader" />
  </div>
</template>

<script>
import BaseLoader from "@/components/base/BaseLoader.vue";
export default {
  props: {
    link: {
      type: [String, Boolean],
    },
    title: {
      type: String,
      default: "Explorer",
    },
  },

  components: {
    BaseLoader,
  },
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}
.link {
  letter-spacing: normal;
}

.arrow {
  width: 16px;
  height: 16px;
}

.loader-wrap {
  width: 50px;
  display: flex;
  justify-content: center;
}
</style>
