<template>
  <div class="steps-wrap">
    <div class="steps">
      <div :class="['step-item', { 'step-active': stepOne }]">1</div>
      <div :class="['dotted-line', { 'dotted-line-active': stepTwo }]"></div>
      <div :class="['step-item', { 'step-active': stepTwo }]">2</div>
      <div :class="['dotted-line', { 'dotted-line-active': stepThree }]"></div>
      <div :class="['step-item', { 'step-active': stepThree }]">3</div>
    </div>
    <div class="steps-name">
      <div :class="['step-name', { 'step-active': stepOne }]">Balances</div>
      <div :class="['step-name', 'center', { 'step-active': stepTwo }]">
        Unstake
      </div>
      <div :class="['step-name', { 'step-active': stepThree }]">Migrate</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    stepOne() {
      return this.step === 1 || this.step === 2 || this.step === 3;
    },

    stepTwo() {
      return this.step === 2 || this.step === 3;
    },

    stepThree() {
      return this.step === 3;
    },
  },
};
</script>

<style lang="scss" scoped>
.steps-wrap {
  gap: 6px;
  display: flex;
  flex-direction: column;
}

.steps {
  gap: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.step-item {
  min-width: 40px;
  height: 40px;
  border: 1px solid #878b93;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #878b93;
  font-weight: 600;
  line-height: normal;
}

.dotted-line {
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    90deg,
    #878b93,
    #878b93 75%,
    transparent 75%,
    transparent 100%
  );
  background-size: 10px 5px;
  border: none;
}

.dotted-line-active {
  background-image: linear-gradient(
    90deg,
    #7088cc,
    #7088cc 75%,
    transparent 75%,
    transparent 100%
  );
}

.steps-name {
  gap: 4px;
  display: flex;
  justify-content: space-between;
}

.step-name {
  color: #878b93;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

.center {
  width: 80px;
}

.step-active {
  color: #7088cc;
  border-color: #7088cc;
}
</style>
