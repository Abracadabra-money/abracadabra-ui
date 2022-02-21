<template>
  <a class="default-button" :style="{'width': setWidth()}" :class="{primary: primary, disabled: (disabled || loading)}" @click="onClick">
    <div><slot></slot></div>
    <span v-if="loading" class="loader"></span>
  </a>
</template>

<script>
export default {
  name: "Button",
  props: {
    primary: {
      type: Boolean
    },
    loading: {
      type: Boolean
    },
    width: {
      type: String
    },
    disabled: {
      type: Boolean
    }
  },
  methods: {
    setWidth() {
      return this.width ? this.width : '100%'
    },
    onClick() {
      if (!this.disabled)
        this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.default-button {
  cursor: pointer;
  position: relative;
  border-radius: 20px;
  height: 50px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Prompt;
  font-style: normal;
  z-index: 0;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  overflow: hidden;
  border: 2px solid #648FCC;
  &.disabled {
    cursor: not-allowed;
  }
  &.primary {
    line-height: 50px;
    background: linear-gradient(107.5deg, #5552FD -3.19%, #76C3F5 101.2%);
    border: none;
    &:hover {
      background: linear-gradient(90deg, #7C82FD 0%, #8EC2F9 100%);
    }
    &.disabled {
      background: linear-gradient(107.5deg, rgba(85, 82, 253, 0.2) -3.19%, rgba(118, 195, 245, 0.2) 101.2%);
    }
  }
  &:not(.primary) {
    &:hover:not(.disabled) {
      border: 2px solid #62A5D3;
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), rgba(255, 255, 255, 0.1);
    }
    &.disabled {
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.6);
    }
  }
}
.loader
{
    margin-left: 19px;
    position: relative;
    display: block;
    width: 10px;
    height: 30px;

    -webkit-animation: rectangle infinite 1s ease-in-out -.2s;
       -moz-animation: rectangle infinite 1s ease-in-out -.2s;
         -o-animation: rectangle infinite 1s ease-in-out -.2s;
            animation: rectangle infinite 1s ease-in-out -.2s;

    background-color: #fff;
}
.loader:before,
.loader:after
{
    position: absolute;

    width: 8px;
    height: 8px;

    content: '';

    background-color: #fff;
}
.loader:before
{
    left: -10px;
    animation: rectangle infinite 1s ease-in-out -.4s;
}
.loader:after
{
    right: -10px;
    animation: rectangle infinite 1s ease-in-out;
}

@keyframes rectangle
{
    0%,
    80%,
    100%
    {
        height: 6px;
    }
    40%
    {   
        height: 8px;
    }
}
</style>

