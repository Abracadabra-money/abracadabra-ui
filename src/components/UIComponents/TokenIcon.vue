<template>
  <img
    v-if="tokenIcon"
    :src="tokenIcon"
    :alt="isNetwork ? 'network' : 'token'"
    :style="{ height }"
  />
</template>

<script>
export default {
  props: {
    imageName: {
      type: String,
      default: null,
    },
    itsImgURL: {
      type: Boolean,
      default: false,
    },
    isNetwork: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
      default: "32px",
    },
  },
  computed: {
    tokenIcon() {
      try {
        if (this.itsImgURL) return this.imageName;

        const folderName = this.isNetwork ? "networks" : "tokens";

        return require(`@/assets/images/${folderName}/${this.imageName}`);
      } catch (e) {
        console.log("tokenIcon err:", e);

        return require(`@/assets/images/select.svg`);
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
