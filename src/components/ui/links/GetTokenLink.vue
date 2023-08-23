<template>
  <a
    class="get-token-link"
    :style="styles"
    :href="data.href"
    target="_blank"
    rel="noreferrer noopener"
  >
    <img class="icon" src="@/assets/images/deposit.svg" alt="Deposit" />
    {{ data.label }}
  </a>
</template>

<script>
export default {
  props: {
    data: {},
    background: { type: String, default: "rgba(157, 244, 255, 0.2)" },
    color: { type: String, default: "#63caf8" },
  },

  computed: {
    styles() {
      return `
        background: ${this.background};
        border: ${this.color}`;
    },
  },
};
</script>
<style>
.get-token-link {
  background: rgba(157, 244, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 3px 8px;
  color: #63caf8;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.icon {
  margin-right: 5px;
}
</style>
