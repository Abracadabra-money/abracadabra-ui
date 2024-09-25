<template>
  <ul class="pool-table-head">
    <li
      :class="['table-item', { 'pair-name': tableKey == 'Token pair' }]"
      v-for="{ tableKey, tooltip, isSortingCriterion } in tableKeys"
      :key="tableKey"
    >
      <Arrows
        v-if="isSortingCriterion"
        :sortOrder="getSortOrder(tableKey)"
        @click.stop="updateSort(tableKey)"
      />

      <span class="item-text">{{ tableKey }}</span>

      <TooltipIcon
        v-if="tooltip"
        :width="18"
        :height="18"
        fill="#878B93"
        :tooltip="tooltip"
      />
    </li>
  </ul>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    tableKeys: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      sortKey: "",
      sortOrder: true,
    };
  },

  methods: {
    updateSort(key) {
      if (key === this.sortKey) {
        if (!this.sortOrder) this.sortOrder = "up";
        else if (this.sortOrder === "up") this.sortOrder = "down";
        else if (this.sortOrder === "down") this.sortOrder = null;
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
    Arrows: defineAsyncComponent(() =>
      import("@/components/ui/icons/Arrows.vue")
    ),
    TooltipIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/Tooltip.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-table-head {
  padding: 0 32px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
  min-width: 1155px;
}

.table-item {
  width: 100%;
  max-width: 190px;
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.pair-name {
  justify-content: start;
  min-width: 160px;
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

@media screen and (max-width: 1024px) {
  .pool-table-head {
    width: 930px;
  }
}

@media screen and (max-width: 600px) {
  .pool-table-head {
    display: none;
  }
}
</style>
