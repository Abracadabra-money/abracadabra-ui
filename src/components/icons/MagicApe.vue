<template>
  <img
    class="ape-icon"
    src="@/assets/images/ape/ape.png"
    v-if="isVisibility"
    alt="Ape icon"
  />
</template>

<script>
export default {
  props: {
    cauldron: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isVisibility() {
      return !!this.cauldron?.config?.cauldronSettings?.isMagicApe;
    },
  },
};
</script>

<style lang="scss" scoped>
.ape-icon {
  max-width: 27px;
  margin: 0 10px;
}
</style>
