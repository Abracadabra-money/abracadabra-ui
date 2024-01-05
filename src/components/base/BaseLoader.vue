<template>
  <div class="loader-wrap-mini" v-if="type === 'loader'">
    <p class="loader" ref="loader"></p>
  </div>

  <div :style="`height: ${height};`" class="spinner" v-else>
    <img
      :style="`width: ${width};`"
      src="@/assets/images/cauldrons/loader.gif"
      alt="Loader icon"
    />
  </div>
</template>

<script lang="ts">
export default {
  props: {
    type: {
      default: "spinner",
    },
    color: {
      default: "linear-gradient(107.5deg, #5282fd -3.19%, #76c3f5 101.2%)",
    },
    width: {
      type: String,
      default: "20%",
    },
    height: {
      type: String,
      default: "100vh",
    },
  },

  created() {
    document.body.style.setProperty("--loader-color", this.color);
  },
};
</script>

<style lang="scss" scoped>
.loader-wrap-mini {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35%;
}

.loader {
  position: relative;
  display: block;
  width: 8px;
  animation: rectangle infinite 1s ease-in-out -0.2s;
  border-radius: 4px;
  background: var(--loader-color);
}
.loader:before,
.loader:after {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  content: "";
  background: var(--loader-color);
}
.loader:before {
  left: -10px;
  animation: rectangle infinite 1s ease-in-out -0.4s;
}
.loader:after {
  right: -10px;
  animation: rectangle infinite 1s ease-in-out;
}

.spinner {
  display: flex;
  align-items: center;
  justify-content: center;
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
