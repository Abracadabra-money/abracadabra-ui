<template>
  <div class="leverage">
    <div class="choose">
      <h4>Choose Chain</h4>
      <div class="underline">
        <NetworksList />
      </div>

      <div class="first-input underline">
        <div class="header-balance">
          <h4>Collateral assets</h4>
          <p>Balance: 30.00</p>
        </div>

        <ValueInput
          :icon="null"
          :name="null"
          v-model="firstTokenValue"
          :max="5"
          isChooseToken
        />
      </div>

      <div class="leverage-range">
        <div class="settings-wrap">
          <button @click="isSettingsOpened = true" class="settings-btn">
            <img src="@/assets/images/settings.png" alt="settings" />
          </button>
        </div>
        <div class="leverage-actions">
          <button class="info-btn">
            <img class="info-icon" src="@/assets/images/info.svg" alt="info" />
          </button>
          <h4>Leverage up</h4>
        </div>
        <Range v-model="range" />
      </div>

      <div class="ltv underline">
        <span>LTV</span>
        <span>0 %</span>
      </div>
    </div>
    <StableCoins />
    <SettingsPopup
      :isOpen="isSettingsOpened"
      @closePopup="isSettingsOpened = false"
    />
  </div>
</template>

<script>
const Range = () => import("@/components/UIComponents/Range");
const StableCoins = () => import("@/components/borrow/StableCoins");
const ValueInput = () => import("@/components/UIComponents/ValueInput");
const NetworksList = () => import("@/components/ui/NetworksList");
const SettingsPopup = () => import("@/components/leverage/SettingsPopup");

export default {
  components: { SettingsPopup, Range, ValueInput, NetworksList, StableCoins },
  data: () => ({
    firstTokenIndex: 0,
    firstTokenValue: null,
    range: 20,
    isSettingsOpened: false,
  }),
};
</script>

<style lang="scss" scoped>
.leverage {
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  width: 100%;
  padding-top: 160px;
  padding-bottom: 160px;
}

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

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ltv {
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.6);
  line-height: 25px;
  padding-bottom: 12px;
}

.leverage-range {
  margin: 33px 0 87px 0;
}

.settings-wrap {
  text-align: right;
  .settings-btn {
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
}

.leverage-actions {
  display: flex;
  align-items: center;
  margin: 20px 0;
  .info-btn {
    background-color: transparent;
    cursor: pointer;
    border: none;
    margin-right: 10px;
    width: 24px;
    height: 24px;

    .info-icon {
      width: 24px;
      height: 24px;
    }
  }
}

@media (min-width: 1024px) {
  .choose {
    padding: 30px;
  }
}

@media (min-width: 1024px) {
  .leverage {
    grid-template-columns: 550px 1fr;
    width: 1320px;
    max-width: 100%;
  }
}
</style>
