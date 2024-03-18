<template>
  <div
    :class="['deposit-card', 'pool', { locked: isLocked }]"
    @click="$emit('openFounderPopup')"
  >
    <div class="label">{{ labelText }}</div>

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
        {{
          formatTokenBalance(
            token.userInfo.balances[stakeType],
            token.config.decimals
          )
        }}
      </div>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import { formatUnits } from "viem";
import { formatTokenBalance } from "@/helpers/filters";
import mimUsdbIcon from "@/assets/images/tokens/MIM-USDB.png";

export default {
  props: {
    stakeInfo: { type: Object },
    isLocked: { type: Boolean, default: false },
  },

  data() {
    return {
      mimUsdbIcon,
    };
  },

  computed: {
    stakeType() {
      return this.isLocked ? "locked" : "unlocked";
    },

    labelText() {
      return this.isLocked ? "Founder" : "LP’er";
    },
  },

  methods: {
    formatTokenBalance(value) {
      return formatTokenBalance(formatUnits(value, 18));
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
};
</script>

<style lang="scss" scoped>
.deposit-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 174px;
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

.locked {
  background: linear-gradient(
    104deg,
    rgba(251, 253, 3, 0.36) 0%,
    rgba(251, 253, 3, 0.36) 28.64%,
    rgba(254, 255, 172, 0.36) 52.14%,
    rgba(253, 255, 0, 0.36) 70.64%,
    rgba(253, 255, 0, 0.36) 100%
  );
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

.pool-info {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.pool-text {
  text-align: start;
}

.pool-name {
  font-size: 20px;
}

.values-description {
  font-size: 16px;
}

.total-by-token {
  display: flex;
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
