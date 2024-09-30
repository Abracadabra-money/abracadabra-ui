<template>
  <div class="filters-popup">
    <div class="popup-header">
      <p class="title">Filter</p>

      <img
        class="close-img"
        src="@/assets/images/cross.svg"
        alt="Close popup"
        @click="closePopup"
      />
    </div>

    <div class="filters" v-if="filtersData">
      <template v-for="filter in filtersData" :key="filter.filterKey">
        <div class="filter">
          {{ filter.text }}

          <div class="options">
            <div
              class="option"
              v-for="(option, index) in filter.options"
              :key="index"
              @click="pickOption(filter.filterKey, option)"
            >
              <RadioButton
                :active="
                  filtersOptionsPickedByKey[filter.filterKey].options[index]
                    .value
                "
              />
              {{ option }}
            </div>
          </div>
        </div>
      </template>
    </div>

    <div class="divider" v-if="filtersData"></div>

    <div class="sorters">
      <template v-for="sorter in sortersData" :key="sorter.tableKey">
        <div class="sorter" v-if="sorter.isSortingCriterion">
          <p class="sorter-title">
            Sort by {{ sorter.text ? sorter.text : sorter.tableKey }}
          </p>
          <label class="label" :for="`${sorter.tableKey}-down`">
            <RadioButton :active="comparePikedAndSorter(sorter, 'down')" />

            <input
              class="radio-button-input"
              type="radio"
              :id="`${sorter.tableKey}-down`"
              :value="{ sorter, order: 'down' }"
              v-model="picked"
            />
            {{ sorter.text ? sorter.text : sorter.tableKey }}: Low to high
          </label>

          <label class="label" :for="`${sorter.tableKey}-up`">
            <RadioButton :active="comparePikedAndSorter(sorter, 'up')" />
            <input
              class="radio-button-input"
              type="radio"
              :id="`${sorter.tableKey}-up`"
              :value="{ sorter, order: 'up' }"
              v-model="picked"
            />
            {{ sorter.text ? sorter.text : sorter.tableKey }}: High to low
          </label>
        </div>
      </template>
    </div>

    <BaseButton
      class="apply-button"
      :disabled="isDisabled"
      primary
      @click="applyFilter"
    >
      Apply filters
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent, type PropType } from "vue";
import type { FilterData, SortOrder, SorterData } from "@/types/sorting";

type PickedSorter = {
  sorter: SorterData;
  order: SortOrder;
};

type PickedFilterOption = {
  name: string;
  value: boolean;
};

export default {
  props: {
    filtersData: { type: Array as PropType<FilterData[]> },
    sortersData: { type: Array as PropType<SorterData[]>, required: true },
  },

  data() {
    return {
      picked: null as PickedSorter | null,
      filtersOptionsPickedByKey: {} as any,
    };
  },

  computed: {
    isDisabled() {
      return !this.picked && !this.filtersData;
    },
  },

  methods: {
    comparePikedAndSorter(sorter: SorterData, order: SortOrder) {
      return (
        sorter.tableKey == this.picked?.sorter.tableKey &&
        order == this.picked?.order
      );
    },

    pickOption(filterKey: string, option: string) {
      let valueToSet = false;
      const optionIndex = this.filtersOptionsPickedByKey[
        filterKey
      ].options.findIndex((element: PickedFilterOption) => {
        valueToSet = !element.value;
        return element.name === option;
      });

      this.filtersOptionsPickedByKey[filterKey].options[optionIndex].value =
        valueToSet;
    },

    applyPickedFilterOptions() {
      const filterKeys = Object.keys(this.filtersOptionsPickedByKey);
      filterKeys.forEach((key: string) => {
        const emitter = this.filtersOptionsPickedByKey[key].emitter;
        const optionsToEmit = this.filtersOptionsPickedByKey[key].options
          .filter((option: PickedFilterOption) => option.value)
          .map((option: PickedFilterOption) => option.name);

        emitter(optionsToEmit);
      });
    },

    applyFilter() {
      if (this.picked)
        this.$emit(
          "updateSortKey",
          this.picked?.sorter.tableKey,
          this.picked?.order
        );

      if (this.filtersData) this.applyPickedFilterOptions();

      this.closePopup();
    },

    closePopup() {
      this.$emit("close");
    },
  },

  created() {
    (this.filtersData || []).forEach(({ filterKey, options, emitter }) => {
      this.filtersOptionsPickedByKey[filterKey] = { emitter, options: [] };
      options.forEach((option: string) => {
        this.filtersOptionsPickedByKey[filterKey].options.push({
          name: option,
          picked: false,
        });
      });
    });
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    RadioButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/RadioButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@include scrollbar;

.filters-popup {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  z-index: 300;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 24px;
  padding: 20px 16px 40px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  overflow: auto;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.close-img {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.title {
  font-weight: 500;
  font-size: 18px;
}

.sorters,
.filters {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.sorter,
.filter {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.label,
.option {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  cursor: pointer;
  font-size: 22px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  font-family: Poppins;
  color: #878b93;
  font-size: 14px;
  font-weight: 400;
}

.radio-button-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: -2px;
  left: 0;
}

.apply-button {
  min-height: 39px;
  margin-top: auto;
}

.divider {
  height: 1px;
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0) 100%
  );
}
</style>
