<template>
  <div class="potion-points-view">
    <div class="potion-points">
      <div class="user-info">
        <div>
          <h3 class="title">Potion Points</h3>
          <h4 class="sub-title">
            Track your Blast, Potion and Gold points earned by taking part in
            the Abracadabra Ecosystem.
          </h4>
        </div>

        <div class="user-balances">
          <img
            class="potion-icon"
            src="@/assets/images/potion-points/potion.svg"
            alt=""
          />
          <div class="user-balance">
            <div class="balance-row">
              <div class="balance-title">Your balance</div>
              <div class="balance-value">
                {{ formatTokenBalance(userInfo.amount) }}
              </div>
            </div>
            <div class="balance-row">
              <div class="balance-title">Your Share</div>
              <div class="balance-value">{{ formatPercent(share) }}</div>
            </div>
          </div>
        </div>

        <div class="claim-info">
          <div class="tokens-claim">
            <div class="token-claim">
              <div class="token-claim-title">USDT to claim</div>
              <div class="token-claim-value">
                <BaseTokenIcon :icon="usdtIcon" name="USDT" size="32px" />
                {{ formatTokenBalance(usdtToClaim) }}
              </div>
            </div>

            <div class="token-claim">
              <div class="token-claim-title">Spell to claim</div>
              <div class="token-claim-value">
                <BaseTokenIcon :icon="spellIcon" name="Spell" size="32px" />
                {{ formatTokenBalance(spellToClaim) }}
              </div>
            </div>
          </div>

          <BaseButton
            primary
            :disabled="isActionProcessing || isButtonDisabled"
            @click="actionHandler"
            >{{ buttonText }}</BaseButton
          >
        </div>
      </div>

      <div class="total-info">
        <div class="total-potions">
          <img
            class="potion-icon-left"
            src="@/assets/images/potion-points/left.png"
            alt=""
          />
          <img
            class="potion-icon-right"
            src="@/assets/images/potion-points/right.png"
            alt=""
          />
          <div class="gradient"></div>

          <div class="content">
            <h5 class="total-title">Total Potions Distributed</h5>
            <p class="total-value">
              <img
                class="total-potion-icon"
                src="@/assets/images/potion-points/potion.svg"
                alt=""
              />10,000,000
            </p>
          </div>
        </div>

        <AccordionList />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  writeContractHelper,
  simulateContractHelper,
  waitForTransactionReceiptHelper,
} from "@/helpers/walletClienHelper";
import { formatUnits } from "viem";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
// @ts-ignore
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import potionPointRedeemerAbi from "@/abis/potionPointRedeemerAbi";
import potionPointsProofs from "@/configs/potionPointsProofs.json";
import { formatTokenBalance, formatPercent } from "@/helpers/filters";
import { notificationErrorMsg } from "@/helpers/notification/notificationError.js";

interface PotionPointItem {
  account: string;
  amount: string;
  proof: string[];
}

