<template>
  <div class="time-frame-wrap" @click="changeTimeFrame">
    <button class="frame-btn">
      Time frame: <span class="value">{{ activeFrame }}</span>
    </button>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    timesFrame: {
      type: Object as any,
    },
  },

  data() {
    return {
      frameIndex: 0,
    };
  },

  computed: {
    activeFrame() {
      return this.timesFrame[this.frameIndex as keyof typeof this.timesFrame]
        .label;
    },
  },

  methods: {
    changeTimeFrame() {
      if (this.frameIndex + 1 > this.timesFrame.length - 1) this.frameIndex = 0;
      else this.frameIndex++;

      this.$emit("updateTimeFrame", this.timesFrame[this.frameIndex].time);
    },
  },
};
</script>

<style lang="scss" scoped>
.time-frame-wrap {
  height: 36px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  padding: 6px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.frame-btn {
  width: 130px;
  transition: all 0.2s ease-in;
  color: #878b93;
  font-size: 14px;
  line-height: 150%;
  cursor: pointer;
  background: transparent;
  outline: transparent;
  border: none;

  &:hover {
    .value {
      color: rgba(254, 216, 79, 0.6);
    }
  }
}

.value {
  width: 40px;
  color: #fed84f;
  display: inline-block;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}
</style>
