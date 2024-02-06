<template>
  <img
    class="token-icon"
    :src="tokenIcon"
    :alt="name"
    :style="{ height: size, width: size }"
  />
</template>

<script lang="ts">
import { useImage } from "@/helpers/useImage";

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
    },
    size: {
      type: String,
      default: "32px",
    },
  },
  data() {
    return {
      defaultToken: useImage("assets/images/base_token_icon.png"),
      selectIcon: useImage("assets/images/base_select_icon.png"),
    };
  },

  computed: {
    tokenIcon() {
      if (this.icon) return this.icon;
      if (this.type === "select") return this.selectIcon;

      return this.defaultToken;
    },
  },
};
</script>

<style lang="scss" scoped>
.token-icon {
  object-fit: contain;
  margin-right: 10px;
}
</style>
