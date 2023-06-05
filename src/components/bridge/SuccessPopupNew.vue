<template>
  <div class="wrap">
    <div class="title-container">
      <h1 class="popup-title">Success (headline)</h1>
    </div>
    <div class="popup-content">
      <img src="@/assets/images/bridge/Check-line.png" class="check-line" />
      <div class="blocks">
        <div class="block-container">
          <h2 class="block-title">Send From</h2>
          <div class="block-content-box">
            <div class="upper">
              <span class="logo-address">
                <div class="token-info">
                  <div class="token-logo">
                    <img
                      src="@/assets/images/tokens/ETH.png"
                      class="token-icon"
                    />
                    <span class="token-symbol">eth</span>
                  </div>
                </div>
                <h3 class="address">0x23...2ee</h3>
              </span>
              <span class="link-block">
                <a href="" class="link-text">Etherscan</a>
                <img
                  src="@/assets/images/bridge/arrow-link.png"
                  class="arrow-link"
                />
              </span>
            </div>
            <div class="lower">
              <ul class="transaction-info">
                <li>
                  <span class="tag">Amount</span>
                  <span class="value">
                    <span class="eth">1 ETH</span>
                    <span class="fiat">$2000.00</span>
                  </span>
                </li>
                <li>
                  <span class="tag">Fee</span>
                  <span class="value">
                    <span class="eth">0.0 ETH</span>
                    <span class="fiat">$0.00</span>
                  </span>
                </li>
                <li>
                  <span class="tag">Convert to gas token</span>
                  <span class="value">
                    <span class="eth">0.0 ETH</span>
                    <span>
                      <img
                        src="@/assets/images/arrow_right.svg"
                        class="convert-arrow"
                      />
                    </span>
                    <span class="fiat">0.000345</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="block-container">
          <h2 class="block-title">Send To</h2>
          <div class="block-content-box">
            <div class="upper">
              <span class="logo-address">
                <div class="token-info">
                  <div class="token-logo">
                    <img
                      src="@/assets/images/tokens/AVAX.png"
                      class="token-icon"
                    />
                    <span class="token-symbol">avax</span>
                  </div>
                </div>
                <h3 class="address">0x23...2ee</h3>
              </span>
              <span class="link-block">
                <a href="" class="link-text">snowtrace.io</a>
                <img
                  src="@/assets/images/bridge/arrow-link.png"
                  class="arrow-link"
                />
              </span>
            </div>
            <div class="lower">
              <ul class="transaction-info">
                <li>
                  <span class="tag">You will receive</span>
                  <span class="value">
                    <span class="eth">1 ETH</span>
                    <span class="fiat">$2000.00</span>
                  </span>
                </li>
                <li>
                  <span class="tag"></span>
                  <span class="value">
                    <span class="eth">0.0 ETH</span>
                    <span class="fiat">$0.00</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="block-container">
          <h2 class="block-title">Transaction processing/complete</h2>
          <div class="block-content-box">
            <div class="upper">
              <p>
                Transaction is processing. You may see it in the LayerZero
                explorer
              </p>
            </div>
            <div class="lower">
              <span class="link-block">
                <a href="" class="link-text">LayerZwero</a>
                <img
                  src="@/assets/images/bridge/arrow-link.png"
                  class="arrow-link"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
      default: null,
    },
  },
};
</script>
<style>
.wrap {
  margin: auto;
  margin-bottom: 20px;
  width: 440px;
  padding: 8px 20px 20px 20px;
  font-family: "Prompt";
  font-style: normal;
}

.title-container {
  padding-bottom: 19px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.popup-title {
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 0.025em;
  color: #ffffff;
}
.close-button {
  width: 14px;
  height: 14px;
}
.popup-content {
  display: flex;
}
.check-line {
  width: 20px;
  height: 400px;
  margin-top: 20px;
  margin-right: 22px;
}
.block-container {
  margin-top: 16px;
}
.block-title {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.025em;
  color: #ffffff;
}
.block-content-box {
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
}
.upper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 10px;
  margin-bottom: 11px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.logo-address {
  display: flex;
  gap: 10px;
}
.token-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.token-icon {
  width: 32px;
  height: 32px;

  border-radius: 20px;
}
.token-symbol {
  font-weight: 400;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}
.address {
  margin-top: 6px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0.025em;
}
.link-block {
  display: flex;
  align-items: center;
  gap: 12.5px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #5282fd;
}
.link-text {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;

  background: linear-gradient(107.5deg, #5282fd -3.19%, #76c3f5 101.2%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.arrow-link {
  width: 16px;
  height: 16px;
}
.lower li {
  display: flex;
  justify-content: space-between;
  align-items: center;

  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0.025em;
}
.value {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
}
.value span {
  margin-left: 8px;
}

.upper p {
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
}

@media (max-width: 400px) {
  .check-line {
    display: none;
  }
  .upper {
    flex-direction: column;
  }
}
</style>
