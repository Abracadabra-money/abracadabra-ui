<template>
  <div class="stake-view">
    <img class="bg-top" src="@/assets/images/market/bg-top.png" alt="" />
    <img class="bg-bottom" src="@/assets/images/market/bg-bottom.png" alt="" />

    <div class="stake-wrap" v-if="stakeInfo">
      <div class="actions-block">
        <div class="actions-head">
          <h3>{{ activeTab }}</h3>
          <Tabs
            :name="activeToken"
            :items="tabTokens"
            @select="changeToken"
            :icons="tabTokenIcons"
            width="280px"
          />
        </div>

        <AvailableNetworksBlock
          :selectedNetwork="selectedNetwork"
          :availableNetworks="availableNetworks"
          @changeNetwork="changeNetwork"
        />

        <div class="action-form">
          <Tabs :name="activeTab" :items="tabItems" @select="changeTab" />

          <div class="input-wrap">
            <h4 class="title">Select amount</h4>

            <TokenInput
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

            <TokenInput
              :disabled="true"
              :icon="toToken.icon"
              :name="toToken.name"
              :value="expectedAmount"
              :tokenPrice="formatUnits(toToken.price, toToken.decimals)"
            />
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
        <SpellSpecialInfoBlock :specialInfo="specialInfo" />

        <BalancesBlock :configs="balanceInfo" />

        <div class="row">
          <StakingAprBlock :apr="mainToken.apr" />
          <TokenRatioBlock :mainToken="mainToken" :stakeToken="stakeToken" />
        </div>

        <ClaimMimBlock
          class="claim-wrap"
          v-if="isClaimMimBlock"
          :isUnsupportedChain="isUnsupportedChain"
          :isDisableClaimButton="isDisableClaimButton"
          :claimAmount="formatAmount(mainToken.claimableAmount)"
          @claimMim="claimMimHandler"
        />
      </div>
    </div>

    <BaseLoader v-else />
  </div>
</template>

<script lang="ts">
// @ts-ignore
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
// @ts-ignore
import { useImage } from "@/helpers/useImage";
import { parseUnits, formatUnits } from "viem";
import { ZERO_VALUE } from "@/constants/global";
import actions from "@/helpers/stake/spell/actions/";
import { approveTokenViem } from "@/helpers/approval";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
// @ts-ignore
import notification from "@/helpers/notification/notification.js";
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

    isClaimMimBlock() {
      return this.isMSpellActive && !!this.mainToken?.claimableAmount;
    },

    isDisableClaimButton() {
      if (+this.mainToken?.lockTimestamp) return true;
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
      if (!this.isUnsupportedChain) return false;
      if (!this.inputAmount) return true;
      return this.isInsufficientBalance;
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
      console.log("this.stakeInfo?.spell", this.mainToken);

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

      return filters.formatToFixed(
        formatUnits(amount, this.mainToken.decimals),
        6
      );
    },

    precision(): bigint {
      return parseUnits("1", this.mainToken.decimals);
    },

    balanceInfo() {
      return [
        {
          label: "Spell balance",
          icon: this.stakeToken.icon,
          balance: this.stakeToken.balance,
          price: this.stakeToken.price,
        },
        {
          label: `Staked ${this.activeToken}`,
          tooltip: "tooltip",
          icon: this.mainToken.icon,
          balance: this.mainToken.balance,
          price: this.mainToken.price,
        },
      ];
    },

    actionButtonText() {
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
        },
        {
          text: `mSPELL automatically earns fees from MIM repayments from all wizards
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
  },

  watch: {
    async account() {
      await this.createStakeInfo();
    },

    async activeToken() {
      await this.updateActiveNetwork();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatUnits,

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
  },

  async created() {
    this.getActiveToken();
    this.updateActiveNetwork();

    await this.createStakeInfo();

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    Tabs: defineAsyncComponent(() => import("@/components/ui/Tabs.vue")),
    AvailableNetworksBlock: defineAsyncComponent(
      () => import("@/components/stake_new/AvailableNetworksBlock.vue")
    ),
    TokenInput: defineAsyncComponent(
      () => import("@/components/market/TokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    LockedTimer: defineAsyncComponent(
      () => import("@/components/stake_new/LockedTimer.vue")
    ),
    SpellSpecialInfoBlock: defineAsyncComponent(
      () => import("@/components/stake_new/SpellSpecialInfoBlock.vue")
    ),
    BalancesBlock: defineAsyncComponent(
      () => import("@/components/stake_new/BalancesBlock.vue")
    ),
    StakingAprBlock: defineAsyncComponent(
      () => import("@/components/stake_new/StakingAprBlock.vue")
    ),
    TokenRatioBlock: defineAsyncComponent(
      () => import("@/components/stake_new/TokenRatioBlock.vue")
    ),
    ClaimMimBlock: defineAsyncComponent(
      () => import("@/components/stake_new/ClaimMimBlock.vue")
    ),
    BaseLoader: defineAsyncComponent(
      () => import("@/components/base/BaseLoader.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-view {
  @include font;
  min-height: 100vh;
  background: linear-gradient(
    291deg,
    #102649 -26.37%,
    #0c0f1c 40.92%,
    #131728 62.83%,
    #212555 123.87%
  );
}

.bg-top {
  position: absolute;
  top: 145px;
  left: 0;
  z-index: 0;
}

.bg-bottom {
  position: absolute;
  top: 80vh;
  right: 70px;
  z-index: 0;
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

.actions-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
  font-size: 32px;
  font-weight: 600;
  line-height: 150%;

  h3::first-letter {
    text-transform: uppercase;
  }
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

.title {
  font-size: 18px;
  font-weight: 500;
  line-height: 150%;
  letter-spacing: 0.45px;
}

.btn-wrap {
  gap: 12px;
  display: flex;
  flex-direction: column;
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
  .actions-head {
    font-size: 24px;
    gap: 16px;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
