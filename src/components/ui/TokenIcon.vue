<template>
  <img
    class="token-icon"
    :src="icon"
    alt="token"
    :style="{ height: size, minWidth: size, backgroundColor: bgColor }"
  />
</template>

<script>
import iconArray from "@/utils/tokenIcon";

export default {
  props: {
    token: {
      type: String,
      default: "ETH",
    },
    size: {
      type: String,
      default: "32px",
    },
    bgColor: {
      type: String,
      default: "white",
    },
  },
  data() {
    return {};
  },

  computed: {
    icon() {
      const icon = iconArray.find(({ tokenName }) =>
        typeof tokenName === "string"
          ? tokenName.toUpperCase() === this.token.toUpperCase()
          : tokenName.some(
              (name) => name.toUpperCase() === this.token.toUpperCase()
            )
      )?.tokenIcon;

      if (icon) return icon;
      return require(`@/assets/images/farmIcons/Token_ETH.svg`);
    },
  },
};
</script>

<style lang="scss" scoped>
.token-icon {
  object-fit: contain;
  border-radius: 10px;
  margin-right: 10px;
}
</style>
