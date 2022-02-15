<template>
  <div class="repay">
    <div class="input-wrap">
      <div class="input-desc">
        <p class="title">Collateral assets</p>
        <p class="balance">Balance: 2000.00</p>
      </div>
      <ValueInput />
    </div>

    <div class="btns-wrap">
      <DefaultButton primary>Approve</DefaultButton>
      <DefaultButton>Repay</DefaultButton>
    </div>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UIComponents/ValueInput");
import DefaultButton from "@/components/main/DefaultButton.vue";
export default {
  components: {
    ValueInput,
    DefaultButton,
  },
};
</script>

<style lang="scss" scoped>
.repay {
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

.btns-wrap {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
}
</style>
