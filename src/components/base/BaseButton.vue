<template>
  <a
    class="default-button"
    :style="{ 'max-width': setWidth() }"
    :class="{ primary: primary, disabled: disabled || loading, borderless }"
  >
    <div><slot></slot></div>
    <span v-if="loading" class="loader"></span>
  </a>
</template>

<script lang="ts">
export default {
  name: "BaseButton",
  props: {
    primary: {
      type: Boolean,
    },
    borderless: {
      type: Boolean,
    },
    loading: {
      type: Boolean,
    },
    width: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
  },
  methods: {
    setWidth() {
      return this.width ? this.width : "100%";
    },
  },
};
</script>

<style lang="scss" scoped>
.default-button {
  cursor: pointer;
  position: relative;
  border-radius: 20px;
  // background: #403e4a;
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
  border: 2px solid #7088CC;
  width: 100%;
  height: 48px;
  color: #7088CC;
  transition: all .3s ease;

  &.disabled {
    pointer-events: none;
    cursor: not-allowed;
  }

  &.borderless {
    border: none;

    &:hover {
      background: #616068;
    }
  }

  &.primary {
    color: #fff;
    line-height: 50px;
    background: linear-gradient(107.5deg, #5552fd -3.19%, #76c3f5 101.2%);
    border: none;
    &:hover {
      background: linear-gradient(90deg, #7c82fd 0%, #8ec2f9 100%);
    }
    &.disabled {
      background: #40557e;
      background: linear-gradient(107.5deg, #393b80 -3.19%, #435e7e 101.2%);
    }
  }
  &:not(.primary, .borderless) {
    &:hover:not(.disabled) {
      border: 2px solid #86A2F1;
      color: #86A2F1;
      background: rgba(255, 255, 255, 0.05);
    }
    &.disabled {
      border: 2px solid #575C62;
      color: #575C62;
    }
  }
}
.loader {
  margin-left: 19px;
  position: relative;
  top: 2px;
  display: block;
  width: 10px;
  height: 30px;
  animation: rectangle infinite 1s ease-in-out -0.2s;

  background-color: #fff;
}
.loader:before,
.loader:after {
  position: absolute;

  width: 8px;
  height: 8px;

  content: "";

  background-color: #fff;
}
.loader:before {
  left: -10px;
  animation: rectangle infinite 1s ease-in-out -0.4s;
}
.loader:after {
  right: -10px;
  animation: rectangle infinite 1s ease-in-out;
}

@keyframes rectangle {
  0%,
  80%,
  100% {
    height: 6px;
  }
  40% {
    height: 8px;
  }
}
</style>
