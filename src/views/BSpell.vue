<template>
  <div class="page-view">
    <div class="content-wrap">
      <BSpellHeader @changeActiveTab="changeActiveTab" />

      <component :is="activeTab" />
    </div>
  </div>
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      activeTab: "BSpellBlock",
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),
  },

  methods: {
    changeActiveTab(tabName: string) {
      this.activeTab = tabName;
    },
  },

  components: {
    BSpellHeader: defineAsyncComponent(
      () => import("@/components/bSpell/BSpellHeader.vue")
    ),
    BSpellBlock: defineAsyncComponent(
      () => import("@/components/bSpell/BSpellBlock.vue")
    ),
    SpellPowerBlock: defineAsyncComponent(
      () => import("@/components/bSpell/SpellPowerBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.page-view {
  min-height: 100vh;
}

.content-wrap {
  max-width: 1310px;
  width: 100%;
  padding: 124px 15px 90px;
  margin: 0 auto;
  position: relative;
}
</style>
