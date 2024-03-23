<template>
  <div class="backdrop" @click.self="closePopup">
    <div class="founder-popup" v-if="lpInfo">
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

      <div class="pool-info-wrap">
        <div class="promo-label">{{ texts.blastTitle }}</div>

        <div class="lp-info-wrap">
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
        </div>

        <div class="decorative-line"></div>
      </div>

      <div class="btns-wrap">
        <BaseButton primary @click="actionHandler">
          {{ buttonText }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script>
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { mapActions, mapMutations, mapGetters } from "vuex";
import notification from "@/helpers/notification/notification";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { withdrawStake } from "@/helpers/blast/stake/actions/withdrawStake";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

import BlastLockingMultiRewardsAbi from "@/abis/BlastLockingMultiRewards";
import { BlastLockingMultiRewards } from "@/constants/blast";

export default {
  emits: ["close", "updateInfo"],
  props: {
    balances: {
      type: Object,
    },
    poolInfo: {
      type: Object,
    },
  },

  data() {
    return {
      isActionProcessing: false,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    lpInfo() {
      return this.poolInfo;
    },

    lpToken() {
      return {
        name: this.lpInfo.name,
        icon: this.lpInfo.icon,
        amount: this.formatTokenBalance(
          this.balances.unlocked,
          this.lpInfo.decimals
        ),
        amountUsd: formatUSD(
          this.formatTokenBalance(
            this.balances.unlocked,
            this.lpInfo.decimals
          ) * this.lpInfo.price
        ),
      };
    },

    texts() {
      return {
        title: "Unstake MLP",
        blastTitle: "You will receive in your wallet",
        description: "You are unstaking MLP",
        checkbox: "Lock you tokens for 3 month and get Buff",
      };
    },

    buttonText() {
      return "Unstake";
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

    async withdrawHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      const contract = {
        address: BlastLockingMultiRewards,
        abi: BlastLockingMultiRewardsAbi,
      };

      // !NOTICE: for now amount is all unlocked balance
      const amount = this.balances.unlocked;

      const { error } = await withdrawStake(contract, amount);

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
        this.$emit("updateInfo");
        this.closePopup();
        // this.$router.push({ name: "PointsDashboard" });
      }
    },

    async actionHandler() {
      this.isActionProcessing = true;

      await this.withdrawHandler(false);

      this.isActionProcessing = false;
    },

    closePopup() {
      this.$emit("close");
    },
  },

  components: {
    TokenChainIcon: defineAsyncComponent(() =>
      import("@/components/ui/icons/TokenChainIcon.vue")
    ),
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
  height: auto;
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
