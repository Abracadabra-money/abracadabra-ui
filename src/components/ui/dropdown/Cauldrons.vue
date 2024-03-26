<template>
  <div class="dropdown" v-click-outside="closeDropdown">
    <button
      class="dropdown-header"
      :class="{ 'dropdown-open': isOpenDropdown, disabled: isDisabled }"
      @click="toogleDropdown"
    >
      <div class="cauldron-info">
        <img
          class="cauldron-icon"
          :src="cauldronInfo.icon"
          :alt="cauldronInfo.name"
          v-if="cauldronInfo?.icon"
        />
        <span>{{ cauldronInfo.name }}</span>
      </div>

      <img src="@/assets/images/arrow-down.svg" alt="Arrow" />
    </button>
    <div class="dropdown-list" v-show="isOpenDropdown">
      <template v-if="cauldronData?.length">
        <button
          class="dropdown-item"
          v-for="(data, i) in cauldronData"
          @click="changeDropdownValue(data.id)"
          :key="i"
        >
          <span class="dropdown-item-info">
            <img class="dropdown-item-icon" :src="data.icon" alt="" />
            <span>{{ data.name }}</span>
            <span class="interest">{{ data.interest || 0 }}%</span>
          </span>
          <span>{{
            `${data.address.slice(0, 6)}...${data.address.slice(-6)}`
          }}</span>
        </button>
      </template>
      <button class="dropdown-item" v-else>
        No borrow on this network in the future they will be displayed here
      </button>
    </div>
  </div>
</template>

<script>
import { getCauldronList } from "@/helpers/tenderly/getCauldronList";

export default {
  props: {
    isDisabled: {
      type: Boolean,
      default: false,
    },
    forkChainId: {
      type: Number,
      default: 1,
    },
  },

  data() {
    return {
      isOpenDropdown: false,
      selectedCauldron: null,
      cauldronData: null,
    };
  },

  computed: {
    cauldronInfo() {
      if (!this.selectedCauldron)
        return { icon: null, name: "Select Cauldron" };
      return this.selectedCauldron;
    },
  },

  methods: {
    toogleDropdown() {
      if (this.isDisabled) return false;
      this.isOpenDropdown = !this.isOpenDropdown;
    },

    closeDropdown() {
      this.isOpenDropdown = false;
    },

    changeDropdownValue(cauldronId) {
      this.selectedCauldron = this.cauldronData.find(
        (cauldron) => cauldron.id === cauldronId
      );

      this.closeDropdown();
      this.$emit("changeCauldron", this.selectedCauldron.address);
    },
  },

  async created() {
    this.cauldronData = await getCauldronList(this.forkChainId);
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
  padding: 10px 25px;
  border-radius: 20px;
  border: none;
  color: #fff;
  cursor: pointer;
  background-color: hsla(0, 0%, 100%, 0.06);
}

.dropdown-header:hover {
  background-color: #55535d;
}

.dropdown-open {
  background: #55535d;
  border-radius: 20px 20px 0 0;
}

.disabled {
  cursor: not-allowed;
  background: #403e4a;
  color: rgba(255, 255, 255, 0.6);
}

.disabled:hover {
  background: #403e4a;
}

.cauldron-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.cauldron-icon {
  width: 20px;
  max-height: 25px;
}

.dropdown-list {
  position: absolute;
  width: 100%;
  z-index: 1;
  top: 50px;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 0 0 20px 20px;
}

.dropdown-item {
  height: 50px;
  width: 100%;
  border: none;
  color: white;
  cursor: pointer;
  background-color: #55535d;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 10px 25px;
}

.dropdown-item :hover {
  color: #76c3f5;
}

.dropdown-item-info {
  display: flex;
  gap: 10px;
  align-items: center;
}

.dropdown-item-icon {
  max-width: 20px;
  width: 100%;
  max-height: 25px;
}

.interest {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
