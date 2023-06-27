<template>
  <li class="history-item">
    <TransactionStatus />

    <div class="transaction-main">
      <div class="transaction-chains">
        <div class="chain from">
          <img class="chain-icon" :src="chainsConfig.from.icon" />
          <div class="chain-info">
            <p class="name">From: {{ chainsConfig.from.name }}</p>
            <p class="address">
              {{ formatAddress(chainsConfig.from.address) }}
            </p>
          </div>
        </div>
        <div class="chain to">
          <img class="chain-icon" :src="chainsConfig.to.icon" />
          <div class="chain-info">
            <p class="name">To: {{ chainsConfig.to.name }}</p>
            <p class="address">
              {{ formatAddress(chainsConfig.to.address) }}
            </p>
          </div>
        </div>
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

  methods: {
    formatAddress(address) {
      return `${address.slice(0, 4)}...${address.slice(-3)}`;
    },
  },

  components: {
    TransactionStatus,
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

.chain {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chain-icon {
  height: 32px;
  width: 32px;
  border-radius: 50px;
}
.chain-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.name {
  color: rgba(255, 255, 255, 1);
  font-size: 14px;
  letter-spacing: 0.35px;
}

.address {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  letter-spacing: 0.3px;
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
</style>
