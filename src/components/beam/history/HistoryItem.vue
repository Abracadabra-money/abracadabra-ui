<template>
  <li class="history-item">
    <TransactionStatus :config="beamHistory" />

    <div class="transaction-main">
      <div class="transaction-chains">
        <TransactionChain
          :chain="beamHistory.originChain"
          :address="beamHistory.sendFrom"
        />

        <TransactionChain
          destination="to"
          :chain="beamHistory.dstChain"
          :address="beamHistory.sendTo"
        />
      </div>

      <ul class="transaction-info">
        <li class="info-item">
          <span class="item-title">MIM transferred:</span>
          <span class="item-value">{{ beamHistory.mimAmount }} MIM</span>
        </li>

        <li class="info-item">
          <span class="item-title">Convert to gas token:</span>
          <span class="item-value">
            <template v-if="isNone">None</template>
            <template v-else>
              <span> {{ originalTokenAmount }}</span>
              <img class="arrow" src="/src/assets/images/arrow_right.svg" />
              <span class="converted-value"> {{ convertTokenAmount }}</span>
            </template>
          </span>
        </li>

        <li class="info-item">
          <span class="item-title">Beaming Fee:</span>
          <span class="item-value">$ 1.00</span>
        </li>

        <li class="info-item">
          <span class="item-title">Total gas cost:</span>
          <span class="item-value"
            >{{ beamHistory.totalGas || "0.0 " }}
            {{ beamHistory.nativeSymbol }}</span
          >
        </li>
      </ul>
    </div>
  </li>
</template>

<script>
import TransactionStatus from "@/components/beam/history/TransactionStatus.vue";
import TransactionChain from "@/components/beam/history/TransactionChain.vue";
import filters from "@/filters/index.js";

export default {
  props: {
    beamHistory: {
      type: Object,
    },
  },

  computed: {
    originalTokenAmount() {
      if (!+this.beamHistory.gasOnDst)
        return `<0.001 ${this.beamHistory.nativeSymbol}`;
      return `${this.beamHistory.gasOnDst} ${this.beamHistory.nativeSymbol}`;
    },

    destinationTokenAmount() {
      return filters.formatToFixed(this.beamHistory.dstTokenAmount || "0.0", 3);
    },

    convertTokenAmount() {
      if (!+this.destinationTokenAmount)
        return `<0.001 ${this.beamHistory.dstTokenSymbol}`;
      return `${this.destinationTokenAmount} ${this.beamHistory.dstTokenSymbol}`;
    },

    isNone() {
      return !+this.beamHistory.gasOnDst && !+this.beamHistory.dstTokenAmount;
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

.item-value {
  display: flex;
  align-items: center;
  gap: 5px;
}

.arrow {
  margin-bottom: 3px;
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
