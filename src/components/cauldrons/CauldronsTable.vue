<template>
  <div class="cauldrons-table-wrap">
    <div class="additional-logic">
      <div class="toggles-wrap">
        <Toggle text="My positions" />
        <Toggle text="Active Cauldrons" />
      </div>
      <div class="filters-wrap">
        <ChainsDropdown />
        <InputSearch />
      </div>
    </div>

    <div class="table-wrap">
      <CauldronsTableHead />

      <div class="cauldrons-items-wrap">
        <CauldronsTableItem
          v-for="cauldron in cauldrons"
          :key="cauldron.config.contract.address"
          :cauldron="cauldron"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    cauldrons: Array,
  },

  data() {
    return {};
  },

  components: {
    Toggle: defineAsyncComponent(() => import("@/components/ui/Toggle.vue")),
    ChainsDropdown: defineAsyncComponent(() =>
      import("@/components/ui/ChainsDropdown.vue")
    ),
    InputSearch: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputSearch.vue")
    ),
    CauldronsTableHead: defineAsyncComponent(() =>
      import("@/components/cauldrons/CauldronsTableHead.vue")
    ),
    CauldronsTableItem: defineAsyncComponent(() =>
      import("@/components/cauldrons/CauldronsTableItem.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.cauldrons-table-wrap {
  @include font;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
  padding: 24px;
  width: 100%;
  display: flex;
  gap: 32px;
  flex-direction: column;
}

.additional-logic {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toggles-wrap,
.filters-wrap {
  display: flex;
  gap: 20px;
  align-items: center;
}

.cauldrons-items-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
