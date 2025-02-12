<template>
  <a
    class="default-button"
    :style="{ 'max-width': setWidth() }"
    :class="{
      warning: warning,
      primary: primary,
      disabled: disabled || loading || (!isUnLockAmount && endDateTimestamp),
      borderless,
    }"
  >
    <span class="timer" v-if="!isUnLockAmount && endDateTimestamp">
      <span>{{ timerText }}</span>
      <span
        ><span
          class="timer-value"
          v-for="(value, index) in timerValues"
          :key="index"
        >
          {{ value }}</span
        ></span
      >
    </span>

    <template v-else>
      <div><slot></slot></div>
      <span v-if="loading" class="loader"></span>
    </template>
  </a>
</template>

<script lang="ts">
import moment from "moment";

export default {
  name: "BaseButton",
  props: {
    primary: {
      type: Boolean,
    },
    error: {
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
    warning: {
      type: Boolean,
    },
    endDateTimestamp: {
      type: Number,
      default: 0,
    },
    timerText: {
      type: String,
      default: "Unlocks in ",
    },
  },
  data() {
    return {
      intervalId: null as ReturnType<typeof setInterval> | null,
      timerValues: ["00:", "00:", "00"],
      isUnLockAmount: false,
    };
  },

  computed: {
    endDate() {
      return moment.utc(this.endDateTimestamp * 1000);
    },
  },

  watch: {
    endDateTimestamp() {
      this.updateTimer();
      this.intervalId = setInterval(this.updateTimer, 1000);
    },
  },

  methods: {
    setWidth() {
      return this.width ? this.width : "100%";
    },

    updateTimer() {
      const now = moment().utc();

      const duration = moment.duration(this.endDate.diff(now));
      this.isUnLockAmount = duration.asSeconds() <= 0;

      if (duration.asSeconds() <= 0) {
        clearInterval(Number(this.intervalId));
        this.timerValues = ["00:", "00:", "00"];
        return;
      }

      const days = Math.max(Math.floor(duration.asDays()), 0);
      const hours = Math.max(duration.hours(), 0) + days * 24;
      const minutes = Math.max(duration.minutes(), 0);
      const seconds = Math.max(duration.seconds(), 0);

      this.timerValues = [
        `${hours.toString().padStart(2, "0")}:`,
        `${minutes.toString().padStart(2, "0")}:`,
        `${seconds.toString().padStart(2, "0")}`,
      ];
    },
  },

  mounted() {
    if (this.endDateTimestamp) {
      this.updateTimer();
      this.intervalId = setInterval(this.updateTimer, 1000);
    }
  },

  beforeUnmount() {
    clearInterval(Number(this.intervalId));
  },
};
</script>

<style lang="scss" scoped>
.default-button {
  cursor: pointer;
  position: relative;
  border-radius: 16px;
  // background: #403e4a;
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
  border: 2px solid #7088cc;
  width: 100%;
  height: 48px;
  color: #7088cc;
  transition: all 0.3s ease;

  &.warning {
    color: #fff;
    background: #8c4040;
    border: none;
    &:hover {
      opacity: 0.8;
    }
  }

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

  &.error {
    color: white;
    background: #8c4040;
    border: none;
    transition: none;
    &:hover {
      background: #ab4a4a;
    }
    &.disabled {
      background: #642e2e;
    }
  }

  &.primary {
    color: #fff;
    line-height: 50px;
    background: linear-gradient(90deg, #2d4a96 0%, #745cd2 100%);
    border: none;
    &:hover {
      background: linear-gradient(90deg, #4566bb 0%, #806ec6 100%);
    }
    &.disabled {
      background: #40557e;
      background: linear-gradient(
        90deg,
        rgba(35, 65, 151, 0.4) 0.01%,
        rgba(87, 68, 143, 0.4) 100%
      );
    }
  }

  &.warning {
    border: none;
    color: #fff;
    background: rgba(140, 64, 64, 1);

    &.disabled {
      background: #40557e;
      background: linear-gradient(
        90deg,
        rgba(35, 65, 151, 0.4) 0.01%,
        rgba(87, 68, 143, 0.4) 100%
      );
    }
  }

  &:not(.primary, .borderless, .warning) {
    &:hover:not(.disabled) {
      border: 2px solid #86a2f1;
      color: #86a2f1;
      background: rgba(255, 255, 255, 0.05);
    }
    &.disabled {
      border: 2px solid #575c62;
      color: #575c62;
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

.timer {
  color: #878b93;
}

.timer-value {
  display: inline-block;
  min-width: 24px;
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

@media (max-width: 600px) {
  .default-button {
    height: 39px;
  }
}
</style>
