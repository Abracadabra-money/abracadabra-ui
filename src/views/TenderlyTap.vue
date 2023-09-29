<template>
  <div class="tendarly-tap-view">
    <div class="tenderly-tap">
      <h3 class="title">Tendarly Tap</h3>

      <div class="wrapper">
        <div class="actions">
          <div class="underline">
            <CreateForkBlock />
          </div>

          <div class="btn-wrap">
            <BaseButton @click="changeTabComponent('WalletTopUpBlock')"
              >Wallet Top Up</BaseButton
            >
            <BaseButton @click="changeTabComponent('GasTopUpBlock')"
              >Gas Top Up</BaseButton
            >
            <BaseButton @click="changeTabComponent('CauldronTopUpBlock')"
              >Cauldron Top Up</BaseButton
            >
          </div>

          <component
            v-bind:is="currentTabComponent"
            :activeFork="activeFork"
          ></component>
        </div>

        <ForksInfoBlock />
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  data() {
    return {
      forksData: JSON.parse(localStorage.getItem("tenderly_fork_data")),
      currentTabComponent: "WalletTopUpBlock",
    };
  },

  computed: {
    activeFork() {
      if (!this.forksData) return null;
      return this.forksData.find((forkData) => {
        if (forkData.useFork) return forkData;
      });
    },
  },

  methods: {
    changeTabComponent(componentName) {
      this.currentTabComponent = componentName;
    },
  },

  components: {
    CreateForkBlock: defineAsyncComponent(() =>
      import("@/components/tenderly/CreateForkBlock.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    WalletTopUpBlock: defineAsyncComponent(() =>
      import("@/components/tenderly/WalletTopUpBlock.vue")
    ),
    GasTopUpBlock: defineAsyncComponent(() =>
      import("@/components/tenderly/GasTopUpBlock.vue")
    ),
    CauldronTopUpBlock: defineAsyncComponent(() =>
      import("@/components/tenderly/CauldronTopUpBlock.vue")
    ),
    ForksInfoBlock: defineAsyncComponent(() =>
      import("@/components/tenderly/ForksInfoBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.tendarly-tap-view {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 15px;
}

.tenderly-tap {
  background: #2a2835;
  padding: 50px 30px;
  max-width: 1260px;
  width: 100%;
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 15px 0 0;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-wrap {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

@media screen and (max-width: 1024px) {
  .wrapper {
    flex-direction: column;
    gap: 30px;
  }
}
</style>
