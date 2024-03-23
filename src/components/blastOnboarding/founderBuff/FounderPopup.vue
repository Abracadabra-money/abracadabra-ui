<template>
  <div class="backdrop" @click.self="closePopup">
    <div class="founder-popup" v-if="lpInfo">
      <div class="title-description-wrap">
        <div class="header">
          <h3 class="title">{{ texts.title }}</h3>
          <img
            class="close-img"
            src="@/assets/images/cross.svg"
            alt="Close popup"
            @click="closePopup"
          />
        </div>

        <p class="description">
          {{ texts.description }}
        </p>
      </div>

      <div class="pool-info-wrap" v-if="stakeInfo">
        <div class="promo-label">{{ texts.blastTitle }}</div>

        <!-- <div class="pool-info-value" v-if="isBecomeFounder">
          <div class="pool-info">
            <TokenChainIcon
              class="pool-icon"
              :icon="lpToken.icon"
              :name="lpToken.name"
              :chainId="81457"
              size="44px"
            />
            <div class="pool-text">
              <p class="pool-name">{{ lpInfo.name }} Pool</p>
              <p class="values-description">Extend Liquidity Lock</p>
            </div>
          </div>
        </div> -->

        <!-- <div class="lp-info-wrap">
          <div class="lp-info">
            <BaseTokenIcon
              :name="lpToken.name"
              :icon="lpToken.icon"
              size="32px"
            />
            MLP
          </div>

          <div class="token-amount">
            <span class="value">{{ lpToken.amount }}</span>
            <span class="usd">{{ lpToken.amountUsd }}</span>
          </div>
        </div> -->

        <div class="total-by-token">
          <div class="token-part">
            <span>
              <BaseTokenIcon
                :name="lpToken.name"
                :icon="lpToken.icon"
                size="32px"
              />
              MLP</span
            >

            <span> {{ lpToken.mlpAmount }}</span>
          </div>
        </div>

        <div class="decorative-line"></div>
      </div>

      <p class="notification" v-if="!isBecomeFounder">
        The Founder’s boost can only be claimed during Phase 3. If you fail to
        lock in time, you will lose your chance to earn the Founder Boost
        forever.
      </p>

      <div class="btns-wrap">
        <FounderCheckBox :value="isBecomeFounder" @update="toggleBecomeFounder">
          {{ texts.checkbox }}
        </FounderCheckBox>

        <BaseButton
          :warning="!isBecomeFounder"
          :primary="isBecomeFounder"
          @click="actionHandler"
        >
          {{ buttonText }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { mapActions, mapMutations, mapGetters } from "vuex";
import mimUsdbIcon from "@/assets/images/tokens/MIM-USDB.png";
import notification from "@/helpers/notification/notification";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { claim } from "@/helpers/blast/stake/actions/claim";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { withdrawStake } from "@/helpers/blast/stake/actions/withdrawStake";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

export default {
  props: {
    stakeInfo: {
      type: Object,
    },
  },

  data() {
    return {
      mimUsdbIcon,
      isBecomeFounder: true,
      isActionProcessing: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    lpInfo() {
      return this.stakeInfo.lpInfo;
    },

    lpToken() {
      return {
        name: this.lpInfo.name,
        icon: this.lpInfo.icon,
        amount: this.formatTokenBalance(
          this.stakeInfo.lpBalance,
          this.lpInfo.decimals
        ),
        amountUsd: formatUSD(
          this.formatTokenBalance(
            this.stakeInfo.lpBalance,
            this.lpInfo.decimals
          ) * this.lpInfo.price
        ),
        mlpAmount: this.formatTokenBalance(
          this.stakeInfo.mlpAmount,
          this.lpInfo.decimals
        ),
      };
    },

    tokensInfo() {
      return this.stakeInfo.data.tokensInfo.map((token) => {
        return {
          name: token.config.name,
          icon: token.config.icon,
          amount: this.formatTokenBalance(
            token.userInfo.balances.locked,
            token.config.decimals
          ),
          amountUsd: formatUSD(
            this.formatTokenBalance(
              token.userInfo.balances.locked,
              token.config.decimals
            ) * token.config.price
          ),
        };
      });
    },

    lpPartsExpected() {
      const lpPartsOut = previewRemoveLiquidity(
        this.stakeInfo.lpBalance,
        this.lpInfo
      );

      return [
        {
          name: this.stakeInfo.tokensInfo[1].config.name,
          icon: this.stakeInfo.tokensInfo[1].config.icon,
          amount: this.formatTokenBalance(
            lpPartsOut.baseAmountOut,
            this.stakeInfo.tokensInfo[1].config.decimals
          ),
        },

        {
          name: this.stakeInfo.tokensInfo[0].config.name,
          icon: this.stakeInfo.tokensInfo[0].config.icon,
          amount: this.formatTokenBalance(
            lpPartsOut.quoteAmountOut,
            this.stakeInfo.tokensInfo[0].config.decimals
          ),
        },
      ];
    },

    texts() {
      return {
        title: this.isBecomeFounder
          ? "Become a Founder!"
          : "Migrate MLP and Stake",
        blastTitle: this.isBecomeFounder
          ? "Receiving 20% of total ecosystem points"
          : "You are about to stake into MLP",
        description: this.isBecomeFounder
          ? "Lock your MagicLP for 3 months to obtain the Founder Boost, a permanent reward boost exclusive to Phase 3."
          : "Staked MLP will earn rewards, they remain unlocked and withdrawable.",
        checkbox: "Lock MLP and obtain Founder’s Boost",
      };
    },

    buttonText() {
      return this.isBecomeFounder ? "Claim Founder’s Boost" : "Migrate & Stake";
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatTokenBalance(value) {
      return formatTokenBalance(formatUnits(value, 18));
    },

    formatAmount(value) {
      return formatTokenBalance(value);
    },

    toggleBecomeFounder() {
      this.isBecomeFounder = !this.isBecomeFounder;
    },

    async claimHandler(lock = false) {
      const notificationId = await this.createNotification(
        notification.pending
      );

      const { contract } = this.stakeInfo.data.config;

      console.log(contract);

      const { error } = await claim(contract, lock);

      this.deleteNotification(notificationId);

      if (error) {
        const errorNotification = {
          msg: notificationErrorMsg({ message: error.msg }),
          type: "error",
        };

        this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      } else {
        await this.createNotification(notification.success);
        this.$router.push({ name: "PointsDashboard" });
      }
    },

    async actionHandler() {
      this.isActionProcessing = true;

      if (this.isBecomeFounder) await this.claimHandler(true);
      else this.claimHandler(false);

      this.isActionProcessing = false;
    },

    closePopup() {
      this.$emit("close");
    },
  },

  components: {
    // TokenChainIcon: defineAsyncComponent(() =>
    //   import("@/components/ui/icons/TokenChainIcon.vue")
    // ),
    BaseTokenIcon: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenIcon.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    FounderCheckBox: defineAsyncComponent(() =>
      import("@/components/blastOnboarding/founderBuff/FounderCheckBox.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 300;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  background: rgba(25, 25, 25, 0.1);
  backdrop-filter: blur(10px);
}

.founder-popup {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  align-items: start;
  padding: 32px;
  max-width: 533px;
  width: 100%;
  height: 556px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #101622;
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: 24px;
  font-weight: 500;
}

.close-img {
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.close-img:hover {
  opacity: 0.5;
}

.description {
  margin-top: 24px;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
}

.pool-info-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.promo-label {
  display: flex;
  align-items: center;
  max-width: 425px;
  width: 100%;
  height: 45px;
  padding: 12px;
  border-radius: 16px 0 0 16px;
  background: #fcfd02;
  clip-path: polygon(0 1%, 100% 0%, 88% 100%, 0 100%);
  color: black;
  font-size: 18px;
  font-weight: 500;
}

.pool-info-value {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pool-info {
  display: flex;
  align-items: center;
}

.token-amount {
  display: flex;
  flex-direction: column;
  align-items: end;
}

.value {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: -8px;
}

.usd {
  color: #878b93;
  font-size: 14px;
  font-weight: 500;
}

.lp-info-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lp-info {
  display: flex;
  align-items: center;
}

.total-by-token {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.token-part {
  display: flex;
  align-items: center;
  flex-grow: 1;
  justify-content: space-between;

  span {
    display: flex;
    align-items: center;
  }
}

.decorative-line {
  min-width: 100%;
  height: 6px;
  border-radius: 16px 0 0 16px;
  background: #fcfd02;
  clip-path: polygon(0 1%, 100% 0%, 98% 100%, 0 100%);
}

.notification {
  width: 100%;
  padding: 16px;
  gap: 12px;
  border-radius: 16px;
  border: 1px solid #8c4040;
  background: linear-gradient(
      0deg,
      rgba(16, 22, 34, 0.4) 0%,
      rgba(16, 22, 34, 0.4) 100%
    ),
    rgba(140, 64, 64, 0.36);
  box-shadow: 0px 0px 16.9px 0px rgba(140, 64, 64, 0.47);
  backdrop-filter: blur(50px);

  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.btns-wrap {
  width: 100%;
  gap: 24px;
  display: flex;
  flex-direction: column;
}
</style>
