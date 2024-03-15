<template>
  <div class="user-deposits">
    <h3 class="user-deposits-title">Your deposits</h3>

    <div class="deposit-cards">
      <div class="deposit-card pool" @click="$emit('openFounderPopup')">
        <div class="label">Founder</div>

        <div class="pool-info">
          <TokenChainIcon
            class="pool-icon"
            :icon="mimUsdbIcon"
            name="MIM/USDB"
            :chainId="81457"
          />
          <div class="pool-text">
            <p class="pool-name">MIM / USDB Pool</p>
            <p class="values-description">Liquidity added into the pool</p>
          </div>
        </div>

        <div class="total-by-token">
          <div
            class="token-part"
            :key="index"
            v-for="(token, index) in stakeInfo.tokensInfo"
          >
            <BaseTokenIcon
              :name="token.config.name"
              :icon="token.config.icon"
              size="32px"
            />
            $
            {{ formatTokenBalance(token.totals.total, token.config.decimals) }}
          </div>
        </div>
      </div>

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
            {{
              formatTokenBalance(cauldronInfo.userPosition.collateralDeposited)
            }}
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { providers } from "ethers";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";
import { defineAsyncComponent } from "vue";
import { defaultRpc } from "@/helpers/chains";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";
import mimUsdbIcon from "@/assets/images/tokens/MIM-USDB.png";

export default {
  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
    pointsStatistics: {
      type: Object,
      requared: true,
    },
  },

  data() {
    return {
      mimUsdbIcon,
      cauldronChainId: 81457,
      cauldronId: 1,
      cauldronInfo: null,
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

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  async created() {
    await this.createCauldronInfo();
    this.updateInterval = setInterval(async () => {
      await this.createCauldronInfo();
    }, 60000);
  },

  components: {
    TokenChainIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/TokenChainIcon.vue")
    ),
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.user-deposits,
.deposit-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  cursor: pointer;
}

.user-deposits-title {
  font-size: 24px;
  font-weight: 500;
}

.deposit-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 158px;
  border: 1px solid #fcfd02;
  border-radius: 16px;
  padding: 21px 12px 16px 12px;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
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

.pool {
  gap: 16px;
  background: linear-gradient(
      104deg,
      rgba(251, 253, 3, 0.36) 0%,
      rgba(251, 253, 3, 0.36) 28.64%,
      rgba(254, 255, 172, 0.36) 52.14%,
      rgba(253, 255, 0, 0.36) 70.64%,
      rgba(253, 255, 0, 0.36) 100%
    ),
    linear-gradient(
      146deg,
      rgba(35, 0, 0, 0.12) 0%,
      rgba(156, 0, 0, 0.12) 101.49%
    );
}

.pool-info,
.total-by-token {
  display: flex;
  align-items: center;
}

.pool-info {
  margin-top: 8px;
}

.pool-name,
.cauldron-name {
  font-size: 20px;
}

.values-description,
.cauldron-description {
  font-size: 16px;
}

.total-by-token {
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px;
}

.token-part {
  display: flex;
  align-items: center;
  font-size: 20px;
  line-height: 32px;
}

.cauldron {
  height: 186px;
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

.cauldron-info .token-part {
  font-size: 34px;
}

@media screen and (max-width: 600px) {
  .pool-name {
    font-size: 18px;
    margin-top: 4px;
    margin-bottom: -4px;
  }

  .values-description {
    font-size: 14px;
  }

  .token-part {
    font-size: 18px;
  }
}
</style>
