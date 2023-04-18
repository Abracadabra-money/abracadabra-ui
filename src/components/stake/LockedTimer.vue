<template>
  <div class="locked-timer">Unlock in {{ timerCount }}</div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    finalTime: {
      type: [String, Boolean],
      required: true,
    },
  },
  data() {
    return {
      timeInterval: null,
      timerCount: "",
    };
  },
  methods: {
    buyTimer() {
      return setInterval(() => {
        this.checkDuration();
      }, 1000);
    },
    checkDuration() {
      let end = moment.unix(this.finalTime);
      if (!this.finalTime) {
        this.timerCount = 0;
        return;
      }
      let start = moment(new Date());

      let duration = end.diff(start);

      let formatDurr = moment.utc(duration).format("HH:mm:ss");
      this.timerCount = formatDurr;
    },
  },
  mounted() {
    this.acceptByTime = moment(this.finalTime).isBefore(new Date());
    if (!this.acceptByTime) {
      this.checkDuration();
      this.timeInterval = this.buyTimer();
    }
  },
  beforeUnmount() {
    clearInterval(this.timeInterval);
  },
};
</script>
