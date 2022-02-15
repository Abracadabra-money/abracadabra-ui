<template>
  <div class="collateral">
    <div class="input-wrap">
      <div class="input-desc">
        <p class="title">Collateral assets</p>
        <p class="balance">Balance: 2000.00</p>
      </div>
      <ValueInput />
    </div>

    <DefaultButton>Remove</DefaultButton>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UIComponents/ValueInput");
const DefaultButton = () => import("@/components/main/DefaultButton");
export default {
  components: {
    ValueInput,
    DefaultButton,
  },
};
</script>

<style lang="scss" scoped>
.collateral {
  max-width: 550px;
  width: 100%;
  margin: 0 auto;
  padding-top: 30px;
}

.input-wrap {
  margin-bottom: 90px;
}

.input-desc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.title {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
}

.balance {
  font-size: 14px;
  line-height: 21px;
}
</style>
