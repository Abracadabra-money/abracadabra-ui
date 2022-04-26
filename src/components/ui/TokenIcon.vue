<template>
  <img class="token-icon" :src="tokenIcon" :alt="name" />
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
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 10px;
  margin-right: 10px;
}
</style>
