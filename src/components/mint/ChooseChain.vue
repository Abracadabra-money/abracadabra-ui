<template>
  <div class="choose">
    <h2>Choose Chain</h2>
    <div class="networks underline">
      <NetworkChip
        v-for="i in 5"
        :key="i"
        :selected="i === selectedNetwork"
        @click="selectedNetwork = i"
      />
    </div>
    <div class="inputs underline">
      <div>
        <div class="header-balance">
          <h2>Collateral assets</h2>
          <div class="balance">
            <div v-if="false">Balance: 2000.00</div>
          </div>
        </div>

        <ValueInput />
      </div>
      <div>
        <div class="header-balance">
          <h2>Collateral assets</h2>
          <div class="balance">
            <div>Balance: 2000.00</div>
          </div>
        </div>

        <ValueInput />
      </div>
    </div>
    <div class="ltv underline">
      <span>LTV</span>
      <span>45 %</span>
    </div>
  </div>
</template>

<script>
const NetworkChip = () => import("@/components/mint/NetworkChip");
const ValueInput = () => import("@/components/UIComponents/ValueInput");

export default {
  name: "ChooseChain",
  components: { NetworkChip, ValueInput },
  data: () => ({
    selectedNetwork: null,
  }),
};
</script>

<style lang="scss" scoped>
.choose {
  padding: 30px 30px 300px 30px;
  border-radius: 30px;
  background-color: $clrBg2;
}

.networks {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 16px;
  margin-top: 10px;
  padding-bottom: 30px;
}

.inputs {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 67px;
  padding-top: 27px;
  padding-bottom: 30px;
}

h2 {
  font-weight: 600;
  font-size: 18px;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-balance {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;

  .balance {
    font-size: 14px;
  }
}
.ltv {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
}
</style>
