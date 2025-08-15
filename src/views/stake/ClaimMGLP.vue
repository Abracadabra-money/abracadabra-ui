<template>
  <div class="claim-view">
    <div class="claim-wrap" v-if="claimInfo">
      <div class="actions-block">
        <div>
          <h3 class="title">Claim MagicGLP compensation</h3>
          <h4 class="subtitle">
            Use your favourite assets as collateral to borrow
          </h4>
        </div>

        <div class="action-form">
          <h4 class="form-title">MagicGLP to withdraw</h4>

          <div class="stake-info-wrap">
            <h5 class="stake-info-title">MagicGLP to burn</h5>

            <div class="row">
              <div class="token-info">
                <img
                  class="token-icon"
                  src="@/assets/images/tokens/mGlpToken.png"
                  alt="MGLP token icon"
                />
                <span class="stake-token-name">mGLP</span>
              </div>

              <div class="token-amounts">
                <span class="token-amount">{{
                  claimInfo.mainToken.parsedBalance
                }}</span>
                <span class="token-amount-usd">{{
                  claimInfo.mainToken.balanceUsd
                }}</span>
              </div>
            </div>
          </div>

          <div class="claim-info-wrap">
            <h5 class="claim-info-title">To be received</h5>

            <template v-if="claimInfo?.rewards.length > 0">
              <div
                class="row"
                v-for="(token, index) in claimInfo.rewards || []"
                :key="index"
              >
                <div class="token-info">
                  <img
                    class="token-icon"
                    src="@/assets/images/tokens/GM_ETH.png"
                    alt="MGLP token icon"
                  />

                  <div class="col">
                    <div class="claim-token-name">{{ token.name }}</div>
                    <div class="claim-percent">21.03%</div>
                  </div>
                </div>

                <div class="token-amounts">
                  <span class="token-amount">{{ token.claimAmount }}</span>
                  <span class="token-amount-usd">{{
                    token.claimAmountUsd
                  }}</span>
                </div>
              </div>
            </template>
          </div>

          <BaseButton
            primary
            :disabled="isActionDisabled"
            @click="actionHandler"
            >{{ actionButtonText }}</BaseButton
          >
        </div>
      </div>
    </div>

    <div class="loader-wrap" v-else>
      <BaseLoader large text="Loading stake" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from "vue";
import { ARBITRUM_CHAIN_ID } from "@/constants/global";
import { dataRefresher } from "@/helpers/dataRefresher";
import { openConnectPopup } from "@/helpers/connect/utils";
import { mapGetters, mapActions, mapMutations } from "vuex";
import type { RefresherInfo } from "@/helpers/dataRefresher";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import { claim } from "@/helpers/stake/magicGlp/actions/claim";
import { getClaimInfo } from "@/helpers/stake/magicGlp/getClaimInfo";
import type { ClaimInfo } from "@/helpers/stake/magicGlp/getClaimInfo";

export default {
  data() {
    return {
      selectedNetwork: 42161,
      refresherInfo: {
        refresher: null as unknown as dataRefresher<any>,
        remainingTime: 0,
        isLoading: false,
        intervalTime: 60,
      } as RefresherInfo<any>,
      claimInfo: null as null | ClaimInfo,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
    }),

    isUnsupportedChain() {
      return this.chainId === ARBITRUM_CHAIN_ID;
    },

    isClaimAvailable() {
      return this.claimInfo!.mainToken.balance > 0n;
    },

    isActionDisabled() {
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      if (!this.isClaimAvailable) return true;
      return false;
    },

    actionButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      if (!this.isClaimAvailable) return "Nothing to claim";
      return "Commit";
    },
  },

  watch: {
    async account() {
      await this.createOrUpdateInfo();
    },

    async chainId() {
      await this.createOrUpdateInfo();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    async actionHandler() {
      if (this.isActionDisabled) return false;

      if (!this.account && this.isUnsupportedChain) return openConnectPopup();

      if (!this.isUnsupportedChain) {
        switchNetwork(this.selectedNetwork);
        return false;
      }

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error } = (await claim(
        {
          address: this.claimInfo!.mainToken.address,
          abi: this.claimInfo!.mainToken.abi,
        },
        this.claimInfo!.mainToken.balance
      )) as { error?: string };

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        await this.createOrUpdateInfo();
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },

    async createOrUpdateInfo() {
      const refresher = this.refresherInfo?.refresher;
      try {
        if (!refresher) {
          this.createDataRefresher();
          await this.refresherInfo.refresher.start();
        } else {
          await refresher.manualUpdate();
        }
      } catch (error) {
        console.error("Error creating or updating MagicGLP stake info:", error);
      }
    },

    async createClaimInfo() {
      return await getClaimInfo(ARBITRUM_CHAIN_ID, this.account);
    },

    createDataRefresher() {
      this.refresherInfo.refresher = new dataRefresher(
        this.createClaimInfo,
        this.refresherInfo.intervalTime,
        (time) => (this.refresherInfo.remainingTime = time),
        (loading) => (this.refresherInfo.isLoading = loading),
        (updatedData: null | ClaimInfo) => (this.claimInfo = updatedData)
      );
    },
  },

  async created() {
    await this.createOrUpdateInfo();
  },

  beforeUnmount() {
    this.refresherInfo.refresher.stop();
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.claim-view {
  min-height: 100vh;
}

.claim-wrap {
  max-width: 550px;
  width: 100%;
  padding: 124px 15px 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.actions-block {
  gap: 20px;
  display: flex;
  flex-direction: column;
}

.title {
  font-weight: 600;
  font-size: 32px;
  line-height: 100%;
  color: #fff;
  margin-bottom: 4px;
  line-height: 150%;
}

.subtitle {
  color: #ffffff99;
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
}

.action-form {
  @include block-wrap;
  gap: 16px;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.form-title {
  font-weight: 500;
  font-size: 18px;
  line-height: 100%;
}

.stake-info-wrap {
  border: 1px solid #2d4a96;
  border-radius: 12px;
  padding: 16px;
  gap: 12px;
  display: flex;
  flex-direction: column;
  background-image: url("@/assets/images/glp/claim-bg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.stake-info-title {
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
}

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.token-info {
  gap: 4px;
  display: flex;
  align-items: center;
}

.token-icon {
  width: 44px;
  height: 44px;
}

.stake-token-name {
  font-family: Poppins;
  font-weight: 500;
  font-size: 20px;
  line-height: 100%;
}

.token-amounts {
  gap: 4px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.token-amount {
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
}

.token-amount-usd {
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  color: #878b93;
}

.claim-info-wrap {
  gap: 16px;
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border-radius: 10px;
  background: linear-gradient(
    145.67deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  border: 1px solid #b4b4b414;
  box-shadow: 0px 4px 33px 0px #0000000f;
}

.claim-info-title {
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
}

.col {
  gap: 2px;
  display: flex;
  flex-direction: column;
}

.claim-token-name {
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
}

.claim-percent {
  padding: 2px 4px;
  border: 1px solid #2d4a96;
  border-radius: 16px;
  background: #7088cc66;
  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  width: fit-content;
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

@media screen and (max-width: 600px) {
  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }

  .action-form {
    padding: 16px;
  }

  .form-title {
    font-size: 16px;
  }

  .stake-info-wrap {
    padding: 12px;
  }

  .stake-info-title {
    font-size: 14px;
  }

  .stake-token-name {
    font-size: 18px;
  }

  .token-amount {
    font-size: 14px;
  }

  .token-amount-usd {
    font-size: 14px;
  }

  .claim-token-name {
    font-size: 14px;
  }
}
</style>
