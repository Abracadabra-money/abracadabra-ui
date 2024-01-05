<template>
  <ul class="cauldron-table-head">
    <li
      class="table-item"
      v-for="{ tableKey, tooltip } in tableKeys"
      :key="tableKey"
    >
      <Arrows
        v-if="tableKey != 'Collateral'"
        :sortOrder="getSortOrder(tableKey)"
        @click.stop="updateSort(tableKey)"
      />

      <span class="item-text">{{ tableKey }}</span>

      <img
        class="item-tooltip"
        src="@/assets/images/cauldrons/tooltip.svg"
        v-if="tooltip"
        v-tooltip="tooltip"
        alt="Tooltip icon"
      />
    </li>
  </ul>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      sortKey: "",
      sortOrder: true,
      tableKeys: [
        {
          tableKey: "Collateral",
        },
        {
          tableKey: "TVL",
          tooltip: "tooltip",
        },
        {
          tableKey: "TMB",
          tooltip: "tooltip",
        },
        {
          tableKey: "MIMS LB",
          tooltip: "tooltip",
        },
        {
          tableKey: "Interest",
          tooltip: "tooltip",
        },
        {
          tableKey: "APR",
          tooltip: "tooltip",
        },
      ],
    };
  },

  methods: {
    updateSort(key) {
      if (key === this.sortKey) {
        if (!this.sortOrder) this.sortOrder = "up";
        else if (this.sortOrder === "up") this.sortOrder = "down";
        else if (this.sortOrder === "down") this.sortOrder = false;
      } else {
        this.sortKey = key;
        this.sortOrder = "up";
      }

      this.$emit("updateSort", key, this.sortOrder);
    },

    getSortOrder(key) {
      return key === this.sortKey ? this.sortOrder : null;
    },
  },
  components: {
    Arrows: defineAsyncComponent(() => import("@/components/icons/Arrows.vue")),
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

@media screen and (max-width: 1024px) {
  .cauldron-table-head {
    width: 930px;
  }
}
</style>
