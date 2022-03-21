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
        console.log("iconObj.tokenName", iconObj.tokenName === this.token);
        if (iconObj.tokenName === this.token) {
          icon = iconObj.tokenIcon;
        }
      });

      if (icon) return icon;
      return require(`@/assets/images/tokens-icon/Token_ETH.svg`);
    },
  },

  created() {
    console.log("iconArray", iconArray);
  },

  methods: {},
};
</script>

<style lang="scss" scoped></style>
