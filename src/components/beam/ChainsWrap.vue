<template>
  <div class="chains-wrap">
    <button class="select-item" @click="$emit('changeNetwork', 'from')">
      <h3 class="title">Origin Chain</h3>
      <div class="description">
        <img class="chain-icon" :src="fromChain.icon" alt="Icon" />
        <p>{{ fromChain.title }}</p>
      </div>
    </button>

    <button class="switch-chain-button" :disabled="isNetworkToChangeDisabled">
      <img
        class="switch-chain-image"
        @click="$emit('switch-chain')"
        src="@/assets/images/beam/refresh.svg"
        alt="Switch network"
      />
    </button>

    <button
      class="select-item"
      @click="$emit('changeNetwork', 'to')"
      :disabled="isNetworkToChangeDisabled"
    >
      <h3 class="title">Destination Chain</h3>
      <div class="description">
        <img class="chain-icon" :src="destinationChain.icon" alt="" />
        <p>{{ destinationChain.title }}</p>
      </div>
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { useImage } from "@/helpers/useImage";
export default {
  props: {
    selectChain: {
      type: Boolean,
      default: false,
    },
    fromChain: {
      type: [Object],
      require: true,
    },
    toChain: {
      type: Object,
      require: true,
    },
  },

  computed: {
    ...mapGetters({ account: "getAccount" }),

    destinationChain() {
      if (!this.selectChain || !this.toChain)
        return {
          title: "Select chain",
          icon: useImage(`assets/images/networks/no-chain.svg`),
        };
      return this.toChain;
    },

    isNetworkToChangeDisabled() {
      return this.fromChain.isUnsupportedNetwork || !this.account;
    },
  },
};
</script>

<style lang="scss" scoped>
.chains-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.select-item {
  width: 200px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 20px;
  border: none;
  padding: 16px;
  color: white;
  cursor: pointer;
}

.title {
  font-weight: 600;
  font-size: 16px;
  line-height: 150%;
  margin-bottom: 8px;
  text-align: center;
}

.description {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
}

.chain-icon {
  width: 60px;
  height: 60px;
}

.switch-chain-button {
  background: transparent;
  border: none;
}
.switch-chain-image {
  width: 40px;
  height: 40px;
  cursor: pointer;
}

@media (max-width: 600px) {
  .chains-wrap {
    flex-direction: column;
    gap: 15px;
  }

  .select-item {
    width: 100%;
  }
}
</style>
