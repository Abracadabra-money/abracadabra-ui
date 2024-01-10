<template>
  <div class="loader-wrap-mini" v-if="type === 'loader'">
    <p class="loader" ref="loader"></p>
  </div>

  <div :class="['spinner', { small }, { medium }, { large }]" v-else>
    <img src="@/assets/images/cauldrons/loader.gif" alt="Loader icon" />
    <span class="spinner-text" v-if="text"> {{ text }}</span>
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
    text: {
      type: String,
    },
    small: {
      type: Boolean,
      default: false,
    },
    medium: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
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
  padding: 100px;
  gap: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.medium {
  img {
    width: 120px;
    height: 120px;
  }
}

.large {
  img {
    width: 220px;
    height: 220px;
  }
}

.spinner-text {
  color: #fff;
  font-weight: 600;
  line-height: 150%;
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
