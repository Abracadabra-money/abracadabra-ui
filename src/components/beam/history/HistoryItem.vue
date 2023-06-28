<template>
  <li class="history-item">
    <TransactionStatus />

    <div class="transaction-main">
      <div class="transaction-chains">
        <TransactionChain destination="from" :chain="chainsConfig.from" />
        <TransactionChain destination="to" :chain="chainsConfig.to" />
      </div>

      <ul class="transaction-info">
        <li class="info-item">
          <span class="item-title">MIM transferred:</span>
          <span class="item-value">1,000.09211 MIM</span>
        </li>

        <li class="info-item">
          <span class="item-title">Convert to gas token:</span>
          <span class="item-value">
            0.0 Avax
            <img src="/src/assets/images/arrow_right.svg" />
            <span class="converted-value"> 0,000345</span>
          </span>
        </li>

        <li class="info-item">
          <span class="item-title">Gas cost:</span>
          <span class="item-value">0.0</span>
        </li>

        <li class="info-item">
          <span class="item-title">Beaming Fee:</span>
          <span class="item-value">
            0.0 ETH
            <span class="converted-value"> $0.00</span>
          </span>
        </li>
      </ul>
    </div>
  </li>
</template>

<script>
import TransactionStatus from "@/components/beam/history/TransactionStatus.vue";
import TransactionChain from "@/components/beam/history/TransactionChain.vue";

import { useImage } from "@/helpers/useImage";
export default {
  computed: {
    chainsConfig() {
      return {
        from: {
          icon: useImage("assets/images/networks/ETH.svg"),
          name: "Ethereum",
          address: "0x2345g245g45f242g113ggh5ht134f134f2ee",
        },
        to: {
          icon: useImage("assets/images/networks/avalanche.svg"),
          name: "Avalanche",
          address: "0x2345g245g45f242g113ggh5ht134f134f2ee",
        },
      };
    },
  },

  components: {
    TransactionStatus,
    TransactionChain,
  },
};
</script>

<style lang="scss" scoped>
.history-item {
  margin: 10px 0 0 0;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.transaction-main {
  padding: 10px 20px 8px 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.transaction-chains {
  display: flex;
  align-items: center;
  gap: 144px;
  margin: 0 0 11px 0;
}

.transaction-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  list-style: none;
  padding: 10px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-title,
.item-value {
  font-size: 12px;
  letter-spacing: 0.3px;
}
.converted-value {
  color: rgba(255, 255, 255, 0.8);
}

@media (max-width: 450px) {
  .transaction-chains {
    gap: 0;
    justify-content: space-between;
  }

  .item-value {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}
</style>
