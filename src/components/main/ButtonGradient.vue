<template>
  <a class="button-gradient" :class="{primary: primary, disabled: disabled}" @click="onClick">
    <span class="button-gradient__inner" >
      <slot></slot>
    </span>
    <svg class="button-gradient__img" v-if="!primary" width="270" height="50" viewBox="0 0 270 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="paint0_linear_732_27606" x1="-11.3287" y1="1.94e-06" x2="83.7197" y2="161.877" gradientUnits="userSpaceOnUse">
          <stop stop-color="#6EA6F7"/>
          <stop offset="0.0001" stop-color="#8EBCFF"/>
          <stop offset="1" stop-color="#5FBEFC"/>
        </linearGradient>
      </defs>
      <path d="M0 20C0 8.9543 8.95431 0 20 0H250C261.046 0 270 8.95431 270 20V30C270 41.0457 261.046 50 250 50H20C8.95431 50 0 41.0457 0 30V20Z" fill="white" fill-opacity="0.1"/>
      <path d="M20 2H250V-2H20V2ZM268 20V30H272V20H268ZM250 48H20V52H250V48ZM2 30V20H-2V30H2ZM20 48C10.0589 48 2 39.9411 2 30H-2C-2 42.1503 7.84974 52 20 52V48ZM268 30C268 39.9411 259.941 48 250 48V52C262.15 52 272 42.1503 272 30H268ZM250 2C259.941 2 268 10.0589 268 20H272C272 7.84974 262.15 -2 250 -2V2ZM20 -2C7.84974 -2 -2 7.84973 -2 20H2C2 10.0589 10.0589 2 20 2V-2Z" fill="url(#paint0_linear_732_27606)" fill-opacity="0.8"/>
      
    </svg>
  </a>
</template>

<script>
export default {
  name: "Button",
  props: {
    primary: {
      type: Boolean
    },
    disabled: {
      type: Boolean
    }
  },
  methods: {
    onClick() {
      if (!this.disabled)
        this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.button-gradient {
  cursor: pointer;
  &.disabled {
    cursor: not-allowed;
  }
  &.primary {
    background: linear-gradient(107.5deg, #5552FD -3.19%, #76C3F5 101.2%);
    &:hover {
      background: linear-gradient(90deg, #7C82FD 0%, #8EC2F9 100%);
    }
    &.disabled {
      background: linear-gradient(107.5deg, rgba(85, 82, 253, 0.2) -3.19%, rgba(118, 195, 245, 0.2) 101.2%);
    }
  }
  position: relative;
  border-radius: 20px;
  height: 50px;
  width: 270px;
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
  &__img {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
  }
  &:not(.primary):hover {
    & .button-gradient__inner {
      background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), rgba(255, 255, 255, 0.1);
    }
  }
  &.disabled {
    & .button-gradient__inner {
      background: rgba(255, 255, 255, 0.04);
      color: rgba(255, 255, 255, 0.6);
    }
  }
  &__inner {
    position: absolute;
    top:0;
    left:0;
    bottom: 0;
    right: 0;
    z-index: 1;
    line-height: 50px;
    text-align: center;
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>

