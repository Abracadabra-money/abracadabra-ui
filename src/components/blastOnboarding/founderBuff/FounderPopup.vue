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

      <div class="pool-info-wrap" v-if="stakeInfo && stakeLpInfo">
        <div class="promo-label">{{ texts.blastTitle }}</div>

        <div class="pool-info-value" v-if="isBecomeFounder">
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
        </div>

        <div class="lp-info-wrap" v-if="isBecomeFounder">
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

        <div class="total-by-token" v-else>
          <div
            class="token-part"
            :key="index"
            v-for="(token, index) in lpPartsExpected"
          >
            <BaseTokenIcon :name="token.name" :icon="token.icon" size="32px" />
            $
            {{ token.amount }}
          </div>
        </div>

        <div class="decorative-line"></div>
      </div>

      <p class="notification" v-if="!isBecomeFounder">
        Caution: Withdrawing your MLP tokens permanently forfeits the Founder's
        Boost. This action cannot be undone, and you will never be able to
        reclaim the Founder Boost
      </p>

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
</template>

<script>
import { defineAsyncComponent } from "vue";
import { mapGetters } from "vuex";
import { mapActions, mapMutations } from "vuex";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import notification from "@/helpers/notification/notification";
import { formatUnits } from "viem";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import mimUsdbIcon from "@/assets/images/tokens/MIM-USDB.png";
import { approveTokenViem } from "@/helpers/approval";
import { previewRemoveLiquidity } from "@/helpers/pools/swap/liquidity";
import { stake } from "@/helpers/blast/stake/actions/stakeLocked";
import BlastLockingMultiRewards from "@/abis/BlastLockingMultiRewards";

//
import { getPublicClient } from "@/helpers/getPublicClient";
import BlastMagicLPAbi from "@/abis/BlastMagicLpAbi";

const getLpBalanceAndAllowance = async (account, chainId) => {
  if (!account) {
    return {
      allowance: 0n,
      balance: 0n,
    };
  }

  const publicClient = getPublicClient(chainId);

  const [allowance, balance] = await publicClient.multicall({
    contracts: [
      {
        address: "0xB2Eb529F4A461aaCa1a8A5E1E2E454c742cB7061",
        abi: BlastMagicLPAbi,
        functionName: "allowance",
        args: [account, "0x4f53357F3Af4B7a73B6C720b9d76626B36eE5300"],
      },
      {
        address: "0xB2Eb529F4A461aaCa1a8A5E1E2E454c742cB7061",
        abi: BlastMagicLPAbi,
        functionName: "balanceOf",
        args: [account],
      },
    ],
  });

  return {
    allowance: allowance.result,
    balance: balance.result,
  };
};

export default {
  props: {
    stakeInfo: {
      type: Object,
    },
  },

  data() {
    return {
      stakeLpInfo: null,
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
          this.lpInfo.userInfo.balance,
          this.lpInfo.decimals
        ),
        amountUsd: formatUSD(
          this.formatTokenBalance(
            this.lpInfo.userInfo.balance,
            this.lpInfo.decimals
          ) * this.lpInfo.price
        ),
      };
    },

    lpPartsExpected() {
      const lpPartsOut = previewRemoveLiquidity(
        this.lpInfo.userInfo.balance,
        this.lpInfo
      );
      console.log("this.stakeInfo", this.stakeInfo);
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
          : "Withdraw your funds",
        blastTitle: this.isBecomeFounder
          ? "Receiving 20% of total ecosystem points"
          : "You will receive",
        description: this.isBecomeFounder
          ? "Lock you Magic LP for 3 months to obtain the Founder Boost, a permanent reward boost exclusive to LLE participants!"
          : "Withdraw your MagicLPs and receive back your share of the MIM/USDB pool.",
        checkbox: this.isBecomeFounder
          ? "Lock MLPs for 3 months and achieve Founder’s Boost"
          : "Lock MLP for 3 month and get Buff",
      };
    },

    buttonText() {
      if (!this.isAllowed) return "Approve MLP tokens spending";
      return this.isBecomeFounder
        ? "Claim Founder’s Boost"
        : "Give Up Founder’s Boost";
    },

    isAllowed() {
      return this.stakeLpInfo?.allowance > 0;
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

    async approveHandler() {
      const notificationId = await this.createNotification(
        notification.approvePending
      );

      try {
        await approveTokenViem(
          {
            address: "0xB2Eb529F4A461aaCa1a8A5E1E2E454c742cB7061",
            abi: BlastMagicLPAbi,
          },
          "0x4f53357F3Af4B7a73B6C720b9d76626B36eE5300"
        );

        await this.createStakeLpInfo();

        await this.deleteNotification(notificationId);
      } catch (error) {
        console.log("approve err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
    },

    async stakeHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );

      const contract = {
        address: "0x4f53357F3Af4B7a73B6C720b9d76626B36eE5300",
        abi: BlastLockingMultiRewards,
      };

      const { error, result } = await stake(
        contract,
        "0xB2Eb529F4A461aaCa1a8A5E1E2E454c742cB7061",
        this.stakeLpInfo.balance,
        this.isBecomeFounder
      );
      await this.deleteNotification(notificationId);

      if (error) {
        const errorNotification = {
          msg: error.msg,
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      } else {
        await this.createNotification(notification.success);
        this.$router.push({ name: "MyPoints" });
      }
    },

    async actionHandler() {
      this.isActionProcessing = true;
      if (!this.isAllowed) return await this.approveHandler();

      await this.stakeHandler();

      this.isActionProcessing = false;
    },

    closePopup() {
      this.$emit("close");
    },

    async createStakeLpInfo() {
      this.stakeLpInfo = await getLpBalanceAndAllowance(
        this.account,
        this.chainId
      );
    },
  },

  async created() {
    await this.createStakeLpInfo();
    this.updateInterval = setInterval(async () => {
      await this.createStakeLpInfo();
    }, 60000);
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
    Notification: defineAsyncComponent(() =>
      import("@/components/notifications/Notification.vue")
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
</style>