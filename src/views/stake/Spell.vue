<template>
  <div class="stake-view">
    <div class="stake-wrap" v-if="stakeInfo">
      <div class="actions-block">
        <div class="actions-head">
          <h3 class="head-title-wrap">
            <span class="head-title">{{ activeTab }}</span>
            <button
              class="mobile-btn"
              v-if="isMobile"
              @click="isAdditionalInfo = !isAdditionalInfo"
            >
              <StatisticIcon />
            </button>
          </h3>
          <Tabs
            :name="activeToken"
            :items="tabTokens"
            :icons="tabTokenIcons"
            width="280px"
            small
            @select="changeToken"
          />
        </div>

        <AvailableNetworksBlock
          :selectedNetwork="selectedNetwork"
          :availableNetworks="availableNetworks"
          @changeNetwork="changeNetwork"
        />

        <div class="action-form" v-if="isMobileView">
          <Tabs :name="activeTab" :items="tabItems" @select="changeTab" />

          <div class="input-wrap">
            <h4 class="title">Select amount</h4>

            <BaseTokenInput
              :value="inputValue"
              :icon="fromToken.icon"
              :name="fromToken.name"
              :max="fromToken.balance"
              :tokenPrice="formatUnits(fromToken.price, fromToken.decimals)"
              :disabled="isUserLocked"
              @updateInputValue="updateMainValue"
            />
          </div>

          <div class="input-wrap">
            <h4 class="title">Receive</h4>

            <BaseTokenInput
              :disabled="true"
              :icon="toToken.icon"
              :name="toToken.name"
              :value="expectedAmount"
              :tokenPrice="formatUnits(toToken.price, toToken.decimals)"
            />
          </div>

          <ClaimMimBlock
            class="claim-wrap"
            v-if="isMSpellActive && isMobile"
            :isUnsupportedChain="isUnsupportedChain"
            :isDisableClaimButton="isDisableClaimButton"
            :claimAmount="formatAmount(mainToken.claimableAmount)"
            @claimMim="claimMimHandler"
          />

          <div class="info-wrap">
            <div class="info-row" v-if="!isMobile">
              <span class="info-title">Total Supply</span>
              <span class="info-value">
                <img class="info-icon" :src="mainToken.icon" alt="" />
                <span>{{ totalSupply }}</span>
              </span>
            </div>

            <div class="info-row" v-else>
              <span class="info-title">APR</span>
              <span class="info-value">
                <span>{{ mainToken.apr }}%</span>
              </span>
            </div>

            <div class="line"></div>

            <div class="balance-wrap">
              <div
                class="info-row"
                v-for="info in balanceInfo"
                :key="info.label"
              >
                <span class="info-title">
                  <img class="info-icon" :src="info.icon" alt="" />
                  <span> {{ info.label }}</span>
                </span>

                <span class="info-value">
                  <span> {{ info.balance }}</span>
                  <span>({{ info.balanceUsd }})</span>
                </span>
              </div>
            </div>
          </div>

          <div class="btn-wrap">
            <BaseButton
              primary
              :disabled="isActionDisabled"
              @click="actionHandler"
            >
              <LockedTimer
                v-if="isUserLocked"
                :finalTime="mainToken.lockTimestamp"
              />
              <span v-else> {{ actionButtonText }}</span>
            </BaseButton>
          </div>
        </div>
      </div>

      <div class="stake-info">
        <TotalSupplyBlock
          v-if="isMSpellActive && isMobile && isAdditionalInfo"
          :totalSupply="totalSupply"
        />

        <TokenRatioBlock
          v-if="!isMSpellActive && isMobile && isAdditionalInfo"
          :mainToken="mainToken"
          :stakeToken="stakeToken"
        />

        <SpellSpecialInfoBlock
          v-if="isAdditionalInfo"
          :specialInfo="specialInfo"
        />

        <div class="row">
          <StakingAprBlock :apr="mainToken.apr" v-if="!isMobile" />

          <ClaimMimBlock
            class="claim-wrap"
            v-if="isMSpellActive && !isMobile"
            :isUnsupportedChain="isUnsupportedChain"
            :isDisableClaimButton="isDisableClaimButton"
            :claimAmount="formatAmount(mainToken.claimableAmount)"
            @claimMim="claimMimHandler"
          />

          <TokenRatioBlock
            v-else-if="!isMSpellActive && !isMobile"
            :mainToken="mainToken"
            :stakeToken="stakeToken"
          />
        </div>

        <SnapshotsCarousel v-if="isMobileView" />
      </div>
    </div>

    <div class="loader-wrap" v-else>
      <BaseLoader large text="Loading stake" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  formatToFixed,
  formatTokenBalance,
  formatUSD,
} from "@/helpers/filters";
import { utils } from "ethers";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import { parseUnits, formatUnits } from "viem";
import { ZERO_VALUE } from "@/constants/global";
import actions from "@/helpers/stake/spell/actions/";
import { approveTokenViem } from "@/helpers/approval";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";
import { getStakeInfo } from "@/helpers/stake/spell/getStakeInfo";

