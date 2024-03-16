<template>
  <router-link
    :to="{
      name: 'Market',
      params: {
        chainId: cauldronInfo.config.chainId,
        cauldronId: cauldronInfo.config.id,
      },
    }"
    class="deposit-card cauldron"
    v-if="cauldronInfo"
  >
    <div class="label">Minter</div>
    <div class="cauldron-info">
      <TokenChainIcon
        class="pool-icon"
        :icon="cauldronInfo.config.icon"
        :name="cauldronInfo.config.name"
        :chainId="cauldronInfo.config.chainId"
        size="42px"
      />
      <div class="cauldron-text">
        <p class="cauldron-name">WETH cauldron</p>
        <p class="cauldron-description">Deposited into the Cauldron</p>
      </div>
      <div class="token-part">
        <BaseTokenIcon
          :icon="cauldronInfo.config.icon"
          :name="cauldronInfo.config.name"
          size="32px"
        />
        {{ formatTokenBalance(cauldronInfo.userPosition.collateralDeposited) }}
      </div>
    </div>
  </router-link>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { providers } from "ethers";
import { defaultRpc } from "@/helpers/chains";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";

export default {
  data() {
    return {
      cauldronInfo: null,
      cauldronChainId: 81457,
      cauldronId: 1,
      updateInterval: null,
    };
  },

  methods: {
    formatTokenBalance(value) {
      return formatTokenBalance(formatUnits(value, 18));
    },

    async createCauldronInfo() {
      const currentRpc = defaultRpc[this.cauldronChainId];

      const chainProvider = new providers.StaticJsonRpcProvider(currentRpc);

      this.cauldronInfo = await getCauldronInfo(
        this.cauldronId,
        this.cauldronChainId,
        chainProvider,
        chainProvider
      );
    },
  },

  components: {
    TokenChainIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/TokenChainIcon.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
  },

  async created() {
    await this.createCauldronInfo();
    this.updateInterval = setInterval(async () => {
      await this.createCauldronInfo();
    }, 60000);
  },
};
</script>

<style lang="scss" scoped>
.deposit-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 174px;
  max-width: 410px;
  width: 100%;
  border: 1px solid #fcfd02;
  border-radius: 16px;
  padding: 21px 12px 16px 12px;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  backdrop-filter: blur(12.5px);
  color: white;
  transition: all 0.5s ease-in-out;
}

.label {
  position: absolute;
  top: -1px;
  left: -1px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 117px;
  height: 25px;
  border-radius: 16px 0 8px 0px;
  background: #fcfd02;
  color: #000;
  font-size: 12px;
  font-weight: 500;
}

.cauldron-name {
  font-size: 20px;
}

.cauldron-description {
  font-size: 16px;
}

.cauldron-info,
.cauldron-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cauldron-info {
  gap: 4px;
}

.cauldron-info {
  font-size: 34px;
}
</style>
