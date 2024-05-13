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

    <div class="filters">
      <div class="filter" v-for="sorter in sortersData" :key="sorter.tableKey">
        <p class="filter-title">
          Sort by {{ sorter.text ? sorter.text : sorter.tableKey }}
        </p>
        <label class="label" :for="`${sorter.tableKey}-down`">
          <span class="checkmark"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
            >
              <rect
                x="0.5"
                y="1"
                width="19"
                height="19"
                rx="9.5"
                stroke="#7088CC"
              />
              <rect
                x="3"
                y="3.5"
                width="14"
                height="14"
                rx="7"
                fill="#7088CC"
                v-if="comparePikedAndSorter(sorter, 'down')"
              /></svg
          ></span>
          <input
            class="radio-button"
            type="radio"
            :id="`${sorter.tableKey}-down`"
            :value="{ sorter, order: 'down' }"
            v-model="picked"
          />
          {{ sorter.text ? sorter.text : sorter.tableKey }}: Low to high
        </label>

        <label class="label" :for="`${sorter.tableKey}-up`">
          <span class="checkmark"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
            >
              <rect
                x="0.5"
                y="1"
                width="19"
                height="19"
                rx="9.5"
                stroke="#7088CC"
              />
              <rect
                x="3"
                y="3.5"
                width="14"
                height="14"
                rx="7"
                fill="#7088CC"
                v-if="comparePikedAndSorter(sorter, 'up')"
              /></svg
          ></span>
          <input
            class="radio-button"
            type="radio"
            :id="`${sorter.tableKey}-up`"
            :value="{ sorter, order: 'up' }"
            v-model="picked"
          />
          {{ sorter.text ? sorter.text : sorter.tableKey }}: High to low
        </label>
      </div>
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

<script>
import BaseButton from "@/components/base/BaseButton.vue";

export default {
  props: {
    sortersData: { type: Array },
  },

  data() {
    return {
      picked: null,
    };
  },

  computed: {
    isDisabled() {
      return !this.picked;
    },
  },

  methods: {
    comparePikedAndSorter(sorter, order) {
      return (
        sorter.tableKey == this.picked?.sorter.tableKey &&
        order == this.picked?.order
      );
    },

    applyFilter() {
      if (!this.picked) return false;
      this.$emit(
        "updateSortKey",
        this.picked?.sorter.tableKey,
        this.picked?.order
      );
      this.closePopup();
    },

    closePopup() {
      this.$emit("close");
    },
  },

  components: {
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
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

.filters {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  overflow: auto;
}

.filter {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.label {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 35px;
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

.radio-button {
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
</style>
