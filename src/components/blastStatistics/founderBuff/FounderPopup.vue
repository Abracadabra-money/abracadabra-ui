<template>
  <div class="backdrop" @click.self="closePopup">
    <div class="founder-popup" v-if="lpInfo">
      <div class="header">
        <h3 class="title">Become a Founder</h3>
        <img
          class="close-img"
          src="@/assets/images/cross.svg"
          alt="Close popup"
          @click="closePopup"
        />
      </div>

      <p class="description">
        Lock your Liquduituy for 3 month to becone a MIM Swap founder and get
        permanent buff
      </p>

      <div class="pool-info-wrap" v-if="stakeInfo && stakeLpInfo">
        <div class="promo-label">Founders will recieve 30% of Points</div>

        <div class="pool-info">
          <TokenChainIcon
            class="pool-icon"
            :icon="lpInfo.icon"
            name="MIM/USDB"
            :chainId="81457"
          />
          <div class="pool-text">
            <p class="pool-name">{{ lpInfo.name }} Pool</p>
            <p class="values-description">Extend Liquidity Lock</p>
          </div>
        </div>

        <div class="total-by-token">
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

      <Notification
        :notification="notification"
        constant
        v-if="!isBecomeFounder"
      />

      <FounderCheckBox :value="isBecomeFounder" @update="toggleBecomeFounder" />

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
import { formatTokenBalance } from "@/helpers/filters";
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
      isBecomeFounder: false,
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

    lpPartsExpected() {
      const lpPartsOut = previewRemoveLiquidity(
        this.lpInfo.userInfo.balance,
        this.lpInfo
      );

      return [
        {
          name: this.stakeInfo.tokensInfo[0].config.name,
          icon: this.stakeInfo.tokensInfo[0].config.icon,
          amount: this.formatTokenBalance(
            lpPartsOut.baseAmountOut,
            this.stakeInfo.tokensInfo[0].config.decimals
          ),
        },

        {
          name: this.stakeInfo.tokensInfo[1].config.name,
          icon: this.stakeInfo.tokensInfo[1].config.icon,
          amount: this.formatTokenBalance(
            lpPartsOut.quoteAmountOut,
            this.stakeInfo.tokensInfo[1].config.decimals
          ),
        },
      ];
    },

    buttonText() {
      if (!this.isAllowed) return "Approve";
      return "Confirm";
    },

    isAllowed() {
      return this.stakeLpInfo?.allowance > 0;
    },

    notification() {
      return {
        title: "Title",
        msg: "Thanks for taking part in the innovation",
        type: "error",
      };
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
        console.log("stake lp err:", error);

        const errorNotification = {
          msg: error.msg,
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      } else {
        await this.createNotification(notification.success);
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
      import("@/components/blastStatistics/founderBuff/FounderCheckBox.vue")
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
  align-items: start;
  gap: 24px;
  padding: 32px;
  max-width: 533px;
  width: 100%;
  min-height: 503px;
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

.pool-info {
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
</style>
