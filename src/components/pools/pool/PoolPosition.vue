<template>
  <div
    :class="['backdrop', { isOpened: isMyPositionPopupOpened }]"
    @click.self="closePopup"
  ></div>
  <div :class="['pool-position-wrap', { isOpened: isMyPositionPopupOpened }]">
    <img
      class="close"
      src="@/assets/images/close-icon.png"
      alt="Close popup"
      @click="closePopup"
    />
    <PointsEarned />
    <div class="pool-position">
      <div class="deposited">
        <h4 class="subtitle">My Position</h4>

        <div class="deposited-token">
          <span class="token-name">
            <BaseTokenIcon :name="pool.name" :icon="pool.icon" size="44px" />
            {{ pool.name }}
          </span>
          <div class="token-amount">
            <span class="value">
              {{ formatTokenBalance(pool.userInfo.balance, pool.decimals) }}
            </span>
            <span class="usd"></span>
          </div>
        </div>

        <ul class="deposited-token-parts token-list">
          <li
            class="deposited-token-part list-item"
            v-for="token in tokensList"
            :key="token.name"
          >
            <span class="token-name">
              <BaseTokenIcon
                :icon="token.icon"
                :name="token.name"
                size="28px"
              />
              {{ token.name }}</span
            >
            <div class="token-amount">
              <span class="value">{{ token.amount }}</span>
              <span class="usd">{{ token.amountUsd }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- <div class="reward">
        <h4 class="subtitle">Reward</h4>

        <ul class="reward-tokens token-list">
          <li
            class="reward-token list-item"
            v-for="token in rewardTokensInfo"
            :key="token"
          >
            <span class="token-name">
              <BaseTokenIcon
                :name="token.name"
                :icon="token.icon"
                size="28px"
              />
              {{ token.name }}</span
            >
            <div class="token-amount">
              <span class="value">{{ token.earned }}</span>
              <span class="usd">{{ token.usd }}</span>
            </div>
          </li>
        </ul>
      </div> -->

      <BaseButton
        primary
        @click="harvest"
        :disabled="disableEarnedButton"
        v-if="!disableEarnedButton"
      >
        Harvest
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from "vue";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import { formatUnits } from "viem";
import { getChainById } from "@/helpers/chains/index";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";

export default {
  props: {
    pool: { type: Object },
    isProperNetwork: { type: Boolean },
    isMyPositionPopupOpened: { type: Boolean, default: false },
  },

  emits: ["closePopup"],

  computed: {
    chainIcon() {
      return getChainById(this.selectedpool.chainId).icon;
    },

    rewardTokensInfo() {
      return [
        {
          ...this.prepBalanceData(11.55, 11.55),
          icon: "",
          name: "MIM",
        },

        {
          ...this.prepBalanceData(11.55, 11.55),
          icon: "",
          name: "USDT",
        },
      ];
    },

    tokensList() {
      const previewRemoveLiquidityResult = previewRemoveLiquidity(
        this.pool.userInfo.balance,
        this.pool
      );

      const tokensList = [
        {
          name: this.pool.tokens.baseToken.config.name,
          icon: this.pool.tokens.baseToken.config.icon,
          amount: this.formatTokenBalance(
            previewRemoveLiquidityResult.baseAmountOut,
            this.pool.tokens.baseToken.config.decimals
          ),
          amountUsd: this.formatUSD(
            this.formatTokenBalance(
              previewRemoveLiquidityResult.baseAmountOut,
              this.pool.tokens.baseToken.config.decimals
            ) * this.pool.tokens.baseToken.price
          ),
        },
        {
          name: this.pool.tokens.quoteToken.config.name,
          icon: this.pool.tokens.quoteToken.config.icon,
          amount: this.formatTokenBalance(
            previewRemoveLiquidityResult.quoteAmountOut,
            this.pool.tokens.quoteToken.config.decimals
          ),
          amountUsd: this.formatUSD(
            this.formatTokenBalance(
              previewRemoveLiquidityResult.quoteAmountOut,
              this.pool.tokens.quoteToken.config.decimals
            ) * this.pool.tokens.quoteToken.price
          ),
        },
      ].filter((e) => e.name && e.amount);

      return tokensList.length ? tokensList : false;
    },

    disableEarnedButton() {
      return true;
    },
  },

  methods: {
    formatUSD,

    formatTokenBalance(value, decimals) {
      return formatTokenBalance(formatUnits(value, decimals));
    },

    prepBalanceData(tokenValue, priceValue) {
      const usd = formatUSD(tokenValue * priceValue);
      const earned = formatTokenBalance(tokenValue);
      return {
        earned,
        usd,
      };
    },

    async harvest() {
      if (this.disableEarnedButton) return;
      try {
        const config = await prepareWriteContract({
          ...this.selectedpool.contractInfo,
          functionName: this.selectedpool.isMultiReward
            ? "getRewards"
            : "withdraw",
          args: this.selectedpool.isMultiReward
            ? []
            : [this.selectedpool.poolId, 0],
        });

        const { hash } = await writeContract(config);

        await waitForTransaction({ hash });
      } catch (error) {
        console.log("harvest err:", error);
      }
    },

    closePopup() {
      this.$emit("closePopup");
    },
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    PointsEarned: defineAsyncComponent(() =>
      import("@/components/pools/pool/PointsEarned.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.pool-position-wrap {
  position: absolute;
  top: 92px;
  right: -300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 3;
}

.pool-position {
  display: flex;
  flex-direction: column;
  width: 300px;
  padding: 16px;
  gap: 24px;
  border-radius: 20px;
  border: 1px solid rgba(45, 74, 150, 0);
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.12) 0%,
    rgba(116, 92, 210, 0.12) 100%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
}

.subtitle {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.45px;
}

.deposited,
.reward {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deposited-token .token-name {
  font-size: 20px;
}

.deposited-token .token-amount .value {
  font-size: 16px;
}

.token-list {
  display: flex;
  flex-direction: column;
  list-style: none;
}

.list-item,
.deposited-token {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.token-name {
  display: flex;
  align-items: center;
  max-width: 60%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.token-amount {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: end;
}

.value {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
}

.usd {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
}

.close {
  align-self: flex-end;
  display: none;
  transition: opacity 0.3s ease-in-out;
  cursor: pointer;
}

.close:hover {
  opacity: 0.5;
}

@media (max-width: 1300px) {
  .backdrop {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: none;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: end;
    background: rgba(25, 25, 25, 0.1);
    backdrop-filter: blur(10px);
    z-index: 2;
  }

  .pool-position-wrap {
    position: fixed;
    top: initial;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
    width: 100%;
    padding: 16px 20px;
    gap: 16px;
    border-radius: 20px 20px 0 0;
    border: 1px solid #342866;
    background: #101622;
    box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
    backdrop-filter: blur(20px);
  }

  .pool-position {
    min-width: 375px;
    padding: 0;
    background: transparent;
    box-shadow: none;
  }

  .close {
    align-self: flex-end;
    display: block;
  }

  .isOpened {
    display: flex !important;
  }
}

@media screen and (max-width: 500px) {
  .pool-position {
    min-width: 100%;
  }
}
</style>
