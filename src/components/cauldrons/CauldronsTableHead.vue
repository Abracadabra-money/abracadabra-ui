<template>
  <ul class="cauldron-table-head">
    <li class="table-item" v-for="item in headItems" :key="item.text">
      <img
        class="item-icon"
        src="@/assets/images/cauldrons/sort.svg"
        alt="Sort icon"
      />
      <span class="item-text">{{ item.text }}</span>
      <img
        class="item-tooltip"
        src="@/assets/images/cauldrons/tooltip.svg"
        v-if="item.tooltip"
        v-tooltip="item.tooltip"
        alt="Tooltip icon"
      />
    </li>
  </ul>
</template>

<script lang="ts">
export default {
  data() {
    return {
      headItems: [
        {
          text: "Collateral",
        },
        {
          text: "TVL",
          tooltip: "tooltip",
        },
        {
          text: "TMB",
          tooltip: "tooltip",
        },
        {
          text: "MIMS LB",
          tooltip: "tooltip",
        },
        {
          text: "Interest",
          tooltip: "tooltip",
        },
        {
          text: "APR",
          tooltip: "tooltip",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.cauldron-table-head {
  padding: 0 32px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-item {
  width: 100%;
  max-width: 180px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.item-icon {
  width: 9px;
  height: 15px;
}

.item-text {
  color: #878b93;
  font-weight: 500;
  line-height: 150%;
}

.item-tooltip {
  width: 18px;
  height: 18px;
  cursor: pointer;
}
</style>
