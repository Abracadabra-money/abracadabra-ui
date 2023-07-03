<template>
  <img
    class="scroll-top"
    src="@/assets/images/button-up.svg"
    @click="scrollTo"
    v-if="isShowScrollTop"
    alt="Scroll to top"
  />
</template>
<script>
export default {
  data() {
    return {
      scrollPosition: 0,
    };
  },

  computed: {
    isShowScrollTop() {
      return this.scrollPosition !== 0;
    },
  },
  methods: {
    scrollTo() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },

    onScroll() {
      this.scrollPosition = window.scrollY;
    },
  },

  created() {
    window.addEventListener("scroll", this.onScroll);
  },

  beforeUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  },
};
</script>
<style lang="scss" scoped>
.scroll-top {
  position: fixed;
  right: 10%;
  bottom: 10%;
  z-index: 9;
  cursor: pointer;
}
</style>
