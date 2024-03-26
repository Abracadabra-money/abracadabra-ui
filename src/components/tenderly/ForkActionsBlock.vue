<template>
  <div class="fork-actions-block">
    <h3 class="title">Fork creations</h3>
    <div class="btn-wrap">
      <BaseButton
        :primary="primaryTab === 'WalletTopUpBlock'"
        @click="$emit('changeTab', 'WalletTopUpBlock')"
        >Wallet top up</BaseButton
      >
      <BaseButton
        :primary="primaryTab === 'GasTopUpBlock'"
        @click="$emit('changeTab', 'GasTopUpBlock')"
        >Gas top up</BaseButton
      >
      <BaseButton
        :primary="primaryTab === 'CauldronTopUpBlock'"
        @click="$emit('changeTab', 'CauldronTopUpBlock')"
        >Cauldron top up</BaseButton
      >
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";

export default {
  props: {
    primaryTab: {
      type: String,
    },
  },

  components: {
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.fork-actions-block {
  background-color: rgba(35, 33, 45, 0.3019607843);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 30px;
  padding: 15px;
}
.title {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 15px;
}

.btn-wrap {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}
</style>
