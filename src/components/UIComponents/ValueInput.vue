<template>
  <div class="wrapper">
    <div class="val-input">
      <button class="value-type value-btn">
        <img
          class="token-icon"
          src="@/assets/images/tokens-icon/Token_BNB.svg"
          alt="token"
        />
        <div class="token-name">yvWETH</div>
        <img class="token-arrow" src="@/assets/images/arrow.svg" alt="arrow" />
      </button>

      <input class="text-field" type="text" placeholder="0.0" />
      <div class="max-wrap">
        <button class="value-btn max-btn">max</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data: () => ({}),
  watch: {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.val-input {
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  padding: 0 10px;
}
.value-type {
  justify-content: space-between;
  flex: 1 1 148px;
}
.value-btn {
  display: flex;
  align-items: center;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.04);
  height: 60px;
  cursor: pointer;
  border: none;
  color: white;
}
.text-field {
  background: transparent;
  height: 70px;
  border: none;
  font-weight: 400;
  font-size: 20px;
  text-align: center;
  color: white;
  width: calc(100% - (148px + 80px));
  &:focus {
    outline: none;
  }
}

.max-wrap {
  flex: 0 0 80px;
}

.max-btn {
  width: 100%;
  justify-content: center;
}

.token-icon {
  height: 32px;
  min-width: 32px;
  margin-left: 10px;
}
.token-name {
  flex: 1 1 auto;
  text-align: left;
  margin-left: 10px;
}
.token-arrow {
  margin-right: 12px;
  width: 11px;
}
</style>
