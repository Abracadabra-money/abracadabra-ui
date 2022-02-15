<template>
  <div class="choose">
    <h4>Choose Chain</h4>
    <div class="underline">
      <NetworksList />
    </div>

    <div class="first-input underline">
      <div class="header-balance">
        <h4>Collateral assets</h4>
        <p v-if="false">Balance: 2000.00</p>
      </div>

      <ValueInput
        :icon="null"
        :name="null"
        v-model="firstTokenValue"
        :max="5"
        error="Some Error Text"
        isChooseToken
      />
    </div>
    <div class="second-input underline">
      <div class="header-balance">
        <h4>Collateral assets</h4>
        <p>Balance: 2000.00</p>
      </div>
      <ValueInput :icon="null" :name="null" />
    </div>

    <div class="ltv underline">
      <span>LTV</span>
      <span>45 %</span>
    </div>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UIComponents/ValueInput");
const NetworksList = () => import("@/components/ui/NetworksList");

export default {
  name: "ChooseChain",
  components: { ValueInput, NetworksList },
  data: () => ({
    firstTokenIndex: 0,
    firstTokenValue: null,
  }),
};
</script>

<style lang="scss" scoped>
.choose {
  padding: 20px 16px;
  border-radius: 30px;
  background-color: $clrBg2;
  max-width: 100%;
  overflow: hidden;
}

.first-input {
  padding-top: 27px;
  padding-bottom: 24px;
}

.second-input {
  padding-top: 27px;
  padding-bottom: 14px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ltv {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding-bottom: 12px;
}

@media (min-width: 1024px) {
  .choose {
    padding: 30px;
  }
}
</style>
