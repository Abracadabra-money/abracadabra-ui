<template>
  <img class="token-icon" :src="icon" alt="token" />
</template>

<script>
import iconArray from "@/utils/tokenIcon";

export default {
  props: {
    token: {
      type: String,
      default: "ETH",
    },
  },
  data() {
    return {};
  },

  computed: {
    icon() {
      let icon;
      iconArray.forEach((iconObj) => {
        if (iconObj.tokenName === this.token) {
          icon = iconObj.tokenIcon;
        }
      });

      if (icon) return icon;
      return require(`@/assets/images/tokens-icon/Token_ETH.svg`);
    },
  },
};
</script>

<style lang="scss" scoped>
.token-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  background-color: white;
  border-radius: 10px;
  margin-right: 10px;
}
</style>