export default {
  data() {
    return {
      activeToken: "mSpell",
      tabTokens: ["mSpell", "sSpell"],
      tabTokenIcons: [
        useImage("assets/images/tokens/sSPELL.png"),
        useImage("assets/images/tokens/sSPELL.png"),
      ],
      activeTab: "stake",
      tabItems: ["stake", "unstake"],
      selectedNetwork: null as any,
      mSpellNetworks: [1, 250, 42161, 43114],
      sSpelleNetworks: [1],
      stakeInfoArr: null as any,
      inputAmount: BigInt(0) as bigint,
      inputValue: "" as string | bigint,
      updateInterval: null as any,
      isMobile: false,
      isAdditionalInfo: false,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    isStakeAction() {
      return this.activeTab === "stake";
    },

    isUserLocked() {
      const { lockTimestamp } = this.stakeInfo[this.activeToken];
      return !!Number(lockTimestamp) && !this.isStakeAction;
    },

    isMSpellActive() {
      return this.activeToken === "mSpell";
    },

    isDisableClaimButton() {
      if (+this.mainToken?.lockTimestamp) return true;
      if (!this.isUnsupportedChain) return true;
      return this.mainToken?.claimableAmount <= 0n;
    },

    isUnsupportedChain() {
      return this.chainId === this.selectedNetwork;
    },

    isTokenApproved() {
      if (!this.account) return true;
      if (!this.isStakeAction) return true;
      if (!this.isUnsupportedChain) return true;
      return this.toToken.approvedAmount >= this.inputAmount;
    },

    isInsufficientBalance() {
      return this.inputAmount > this.fromToken.balance;
    },

    isActionDisabled() {
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      if (!this.inputAmount) return true;
      return this.isInsufficientBalance;
    },

    isMobileView() {
      if (this.isMobile) return !this.isAdditionalInfo;
      return true;
    },

    availableNetworks() {
      this.stakeInfo;
      if (this.activeToken === "mSpell") return this.mSpellNetworks;
      return this.sSpelleNetworks;
    },

    stakeInfo() {
      if (!this.stakeInfoArr) return null;

      return this.stakeInfoArr.find(
        (info: any) => +info.chainId === +this.selectedNetwork
      );
    },

    stakeToken() {
      return this.stakeInfo?.spell;
    },

    mainToken() {
      return this.stakeInfo[this.activeToken];
    },

    fromToken() {
      return this.isStakeAction ? this.stakeToken : this.mainToken;
    },

    toToken() {
      return this.isStakeAction ? this.mainToken : this.stakeToken;
    },

    expectedAmount() {
      const amount = this.isStakeAction
        ? (this.inputAmount * this.precision) / this.mainToken.rate
        : (this.inputAmount * this.mainToken.rate) / this.precision;

      return formatToFixed(formatUnits(amount, this.mainToken.decimals), 6);
    },

    precision(): bigint {
      return parseUnits("1", this.mainToken.decimals);
    },

    balanceInfo() {
      return [
        {
          label: "Spell",
          icon: this.stakeToken.icon,
          balance: formatTokenBalance(
            formatUnits(this.stakeToken.balance, this.stakeToken.decimals)
          ),
          balanceUsd: formatUSD(
            +formatUnits(this.stakeToken.balance, this.stakeToken.decimals) *
              +formatUnits(this.stakeToken.price, this.stakeToken.decimals)
          ),
        },
        {
          label: this.activeToken,
          icon: this.mainToken.icon,
          balance: formatTokenBalance(
            formatUnits(this.mainToken.balance, this.mainToken.decimals)
          ),
          balanceUsd: formatUSD(
            +formatUnits(this.mainToken.balance, this.mainToken.decimals) *
              +formatUnits(this.mainToken.price, this.mainToken.decimals)
          ),
        },
      ];
    },

    actionButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      if (this.isInsufficientBalance) return "Insufficient balance";
      if (!this.isTokenApproved) return "Approve";
      if (!this.isStakeAction) return "Unstake";
      return "Stake";
    },

    actionInfo() {
      const info: any = { methodName: null, options: [] };

      if (this.isStakeAction) {
        if (this.activeToken === "sSpell") {
          info.methodName = "mint";
          info.options = [this.inputAmount];
        } else {
          info.methodName = "deposit";
          info.options = [this.inputAmount];
        }
      } else if (!this.isStakeAction) {
        if (this.activeToken === "sSpell") {
          info.methodName = "burn";
          info.options = [this.account, this.inputAmount];
        } else {
          info.methodName = "withdraw";
          info.options = [this.inputAmount];
        }
      }

      return info;
    },

    specialInfo() {
      const mSpellInfo = [
        {
          text: `Make SPELL work for you! Stake your SPELL into mSPELL! No impermanent
        loss, no loss of governance rights. Take part in the fee sharing
        mechanism of Abracadabra and earn MIM! Find out more`,
          link: "https://docs.abracadabra.money/learn/intro/stake/mspell",
          subText: `mSPELL automatically earns fees from MIM repayments from all wizards
        proportional to your share of the stake pool.`,
        },
      ];

      const sSpellInfo = [
        {
          text: `Stake your SPELL and gain sSPELL. No impermanent loss, no loss of governance rights. Continuously compounding. After each new deposit, all staked SPELL are subject to a 24H lock-up period!`,
        },
        {
          text: `After each new deposit, all staked SPELL are subject to a 24H lock-up period!`,
        },
      ];

      return this.isMSpellActive ? mSpellInfo : sSpellInfo;
    },

    totalSupply() {
      return formatTokenBalance(utils.formatUnits(this.mainToken.totalSupply));
    },
  },

  watch: {
    async account() {
      await this.createStakeInfo();
    },

    async chainId() {
      await this.createStakeInfo();
    },

    async activeToken() {
      await this.updateActiveNetwork();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatUSD,
    formatUnits,
    formatTokenBalance,

    formatAmount(value: bigint) {
      return formatUnits(value, this.mainToken.decimals);
    },

    changeToken(token: string) {
      localStorage.setItem("SPELL_SELECTED_TOKEN", token);
      this.activeToken = token;
      this.activeTab = "stake";
      this.inputValue = "";
    },

    changeNetwork(network: number) {
      this.selectedNetwork = network;
    },

    changeTab(action: string) {
      this.activeTab = action;
      this.inputValue = "";
    },

    updateActiveNetwork() {
      if (this.availableNetworks.includes(this.chainId))
        this.selectedNetwork = this.chainId;
      else this.selectedNetwork = this.availableNetworks[0];
    },

    updateMainValue(amount: bigint) {
      if (!amount) {
        this.inputValue = "";
        this.inputAmount = BigInt(0);
      } else {
        this.inputAmount = amount;
        this.inputValue = formatUnits(amount, this.mainToken.decimals);
      }
    },

    getActiveToken() {
      const activeToken = localStorage.getItem("SPELL_SELECTED_TOKEN");
      if (activeToken) this.activeToken = activeToken;
    },

    async claimMimHandler() {
      if (!this.isUnsupportedChain) {
        switchNetwork(this.selectedNetwork);
        return false;
      }
      if (this.isDisableClaimButton) return false;
      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error }: any = await actions.withdraw(
        this.mainToken.contract,
        ZERO_VALUE
      );

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        await this.createStakeInfo();
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },

    async approveTokenHandler() {
      if (!this.isUnsupportedChain) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.stakeToken.contract,
        this.mainToken.contract.address
      );

      if (approve) await this.createStakeInfo();
      await this.deleteNotification(notificationId);
      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    async actionHandler() {
      if (this.isActionDisabled) return false;

      if (!this.account && this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }
      if (!this.isUnsupportedChain) {
        switchNetwork(this.selectedNetwork);
        return false;
      }
      if (!this.isTokenApproved) {
        await this.approveTokenHandler();
        return false;
      }

      const notificationId = await this.createNotification(
        notification.pending
      );

      // @ts-ignore
      const { error }: any = await actions[this.actionInfo.methodName](
        this.mainToken.contract,
        ...this.actionInfo.options
      );

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        await this.createStakeInfo();
        this.inputValue = "";
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },

    async createStakeInfo() {
      this.stakeInfoArr = await getStakeInfo();
    },

    getWindowSize() {
      if (window.innerWidth <= 600) {
        this.isMobile = true;
        this.isAdditionalInfo = false;
      } else {
        this.isAdditionalInfo = true;
        this.isMobile = false;
      }
    },
  },

  async created() {
    if (window.innerWidth <= 600) this.isMobile = true;
    else this.isAdditionalInfo = true;
    window.addEventListener("resize", this.getWindowSize, false);
    this.getActiveToken();
    this.updateActiveNetwork();

    await this.createStakeInfo();

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
    window.removeEventListener("resize", this.getWindowSize);
  },

  components: {
    StatisticIcon: defineAsyncComponent(
      () => import("@/components/ui/icons/StatisticIcon.vue")
    ),
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    AvailableNetworksBlock: defineAsyncComponent(
      () => import("@/components/stake/AvailableNetworksBlock.vue")
    ),
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    LockedTimer: defineAsyncComponent(
      () => import("@/components/ui/time/LockedTimer.vue")
    ),
    SpellSpecialInfoBlock: defineAsyncComponent(
      () => import("@/components/stake/spell/SpellSpecialInfoBlock.vue")
    ),
    StakingAprBlock: defineAsyncComponent(
      () => import("@/components/stake/spell/StakingAprBlock.vue")
    ),
    TotalSupplyBlock: defineAsyncComponent(
      () => import("@/components/stake/spell/TotalSupplyBlock.vue")
    ),
    TokenRatioBlock: defineAsyncComponent(
      () => import("@/components/stake/spell/TokenRatioBlock.vue")
    ),
    ClaimMimBlock: defineAsyncComponent(
      () => import("@/components/stake/spell/ClaimMimBlock.vue")
    ),
    SnapshotsCarousel: defineAsyncComponent(
      () => import("@/components/stake/spell/SnapshotsCarousel.vue")
    ),
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-view {
  min-height: 100vh;
}

.stake-wrap {
  position: relative;
  max-width: 1310px;
  width: 100%;
  padding: 124px 15px 90px;
  display: grid;
  grid-template-columns: 520px 1fr;
  grid-gap: 24px;
  margin: 0 auto;
}

.actions-block {
  gap: 20px;
  display: flex;
  flex-direction: column;
}

.actions-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 32px;
  font-weight: 600;
  line-height: 150%;
}

.head-title-wrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.head-title::first-letter {
  text-transform: uppercase;
}

.mobile-btn {
  display: flex;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: rgba(44, 52, 74, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
}

.action-form {
  @include block-wrap;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.input-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
}

.info-wrap {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid rgba(180, 180, 180, 0.08);
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.info-title {
  font-size: 16px;
  font-weight: 400;
}

.info-value {
  gap: 4px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
}

.line {
  margin: 16px 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 51.04%,
    rgba(255, 255, 255, 0) 100%
  );
}

.balance-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-title {
  gap: 8px;
  display: flex;
  align-items: center;
}

.info-icon {
  width: 24px;
  height: 24px;
}

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.45px;
}

.subtitle {
  text-align: center;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

.leverage-link {
  color: #fff;
  text-decoration-line: underline;
}

.btn-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
  margin-bottom: 55px;
}

.stake-info {
  gap: 20px;
  display: flex;
  flex-direction: column;
}

.row {
  display: grid;
  grid-template-columns: 284px 1fr;
  gap: 16px;
}

.text {
  text-align: center;
  font-size: 12px;
  line-height: 150%;
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

@media screen and (max-width: 1200px) {
  .stake-wrap {
    grid-template-columns: 400px 1fr;
  }
}

@media screen and (max-width: 1024px) {
  .stake-wrap {
    grid-template-columns: 100%;
    grid-template-rows: auto;
  }
}

@media screen and (max-width: 768px) {
  .row {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
}

@media screen and (max-width: 600px) {
  .action-form {
    padding: 16px;
  }

  .actions-head {
    font-size: 24px;
    gap: 16px;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
