<template>
  <div>Unlock in {{ timerCount }}</div>
</template>

<script lang="ts">
import moment from "moment";

export default {
  props: {
    finalTime: {
      type: [String, Boolean] as any,
      required: true,
    },
  },

  data() {
    return {
      timeInterval: null as any,
      timerCount: "" as any,
      acceptByTime: null as any,
    };
  },

  methods: {
    checkDuration() {
      if (!this.finalTime) return (this.timerCount = 0);

      const start = moment(new Date());
      const end = moment.unix(this.finalTime);
      const duration = end.diff(start);
      this.timerCount = moment.utc(duration).format("HH:mm:ss");
    },
  },

  mounted() {
    this.acceptByTime = moment(this.finalTime).isBefore(new Date());

    if (!this.acceptByTime) {
      this.checkDuration();

      this.timeInterval = setInterval(() => {
        this.checkDuration();
      }, 1000);
    }
  },

  beforeUnmount() {
    clearInterval(this.timeInterval);
  },
};
</script>
