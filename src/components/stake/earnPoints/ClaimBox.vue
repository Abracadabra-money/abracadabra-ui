<template>
  <div class="claim-wrap">
    <!-- <div>
      <h3 class="launch-title">Locked Tokens</h3>
      <h4 class="launch-subtitle">
        {{ parseLockedBalancesInfo }}
      </h4>
    </div> -->
    <!-- <div
      class="launch-link"
      @click="claimHandler"
      :class="{ disabled: !isUserHasLockedTokens }"
    >
      Claim
    </div> -->

    <BaseButton primary :disabled="!isUserHasLockedTokens" @click="claimHandler"
      >Claim
    </BaseButton>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";
import { claim } from "@/helpers/blast/stake/actions/claim";
import { formatTokenBalance, formatUSD } from "@/helpers/filters";
import { formatUnits } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { defineAsyncComponent } from "vue";

export default {
  props: {
    stakeInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      claimable: 0n,
    };
  },
  watch: {
    async account() {
      this.checkClaimableAmount().then((claimable) => {
        this.claimable = claimable;
      });
    },
  },
  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUserHasLockedTokens() {
      return (
        this.stakeInfo.tokensInfo.some(
          (token) => token.userInfo.balances.locked > 0n
        ) || this.claimable > 0n
      );
    },
    parseLockedBalancesInfo() {
      const claimableInfo = `You have ${this.parsedClaimable} claimable lp.`;
      const lockedInfo = `You have locked ${this.tokensInfo[0].amount} ${this.tokensInfo[0].name} and ${this.tokensInfo[1].amount} ${this.tokensInfo[1].name}`;

      return this.claimable === 0n
        ? `${claimableInfo} ${lockedInfo}`
        : lockedInfo;
    },
    parsedClaimable() {
      return this.formatTokenBalance(this.claimable);
    },
    tokensInfo() {
      return this.stakeInfo.tokensInfo.map((token) => {
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
  },
  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatTokenBalance(value, decimals = 18) {
      return formatTokenBalance(formatUnits(value, decimals));
    },

    formatAmount(value) {
      return formatTokenBalance(value);
    },

    async claimHandler() {
      const notificationId = await this.createNotification(
        notification.pending
      );
      try {
        const lock = false;

        const { contract } = this.stakeInfo.config;

        await claim(contract, lock);

        this.deleteNotification(notificationId);

        await this.createNotification(notification.success);
      } catch (error) {
        const errorNotification = {
          msg: notificationErrorMsg(error),
          type: "error",
        };

        this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
      }
    },

    async checkClaimableAmount() {
      const { contract } = this.stakeInfo.config;

      console.log(contract);

      const publicClient = getPublicClient(Number(this.chainId));

      const [claimable] = await publicClient.multicall({
        contracts: [
          {
            address: contract.address,
            abi: contract.abi,
            functionName: "claimable",
            args: [this.account],
          },
        ],
      });

      console.log(claimable);

      return claimable.result;
    },
  },
  created() {
    this.checkClaimableAmount().then((claimable) => {
      this.claimable = claimable;
    });
  },
  components: {
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.claim-wrap {
  width: 100%;
  // padding: 24px 16px;
  // border-radius: 16px;
  // border: 1px solid #00296b;
  // background: linear-gradient(
  //   146deg,
  //   rgba(0, 10, 35, 0.07) 0%,
  //   rgba(0, 80, 156, 0.07) 101.49%
  // );
  // box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  // backdrop-filter: blur(12.5px);
  // gap: 12px;
  // display: flex;
  // flex-direction: column;

  .launch-title {
    font-size: 18px;
    font-weight: 500;
    line-height: normal;
  }

  .launch-subtitle {
    font-size: 14px;
    font-weight: 400;
    line-height: normal;
  }

  .launch-link {
    width: 100%;
    height: 39px;
    border-radius: 10px;
    background: rgba(252, 253, 2, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-size: 14px;
    font-weight: 600;
    line-height: normal;
    transition: all 0.3s ease;
    cursor: pointer;

    &.disabled {
      background: rgba(252, 252, 3, 0.2);
      pointer-events: none;
    }

    &:hover {
      background: rgba(252, 253, 2, 0.8);
    }
  }
}
</style>
