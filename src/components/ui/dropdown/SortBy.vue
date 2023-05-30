<template>
  <div class="dropdown" v-click-outside="closeDropdown">
    <button
      class="dropdown-header"
      :class="{ 'dropdown-open': isOpenDropdown }"
      @click="toogleDropdown"
    >
      <img
        class="sort-icon"
        :class="reverseClass"
        @click.stop="changeSortingOrder"
        src="@/assets/images/filter.svg"
        alt="Sort reverse"
      />
      <span>{{ `Sorted by ${dropdownTitle}` }}</span>
      <img
        class="arrow-icon"
        src="@/assets/images/arrow-down.svg"
        alt="Arrow"
      />
    </button>
    <div class="dropdown-list" v-show="isOpenDropdown">
      <button
        class="dropdown-item"
        v-for="(titleData, i) in dropdownList"
        @click="changeDropdownValue(titleData.name)"
        :key="i"
      >
        {{ titleData.title }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sortList: {
      type: Array,
      required: true,
    },
    activeSortValue: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      isSortReverse: false,
      isOpenDropdown: false,
    };
  },

  computed: {
    reverseClass() {
      return this.isSortReverse ? "sort-reverse" : "";
    },

    dropdownList() {
      return this.sortList.filter(({ name }) => name !== this.activeSortValue);
    },

    dropdownTitle() {
      const sortData = this.sortList.find(
        ({ name }) => name === this.activeSortValue
      );
      return sortData.title;
    },
  },

  methods: {
    toogleDropdown() {
      this.isOpenDropdown = !this.isOpenDropdown;
    },

    closeDropdown() {
      this.isOpenDropdown = false;
    },

    changeDropdownValue(value) {
      this.closeDropdown();
      this.$emit("changeDropdownValue", value);
    },

    changeSortingOrder() {
      this.isSortReverse = !this.isSortReverse;
      this.$emit("changeSortOrder", this.isSortReverse);
    },
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  position: relative;
}

.dropdown-header {
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 17px 0 12px;
  border-radius: 20px;
  border: none;
  color: #fff;
  cursor: pointer;
  background-color: hsla(0, 0%, 100%, 0.06);

  &:hover {
    background-color: #55535d;
  }
}

.dropdown-open {
  background: #55535d;
  border-radius: 20px 20px 0 0;
}

.sort-icon {
  width: 20px;
}

.sort-reverse {
  transform: rotate(180deg);
}

.dropdown-list {
  position: absolute;
  width: 100%;
  z-index: 1;
  top: 50px;
}

.dropdown-item {
  height: 50px;
  width: 100%;
  border: none;
  color: white;
  cursor: pointer;
  background-color: #55535d;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    color: #76c3f5;
  }
}

.dropdown-item:last-child {
  border-radius: 0 0 20px 20px;
}
</style>
