<template>
  <div
    :class="['timer', { small }, { airdrop }, { dark }]"
    :style="{ gap: gap }"
  >
    <div
      class="time-block"
      :style="{
        padding: padding,
        'min-width': width,
        height: height,
        background: background,
      }"
      v-for="(value, index) in timerValues"
      :key="index"
    >
      {{ value }}
    </div>
  </div>
</template>

<script>
import moment from "moment";

const measureUnits = { 0: "d", 1: "h", 2: "m", 3: "s" };

export default {
  props: {
    startDateTimestamp: {
      type: Number,
      default: 1709244000,
    },
    endDateTimestamp: {
      type: Number,
      default: 1711663200,
    },
    small: {
      type: Boolean,
      default: false,
    },
    airdrop: {
      type: Boolean,
      default: false,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    gap: {
      type: String,
    },
    padding: {
      type: String,
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    isLock: {
      type: Boolean,
      default: false,
    },
    background: {
      type: String,
      default: "rgba(0, 10, 35, 0.3)",
    },
  },

  data() {
    return {
      intervalId: null,
      timerValues: ["0d", "00h", "00m", "00s"],
    };
  },

  computed: {
    startDate() {
      return moment.utc(this.startDateTimestamp * 1000);
    },

    endDate() {
      return moment.utc(this.endDateTimestamp * 1000);
    },
  },

  methods: {
    updateTimer() {
      const now = moment().utc();

      let duration;

      if (this.isLock) return this.updateLockTimer();

      if (this.airdrop) {
        const nextHour = moment.utc().startOf("hour").add(1, "hours"); // next hour
        duration = moment.duration(nextHour.diff(now));

        if (duration.asSeconds() <= 0) {
          clearInterval(this.intervalId);
          this.timerValues = ["00m", "00s"];
          return;
        }
      } else {
        duration = moment.duration(this.endDate.diff(now));
        // const duration = moment.duration(this.endDate.diff(now));
        if (duration.asSeconds() <= 0) {
          clearInterval(this.intervalId);
          this.timerValues = ["0d", "00h", "00m", "00s"];
          return;
        }
      }

      const days = Math.max(Math.floor(duration.asDays()), 0);
      const hours = Math.max(duration.hours(), 0);
      const minutes = Math.max(duration.minutes(), 0);
      const seconds = Math.max(duration.seconds(), 0);

      if (this.airdrop) {
        this.timerValues = [
          `${minutes.toString().padStart(2, "0")}m`,
          `${seconds.toString().padStart(2, "0")}s`,
        ];
      } else {
        this.timerValues = this.createTimerValues([
          days,
          hours,
          minutes,
          seconds,
        ]);
      }
    },

    updateLockTimer() {
      const now = moment().utc();
      const duration = moment.duration(this.endDate.diff(now));

      const days = Math.max(Math.floor(duration.asDays()), 0);
      const hours = Math.max(duration.hours(), 0);
      const minutes = Math.max(duration.minutes(), 0);
      const seconds = Math.max(duration.seconds(), 0);

      if (duration.asHours() <= 24) {
        this.timerValues = [
          `${hours.toString().padStart(2, "0")}h`,
          `${minutes.toString().padStart(2, "0")}m`,
          `${seconds.toString().padStart(2, "0")}s`,
        ];
      } else {
        this.timerValues = this.createTimerValues([days, hours, minutes]);
      }
    },

    createTimerValues(unparsedValues) {
      const timerValues = [];

      unparsedValues.forEach((value, index) => {
        timerValues.push(
          `${value.toString().padStart(2, "0")}${measureUnits[index]}`
        );
      });

      if (timerValues.length > 3) return timerValues.slice(0, -1);
      return timerValues;
    },
  },

  mounted() {
    this.updateTimer();
    this.intervalId = setInterval(this.updateTimer, 1000);
  },

  beforeUnmount() {
    clearInterval(this.intervalId);
  },
};
</script>

<style scoped>
.timer {
  display: flex;
  gap: 12px;
}

.time-block {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  min-width: 90px;
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: rgba(0, 10, 35, 0.3);
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  font-size: 29px;
  font-weight: 500;
}

.small .time-block {
  color: #fff;
  font-size: 12px;
  background: transparent;
  min-width: 48px;
  height: auto;
}

.airdrop .time-block {
  color: #fff;
  font-size: 12px;
  background: transparent;
  min-width: 48px;
  height: 30px;
  padding: 6px;
  min-width: 44px;
}

.dark .time-block {
  background: #171717;
}

@media (max-width: 700px) {
  .time-block {
    font-size: 24px;
    height: 48px;
    min-width: 66px;
  }
}

@media (max-width: 600px) {
  .timer {
    width: 100%;
    justify-content: center;
  }

  .small {
    gap: 2px;
  }

  .small .time-block {
    padding: 4px 6px;
    height: auto;
    min-width: 40px;
  }
}
</style>
