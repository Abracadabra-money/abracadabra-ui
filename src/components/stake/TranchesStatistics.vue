<template>
  <div class="info-block wrap">
    <div>
      <h5 class="info-title">Tranches Statistics</h5>
      <div class="tranches-boxes">
        <div class="tranche-box">
          <div class="tranche-header">
            <div class="tranche-logo">
              <img
                src="@/assets/images/stake/senior-icon.svg"
                class="tranche-icon"
              />
              <h6 class="logo-title">
                Senior <br />
                Tranches
              </h6>
            </div>
            <span class="risk-marker">LOW RISK</span>
          </div>
          <ul class="tranche-box-info">
            <li class="info-field">
              <span class="field-title">APR</span>
              <span class="field-value">90.59%</span>
            </li>
            <li class="info-field">
              <span class="field-title">Total Rewards</span>
              <span class="field-value">$304,210.19</span>
            </li>
            <li class="info-field">
              <span class="field-title">Total supply</span>
              <span class="field-value">$5,304,313.99</span>
            </li>
          </ul>
        </div>
        <div class="tranche-box">
          <div class="tranche-header">
            <div class="tranche-logo">
              <img
                src="@/assets/images/stake/mezzanine-icon.svg"
                class="tranche-icon"
              />
              <h6 class="logo-title">
                Mezzanine <br />
                Tranches
              </h6>
            </div>
            <span class="risk-marker" style="color: #9f71ff">MEDIUM RISK</span>
          </div>
          <ul class="tranche-box-info">
            <li class="info-field">
              <span class="field-title">APR</span>
              <span class="field-value">90.59%</span>
            </li>
            <li class="info-field">
              <span class="field-title">Total Rewards</span>
              <span class="field-value">$304,210.19</span>
            </li>
            <li class="info-field">
              <span class="field-title">Total supply</span>
              <span class="field-value">$5,304,313.99</span>
            </li>
          </ul>
        </div>
        <div class="tranche-box">
          <div class="tranche-header">
            <div class="tranche-logo">
              <img
                src="@/assets/images/stake/junior-icon.svg"
                class="tranche-icon"
              />
              <h6 class="logo-title">
                Junior <br />
                Tranches
              </h6>
            </div>
            <span class="risk-marker" style="color: #ffb274">HIGH RISK</span>
          </div>
          <ul class="tranche-box-info">
            <li class="info-field">
              <span class="field-title">APR</span>
              <span class="field-value">90.59%</span>
            </li>
            <li class="info-field">
              <span class="field-title">Total Rewards</span>
              <span class="field-value">$304,210.19</span>
            </li>
            <li class="info-field">
              <span class="field-title">Total supply</span>
              <span class="field-value">$5,304,313.99</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="supply-rewards">
      <div class="supply-rewards-block">
        <h5 class="info-title">Total Supply</h5>
        <div class="info-item">
          <div class="info-icon">
            <BaseTokenIcon
              :icon="require('@/assets/images/tokens/LVL.png')"
              size="40px"
            />
            <span>LVL</span>
          </div>
          <div class="info-balance">
            <span class="info-value">$5,304,313.99</span>
          </div>
        </div>
      </div>
      <div class="info-line"></div>
      <div class="supply-rewards-block">
        <h5 class="info-title">Total Rewards Earned</h5>
        <div class="info-item">
          <div class="info-icon">
            <BaseTokenIcon
              :icon="require('@/assets/images/tokens/ETH2.png')"
              size="40px"
            />
            <span>ETH</span>
          </div>
          <div class="info-balance">
            <span class="info-value">$5,304,313.99</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
export default {
  name: "TranchesStatistics",
  components: {
    BaseTokenIcon,
  },
};
</script>
<style lang="scss" scoped>
.info-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.info-title {
  text-align: left;
}
.tranches-boxes {
  display: flex;
  justify-content: space-between;
  gap: 9px;
  margin: 10px auto 16px auto;
}
.tranche-box {
  width: 100%;
  height: 114px;
  padding: 8px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
}
.tranche-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}
.tranche-logo {
  display: flex;
  align-items: center;
  gap: 9px;
}
.logo-title {
  text-align: left;
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 0.025em;
}
.risk-marker {
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
  text-align: right;
  text-transform: uppercase;
  color: #92e2ff;
}
.tranche-box-info {
  width: 100%;
  list-style: none;
}
.info-field {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.field-title {
  text-align: left;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: rgba(255, 255, 255, 0.8);
}
.field-value {
  text-align: right;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  color: #ffffff;
}
.supply-rewards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.supply-rewards-block {
  width: 100%;
  text-align: left;
}
.balance-token {
  display: flex;
  font-weight: 400;
  line-height: 22px;
  font-size: 18px;
}

.token-icon {
  display: flex;
  align-items: center;
}

.token-icon-name {
  display: none;
}

.token-balance {
  font-weight: 700;
  font-size: 24px;
  line-height: 30px;
}

.token-price {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
}

.info-block {
  margin-bottom: 24px;
}

.info-title {
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  margin-bottom: 14px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-icon {
  display: flex;
  align-items: center;
}

.info-balance {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.info-line {
  position: relative;
}

.info-line::after {
  content: "";
  position: absolute;
  bottom: -30px;
  left: 0;
  right: 0;
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.1);
}

.info-value {
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.4px;
}

.info-usd {
  font-size: 14px;
  line-height: 21px;
  display: flex;
  color: rgba(255, 255, 255, 0.6);
}

@media screen and (max-width: 1340px) {
  .tranches-boxes {
    flex-direction: column;
  }
}

@media (max-width: 770px) {
  .tranches-boxes {
    flex-direction: column;
  }
  .supply-rewards {
    flex-direction: column;
  }
  .info-line::after {
    display: none;
  }
}
</style>
