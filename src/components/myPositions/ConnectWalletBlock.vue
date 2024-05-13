<template>
  <div class="connect-wallet">
    <img
      class="icon"
      src="@/assets/images/myPositions/connect-wallet.png"
      alt="Empty icon"
      @click="connectWallet"
    />

    <BaseButton class="connect-button" primary @click="connectWallet">
      Connect wallet
    </BaseButton>
  </div>
</template>

<script lang="ts">
import BaseButton from "@/components/base/BaseButton.vue";

export default {
  methods: {
    connectWallet() {
      //@ts-ignore
      this.$openWeb3modal();
    },
  },

  components: {
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.connect-wallet {
  display: flex;
  gap: 22px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 60px 0;
}

.icon {
  max-width: 400px;
  width: 100%;
}

.connect-button {
  width: 330px;
}
</style>
