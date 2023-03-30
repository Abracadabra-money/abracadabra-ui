<template>
  <div class="dropdown" v-click-outside="closeDropdawn">
    <button
      class="dropdown-header"
      :class="{ 'dropdown-open': isOpenDropdawn }"
      @click="toogleDropdawn"
    >
      <img
        class="sort-icon"
        :class="reverseClass"
        src="@/assets/images/filter.svg"
        alt="filter"
      />
      <span>{{ `Sorted by ${selectedSortData.title}` }}</span>
      <img
        class="arrow-icon"
        src="@/assets/images/arrow-down.svg"
        alt="filter"
      />
    </button>
    <div class="dropdown-list" v-show="isOpenDropdawn">
      <button
        class="dropdown-item"
        v-for="(titleData, i) in sortList.filter(
          ({ name }) => name !== selectedSort
        )"
        @click="changeDropdawnValue(titleData.name)"
        :key="i"
      >
        {{ titleData.title }}
      </button>
    </div>
  </div>
  <!-- <div class="dropdown-wrap">
    <div class="dropdown-btn" @click="clickHandler" @mousedown="checkFocus">
      <button class="sort-btn open-btn">
        <span class="sort-title-wrap">
          <button @click.stop="changeSortingOrder" class="sort-icon-wrap">
            <img
              class="sort-icon"
              :class="reverseClass"
              src="@/assets/images/filter.svg"
              alt="filter"
            />
          </button>
          <span>{{ `Sorted by ${selectedSortData.title}` }}</span>
        </span>
        <img
          class="arrow-icon"
          src="@/assets/images/arrow-down.svg"
          alt="filter"
        />
      </button>
    </div>
    <div
      class="dropdown-list"
      @click="listClickHandler"
      v-show="isOpenDropdawn"
    >
      <button
        class="sort-btn sort-item"
        v-for="(titleData, i) in sortList.filter(
          ({ name }) => name !== selectedSort
        )"
        @click="$emit('changeSortBy', titleData.name)"
        :key="i"
      >
        {{ titleData.title }}
      </button>
    </div>
  </div> -->
</template>

<script>
export default {
  props: {
    selectedSortData: {},
    sortList: {},
    selectedSort: {},
  },

  data() {
    return {
      isSortReverse: false,
      isBtnAlreadyFocused: false,
      isOpenDropdawn: false,
    };
  },

  computed: {
    reverseClass() {
      return this.isSortReverse ? "sort-icon-reverse" : "";
    },
  },

  methods: {
    toogleDropdawn() {
      this.isOpenDropdawn = !this.isOpenDropdawn;
    },

    closeDropdawn() {
      this.isOpenDropdawn = false;
    },

    changeDropdawnValue(value) {
      this.$emit("changeSortBy", value);
      this.toogleDropdawn;
    },
    // ---------

    changeSortingOrder() {
      this.isSortReverse = !this.isSortReverse;
      this.$emit("changeReverse", this.isSortReverse);
    },

    checkFocus() {
      //   const btn = this.$refs.dropdownBtn.children[0];
      //   this.isBtnAlreadyFocused = btn === document.activeElement;
    },
    clickHandler() {
      this.isOpenDropdawn = !this.isOpenDropdawn;
      //   const btn = this.$refs.dropdownBtn.children[0];
      //   if (this.isBtnAlreadyFocused) document.activeElement.blur();
      //   else btn.focus();
    },
    listClickHandler(event) {
      if (event.target.tabIndex >= 0) document.activeElement.blur();
    },
  },

  components: {
    // DropdownWrap,
  },
};
</script>

<style lang="scss" scoped>
.dropdown {
  width: 100%;
  position: relative;
}

.dropdown-header {
  height: 50px;
  color: #fff;
  cursor: pointer;
  border: none;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  padding: 0 17px 0 12px;
  width: 100%;
  background-color: hsla(0, 0%, 100%, 0.06);

  &:hover {
    background-color: #55535d;
  }
}

.dropdown-open {
  background: #55535d;
  border-radius: 20px 20px 0 0;
}

.dropdown-list {
  position: absolute;
  width: 100%;
  z-index: 1;
  border-radius: 20px;
  top: 50px;
}

.dropdown-item {
  height: 50px;
  color: white;
  cursor: pointer;
  border: none;
  width: 100%;
  background-color: #55535d;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background-color: #55535d;
  }
}

.dropdown-item:last-child {
  border-radius: 0 0 20px 20px;
}

// .dropdown-wrap {
//   position: relative;
//   display: block;
//   .dropdown-btn {
//     width: 100%;
//   }
//   .dropdown-list {
//     display: none;
//     position: absolute;
//     top: 100%;
//     flex-direction: column;
//     width: 100%;
//     z-index: 300;
//   }
//   &:focus-within {
//     .dropdown-list {
//       display: flex;
//     }
//   }
// }

// .dropdown {
//   position: relative;

//   &:focus-within {
//     .dropdown-list {
//       display: flex;
//     }
//   }
// }

// .open-btn {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   border-radius: 20px;
//   padding: 0 17px 0 12px;
//   width: 100%;
//   background-color: rgba(255, 255, 255, 0.06);

//   &:hover {
//     background-color: #55535d;
//   }

//   .sort-icon {
//     width: 20px;
//     &-reverse {
//       transform: rotate(180deg);
//     }
//     &-wrap {
//       display: flex;
//       justify-content: center;
//       align-items: center;
//       background-color: transparent;
//       border: none;
//       cursor: pointer;

//       margin-right: 10px;
//     }
//   }

//   .arrow-icon {
//     margin-left: 25px;
//   }
// }

// .sort-btn {
//   height: 50px;
//   color: white;
//   cursor: pointer;
//   border: none;
// }

// .sort-title-wrap {
//   display: flex;
//   align-items: center;
// }

// .sort-item {
//   border-top: 1px solid rgba(255, 255, 255, 0.1);
//   background-color: #55535d;

//   &:last-child {
//     border-bottom-left-radius: 20px;
//     border-bottom-right-radius: 20px;
//   }
// }

// .dropdown {
//   grid-column: auto / span 1;
//   &:focus-within {
//     .open-btn {
//       border-bottom-left-radius: 0;
//       border-bottom-right-radius: 0;
//       background-color: #55535d;
//       color: white !important;
//     }
//     .sort-btn {
//       background-color: #55535d;
//       &:hover {
//         color: #76c3f5;
//       }
//     }
//   }
// }
</style>
