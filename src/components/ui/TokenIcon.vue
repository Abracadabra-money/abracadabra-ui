<template>
  <img
    class="token-icon"
    :src="tokenIcon"
    :alt="name"
    :style="{ height: size, minWidth: size }"
  />
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
    },
    name: {
      type: String,
      default: "Token",
    },
    type: {
      type: String,
      default: "token",
      // type = "select"
    },
    size: {
      type: String,
      default: "32px",
    },
  },
  data() {
    return {};
  },

  computed: {
    tokenIcon() {
      if (this.name === "MIM")
        return require(`@/assets/images/tokensIcon/Token_MIM.svg`);
      if (this.icon) return this.icon;
      if (this.type === "select") return require(`@/assets/images/select.svg`);

      return require(`@/assets/images/tokensIcon/Token_ETH.svg`);
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
