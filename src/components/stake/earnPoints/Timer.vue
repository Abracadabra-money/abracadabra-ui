<template>
  <div class="timer">
    <div class="time-block" v-for="(value, index) in timerValues" :key="index">
      {{ value }}
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      startDate: moment("2024-03-01 00:00:00"),
      endDate: moment("2024-03-15 00:00:00"),
      intervalId: null,
      timerValues: ["0d", "00h", "00m", "00s"],
    };
  },

  methods: {
    updateTimer() {
      if (this.startDate.isBefore(moment())) this.startDate = moment();
      const duration = moment.duration(this.endDate.diff(this.startDate));
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      if (duration.asSeconds() <= 0) {
        clearInterval(this.intervalId);
        this.timerValues = ["0d", "00h", "00m", "00s"];
        return;
      }

      this.timerValues = [
        `${days}d`,
        `${hours.toString().padStart(2, "0")}h`,
        `${minutes.toString().padStart(2, "0")}m`,
        `${seconds.toString().padStart(2, "0")}s`,
      ];
    },
  },

  mounted() {
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
  width: 80px;
  height: 56px;
  padding: 6px 11px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: rgba(0, 10, 35, 0.3);
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  font-size: 29px;
  font-weight: 500;
}
</style>