export default {
  data() {
    return {
      usdtIcon: useImage("assets/images/tokens/USDT.png"),
      spellIcon: useImage("assets/images/tokens/SPELL.png"),
      totalPoints: 10000000,
      totalSpell: 169000000,
      totalUsd: 111000,
      potionPointRedeemerAddress: "0x2258590ACDbea77dcc9C974CEB0B22b9329E6BBc",
      isActionProcessing: false,
      fetching: false,
      claimInfo: {
        initialized: false,
        amount: 0n,
      },
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    userInfo() {
      if (!this.account || this.fetching)
        return { proof: [], claimAmount: 0n, amount: 0 };

      const userInfo = potionPointsProofs.items.find(
        (item: PotionPointItem) =>
          item.account.toLocaleLowerCase() === this.account.toLocaleLowerCase()
      );

      const claimAmount = this.claimInfo.initialized
        ? this.claimInfo.amount
        : userInfo?.amount || "0";

      return {
        proof: userInfo?.proof || [],
        claimAmount: BigInt(claimAmount),
        amount: Number(formatUnits(BigInt(claimAmount), 18)),
      };
    },

    share() {
      return (this.userInfo.amount / this.totalPoints) * 100;
    },

    spellToClaim() {
      return (this.userInfo.amount * this.totalSpell) / this.totalPoints;
    },

    usdtToClaim() {
      return (this.userInfo.amount * this.totalUsd) / this.totalPoints;
    },

    isProperNetwork() {
      return this.chainId === ARBITRUM_CHAIN_ID;
    },

    buttonText() {
      if (!this.isProperNetwork) return "Switch network";
      if (!this.account) return "Connect Wallet";
      if (this.isButtonDisabled) return "Nothing to claim";
      if (this.isActionProcessing) return "Processing...";
      return "Claim";
    },

    isButtonDisabled() {
      return !this.userInfo.amount;
    },
  },

  methods: {
    formatPercent,
    formatTokenBalance,
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    async fetchAmountAllowed() {
      this.fetching = true;
      const publicClient = getPublicClient(ARBITRUM_CHAIN_ID);

      const response = await publicClient.readContract({
        address: this.potionPointRedeemerAddress,
        abi: potionPointRedeemerAbi,
        functionName: "amountAllowed",
        args: [this.account],
      });

      this.claimInfo.initialized = response[0];
      this.claimInfo.amount = response[1];

      this.fetching = false;
    },

    async actionHandler() {
      // if (this.isButtonDisabled) return false;
      if (!this.isProperNetwork) return switchNetwork(ARBITRUM_CHAIN_ID);
      if (!this.account) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      await this.redeemWithProofs();
    },

    async redeemWithProofs() {
      this.isActionProcessing = true;

      const notificationId = await this.createNotification(
        notification.pending
      );

      console.log(
        "payload",
        this.account,
        this.userInfo.claimAmount,
        this.userInfo.proof
      );

      try {
        const { request } = await simulateContractHelper({
          address: this.potionPointRedeemerAddress,
          abi: potionPointRedeemerAbi,
          functionName: "redeemWithProofs",
          args: [
            [this.account, this.userInfo.claimAmount, this.userInfo.proof],
          ],
        });

        const hash = await writeContractHelper(request);

        await waitForTransactionReceiptHelper({
          hash,
        });

        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);

        this.isActionProcessing = false;
      } catch (error) {
        console.log("RedeemWithProofs err:", error);

        const errorNotification = {
          msg: await notificationErrorMsg(error),
          type: "error",
        };

        await this.deleteNotification(notificationId);
        await this.createNotification(errorNotification);
        this.isActionProcessing = false;
      }
    },
  },

  created() {
    this.fetchAmountAllowed();
  },

  components: {
    BaseTokenIcon: defineAsyncComponent(
      () => import("@/components/base/BaseTokenIcon.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    AccordionList: defineAsyncComponent(
      () => import("@/components/ui/AccordionList.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.potion-points-view {
  display: flex;
  justify-content: center;
  padding: 100px 15px;
  min-height: 100vh;
  width: 100%;
  height: 100%;
}

.potion-points {
  max-width: 1280px;
  width: 100%;
  gap: 24px;
  display: flex;
  justify-content: space-between;
}

.user-info {
  gap: 24px;
  display: flex;
  flex-direction: column;
  max-width: 628px;
  width: 100%;
}

.title {
  font-size: 32px;
  font-weight: 600;
  line-height: normal;
}

.sub-title {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  max-width: 490px;
}

.user-balances {
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #304d99;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  backdrop-filter: blur(12.5px);
  gap: 20px;
  display: flex;
  align-items: center;
  width: 100%;
}

.potion-icon {
  width: 71px;
  height: 71px;
}

.user-balance {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.balance-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.balance-title {
  color: #99a0b2;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
}

.balance-value {
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
}

.claim-info {
  padding: 27px 56px 19px;
  border-radius: 16px;
  border: 1px solid #304d99;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.06);
  backdrop-filter: blur(12.5px);
}

.tokens-claim {
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.token-claim-title {
  color: #99a0b2;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 3px;
}

.token-claim-value {
  display: flex;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.total-info {
  width: 100%;
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.total-potions {
  border-radius: 12px;
  width: 100%;
  height: 96px;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.32) 0%,
    rgba(116, 92, 210, 0.32) 100%
  );
  position: relative;
  overflow: hidden;
}

.potion-icon-left,
.potion-icon-right {
  width: 100%;
  height: 96px;
  border-radius: 12px;
  position: absolute;
  object-fit: cover;
  z-index: 1;
}

.gradient {
  position: absolute;
  width: 100%;
  height: 96px;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.32) 0%,
    rgba(116, 92, 210, 0.32) 100%
  );
  z-index: 2;
}

.content {
  position: relative;
  height: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.total-title {
  font-weight: 500;
  line-height: normal;
}

.total-value {
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 32px;
  font-weight: 500;
  line-height: normal;
}

.total-potion-icon {
  width: 32px;
  height: 32px;
}

@media screen and (max-width: 1024px) {
  .potion-points {
    flex-direction: column;
  }

  .user-info {
    max-width: 100%;
  }
}

@media screen and (max-width: 600px) {
  .user-info {
    gap: 16px;
  }

  .title {
    font-size: 24px;
  }

  .sub-title {
    font-size: 14px;
  }

  .user-balances {
    padding: 16px;
    gap: 12px;
  }

  .potion-icon {
    width: 52px;
    height: 52px;
  }

  .balance-title {
    font-size: 14px;
  }

  .balance-value {
    font-size: 18px;
  }

  .claim-info {
    padding: 16px;
  }

  .tokens-claim {
    flex-direction: column;
    gap: 12px;
    margin-bottom: 12px;
  }

  .token-claim-title {
    font-size: 16px;
  }

  .token-claim-value {
    font-size: 20px;
  }

  .potion-icon-left {
    width: initial;
    left: 0;
  }

  .potion-icon-right {
    width: initial;
    right: 0;
  }

  .total-title {
    font-size: 14px;
  }

  .total-value {
    font-size: 28px;
  }
}
</style>
