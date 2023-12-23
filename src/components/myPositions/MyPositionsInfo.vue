<template>
  <div class="myPositions-info">
    <div class="title-desc">
      <h2 class="title">Magic Positions</h2>
      <p class="description">
        <span class="desc-line">
          Use your favourite assets as collateral to borrow
        </span>
        <span class="desc-line">
          <img
            src="@/assets/images/myPositions/symbol-MIM.png"
            class="mim-symbol"
          />
          Magic Internet Money, a leading decentralised and collateral-backed
          stablecoin.
        </span>
      </p>
    </div>

    <div class="reward-cards">
      <div class="reward-card">
        <h4 class="reward-title">Total Collateral Deposit</h4>
        <div class="reward-values">
          <div class="token-amount">$10332.03</div>
        </div>
      </div>

      <div class="reward-card mim">
        <h4 class="reward-title">Total MIM Borrowed</h4>
        <div class="reward-values">
          <div class="token-amount">
            <img
              class="token-icon"
              src="@/assets/images/tokens/MIM.png"
              alt="SPELL"
            />10332.03
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script></script>

<style lang="scss" scoped>
.myPositions-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
}

.title {
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 10px;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
}

.desc-line {
  display: flex;
  align-items: center;
}

.mim-symbol {
  margin-right: 4px;
}

.reward-cards {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.reward-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 24px;
  width: 262px;
  height: 102px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: url("../../assets/images/myPositions/reward-card-background.png");
  background-repeat: no-repeat;
  background-position: 0 20px;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.reward-title {
  color: #99a0b2;
  font-size: 16px;
  font-weight: 500;
}

.reward-values {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.token-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  color: #fff;
  font-size: 28px;
  font-weight: 500;
}

.token-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
}

.token-usd-equivalent {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

.reward-card.mim {
  border: 1px solid #25467c;
  background: linear-gradient(
      90deg,
      rgba(45, 74, 150, 0.32) 0%,
      rgba(116, 92, 210, 0.32) 100%
    ),
    url("../../assets/images/myPositions/reward-mim-background.png");
}
</style>
