<template>
  <a class="link" @click="click">
   <slot></slot>
  </a>
</template>

<script>

export default {
  methods: {
    click() {
      this.$emit('click');
    }
  }
};
</script>

<style lang="scss" scoped>

  .link {
    cursor: pointer;
    font-family: Prompt;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.035em;
    background: -webkit-linear-gradient(107.5deg, #5282FD -3.19%, #76C3F5 101.2%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

</style>
