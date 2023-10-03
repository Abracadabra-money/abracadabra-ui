<template>
  <div class="stake-view">
    <div class="deposit-block">
      <h4>Choose Chain</h4>

      <div class="underline">
        <NetworksList :active-list="[1, 250, 42161, 43114]" />
      </div>

      <div class="loader-wrap" v-if="!isConfigLoading">
        <BaseLoader />
      </div>

      <div v-else>
        <div class="choose-asset underline">
          <h4>Choose Asset</h4>

          <div class="choose-btns">
            <button
              class="choose-button"
              :class="{ 'active-button': selectedToken === 'mSpell' }"
              @click="changeToken('mSpell')"
            >
              <img
                class="choose-button-icon"
                src="@/assets/images/mspell-icon.svg"
                alt="mSpell icon"
              />
              mSpell
            </button>

            <button
              class="choose-button"
              :class="{ 'active-button': selectedToken === 'sSpell' }"
              @click="changeToken('sSpell')"
            >
              <img
                class="choose-button-icon"
                src="@/assets/images/sspell-icon.svg"
                alt=""
              />
              sSpell
            </button>
          </div>
        </div>

        <div class="input-assets">
          <InputLabel :amount="fromTokenBalance" :title="mainIntulLabel" />
          <BaseTokenInput
            :value="inputValue"
            :icon="fromToken.icon"
            :name="fromToken.name"
            :max="fromTokenBalance"
            :disabled="isInputDisabled"
            :error="errorMainValue"
            @updateValue="updateMainValue"
          />
        </div>

        <button class="swap-button">
          <img
            src="@/assets/images/swap.svg"
            @click="toggleAction"
            alt="Swap action"
          />
        </button>

        <div class="input-assets">
          <h4 class="input-labal">{{ unstakeIntulLabel }}</h4>
          <BaseTokenInput
            :icon="toToken.icon"
            :name="toToken.name"
            :value="expectedAmount"
            :disabled="true"
          />
        </div>
      </div>
    </div>

    <div class="stake-stand">
      <h1 class="title">{{ selectedToken }} TOKEN STAKING</h1>

      <div class="loader-wrap" v-if="!isConfigLoading">
        <BaseLoader />
      </div>

      <template v-else>
        <SpellInfoBlock
          v-if="isUnsupportedChain"
          :stakeToken="stakeToken"
          :mainToken="mainToken"
        />

        <EmptyBlock :warningType="selectedToken" v-else />

        <div class="btns-wrap">
          <BaseButton
            primary
            :disabled="isTokenApproved"
            @click="approveTokenHandler"
            >Approve
          </BaseButton>

          <BaseButton :disabled="isActionDisabled" @click="actionHandler">
            {{ actionInfo.buttonText }}
          </BaseButton>
        </div>

        <ClaimMimBlock
          class="claim-wrap"
          v-if="isClaimMimBlock"
          :claimAmount="formatAmount(mainToken.claimableAmount)"
          :isDisableClaimButton="isDisableClaimButton"
          @claimMim="claimMimHandler"
        />
      </template>

      <div class="stake-description">
        <p v-for="description in stakeDescriptions" :key="description.text">
          {{ description.text }}
          <span v-if="description.link">
            <a class="description-link" :href="description.link" target="_blank"
              >here</a
            >!
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { parseUnits, formatUnits } from "viem";
import actions from "@/helpers/stake/spell/actions/";
import { approveTokenViem } from "@/helpers/approval"; //todo
import { spellConfig } from "@/utils/stake/spellConfig";
import { mapGetters, mapActions, mapMutations } from "vuex";
import notification from "@/helpers/notification/notification.js";
import { getStakeInfo } from "@/helpers/stake/spell/getStakeInfo";

export default {
  data() {
    return {
      action: "Stake",
      stakeConfig: null,
      inputValue: "",
      selectedToken: "mSpell",
      updateInterval: null,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
    }),

    isConfigLoading() {
      return !!this.stakeConfig;
    },

    isUnsupportedChain() {
      if (!spellConfig[this.chainId]) return false;
      return !!spellConfig[this.chainId][this.selectedToken];
    },

    isStakeAction() {
      return this.action === "Stake";
    },

    isTokenApproved() {
      if (!this.isUnsupportedChain) return true;
      if (!this.isStakeAction) return true;
      if (this.errorMainValue) return true;
      if (!this.account) return true;

      return this.toToken.allowanceAmount >= this.parsedInputValue;
    },

    isActionDisabled() {
      if (!this.isUnsupportedChain) return true;
      if (this.isUserLocked) return true;
      if (!this.isTokenApproved) return true;
      return !!(!this.inputValue || this.errorMainValue);
    },

    isClaimMimBlock() {
      return (
        this.selectedToken === "mSpell" && !!this.mainToken?.claimableAmount
      );
    },

    isDisableClaimButton() {
      if (+this.mainToken?.lockTimestamp) return true;
      return this.mainToken?.claimableAmount <= 0n;
    },

    isInputDisabled() {
      return !!this.isUserLocked || !this.isUnsupportedChain;
    },

    parsedInputValue() {
      return parseUnits(this.inputValue, 18);
    },

    stakeToken() {
      return this.stakeConfig.spell;
    },

    mainToken() {
      return this.stakeConfig[this.selectedToken];
    },

    fromToken() {
      if (this.isStakeAction) return this.stakeToken;
      return this.mainToken;
    },

    fromTokenBalance() {
      return !this.isUnsupportedChain
        ? "0"
        : this.formatAmount(this.fromToken.balance);
    },

    toToken() {
      if (this.isStakeAction) return this.mainToken;
      return this.stakeToken;
    },

    isUserLocked() {
      const { lockTimestamp } = this.stakeConfig[this.selectedToken];
      return !!+lockTimestamp && !this.isStakeAction;
    },

    precision() {
      return parseUnits("1", this.mainToken.decimals);
    },

    expectedAmount() {
      if (!this.inputValue) return "";

      const amount = this.isStakeAction
        ? (this.parsedInputValue * this.precision) / this.mainToken.rate
        : (this.parsedInputValue * this.mainToken.rate) / this.precision;

      return filters.formatToFixed(this.formatAmount(amount), 6);
    },

    errorMainValue() {
      if (this.parsedInputValue > this.fromToken.balance) {
        return `The value cannot be greater than ${this.formatAmount(
          this.fromToken.balance
        )}`;
      }

      return "";
    },

    actionInfo() {
      const isMspell = this.selectedToken === "mSpell";
      const info = { methodName: null };

      if (isMspell && this.isStakeAction) info.buttonText = "Deposit";
      if (isMspell && !this.isStakeAction) info.buttonText = "Withdraw";

      if (!isMspell && this.isStakeAction) info.buttonText = "Stake";
      if (!isMspell && !this.isStakeAction) info.buttonText = "Unstake";

      if (this.isUserLocked || this.errorMainValue) return info;

      if (this.isStakeAction) {
        if (this.selectedToken === "sSpell") {
          info.methodName = "mint";
          info.options = [this.parsedInputValue];
        } else {
          info.methodName = "deposit";
          info.options = [this.parsedInputValue];
        }
      } else if (!this.isStakeAction) {
        if (this.selectedToken === "sSpell") {
          info.methodName = "burn";
          info.options = [this.account, this.parsedInputValue];
        } else {
          info.methodName = "withdraw";
          info.options = [this.parsedInputValue];
        }
      }

      return info;
    },

    stakeDescriptions() {
      const sSpell = [
        {
          text: "Make SPELL work for you! Stake your SPELL and gain sSPELL. No impermanent loss, no loss of governance rights. Continuously compounding. After each new deposit, all staked SPELL are subject to a 24H lock-up period!",
        },
        {
          text: "After each new deposit, all staked SPELL are subject to a 24H lock-up period!",
        },
      ];

      const mSpell = [
        {
          text: "Make SPELL work for you! Stake your SPELL into mSPELL! No impermanent loss, no loss of governance rights. Take part in the fee sharing mechanism of Abracadabra and earn MIM! Find out more ",
          link: "https://abracadabramoney.gitbook.io/intro/stake/mspell",
        },
        {
          text: "sSPELL automatically earns fees from MIM repayments from all wizards proportional to your share of the stake pool.",
        },
      ];

      return this.selectedToken === "mSpell" ? mSpell : sSpell;
    },

    mainIntulLabel() {
      if (this.selectedToken === "mSpell" && this.isStakeAction)
        return "Deposit";
      if (this.selectedToken === "mSpell" && !this.isStakeAction)
        return "Withdraw";
      if (this.selectedToken === "sSpell" && !this.isStakeAction)
        return "Untake";

      return "Stake";
    },

    unstakeIntulLabel() {
      return this.selectedToken === "mSpell" ? "Stake" : "Receive";
    },
  },

  watch: {
    async account(value) {
      if (value) await this.createStakeInfo();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    formatAmount(value) {
      return formatUnits(value, this.mainToken.decimals);
    },

    changeToken(token) {
      localStorage.setItem("SPELL_SELECTED_TOKEN", token);
      this.selectedToken = token;
      this.action = "Stake";
      this.inputValue = "";
    },

    async updateMainValue(value) {
      this.inputValue = value;
    },

    toggleAction() {
      this.inputValue = "";
      this.action = this.isStakeAction ? "Unstake" : "Stake";
    },

    async approveTokenHandler() {
      if (this.isTokenApproved) return false;

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
      if (!this.actionInfo.methodName) return false;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error } = await actions[this.actionInfo.methodName](
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

    async claimMimHandler() {
      if (this.isDisableClaimButton) return false;

      const notificationId = await this.createNotification(
        notification.pending
      );

      const { error } = await actions.withdraw(this.mainToken.contract, 0n);

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        await this.createStakeInfo();
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },

    async createStakeInfo() {
      this.stakeConfig = await getStakeInfo(this.chainId);
    },
  },

  async mounted() {
    const selectedToken = localStorage.getItem("SPELL_SELECTED_TOKEN");
    if (selectedToken) this.selectedToken = selectedToken;

    await this.createStakeInfo();

    this.updateInterval = setInterval(async () => {
      await this.createStakeInfo();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    NetworksList: defineAsyncComponent(() =>
      import("@/components/ui/NetworksList.vue")
    ),
    BaseLoader: defineAsyncComponent(() =>
      import("@/components/base/BaseLoader.vue")
    ),
    InputLabel: defineAsyncComponent(() =>
      import("@/components/ui/inputs/InputLabel.vue")
    ),
    BaseTokenInput: defineAsyncComponent(() =>
      import("@/components/base/BaseTokenInput.vue")
    ),
    SpellInfoBlock: defineAsyncComponent(() =>
      import("@/components/stake/SpellInfoBlock.vue")
    ),
    EmptyBlock: defineAsyncComponent(() =>
      import("@/components/stake/EmptyBlock.vue")
    ),
    BaseButton: defineAsyncComponent(() =>
      import("@/components/base/BaseButton.vue")
    ),
    ClaimMimBlock: defineAsyncComponent(() =>
      import("@/components/stake/ClaimMimBlock.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.stake-view {
  display: grid;
  grid-template-columns: 550px 1fr;
  width: 1320px;
  max-width: calc(100% - 20px);
  grid-gap: 15px;
  margin: 0 auto;
  padding: 100px 0;
}

.deposit-block {
  max-width: 100%;
  overflow: hidden;
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
}

.underline {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.loader-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 10px;
}

.choose-asset {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 30px 0;
}

.choose-btns {
  display: flex;
  gap: 20px;
}

.choose-button {
  border-radius: 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  display: inline-flex;
  justify-content: center;
  gap: 4px;
  color: #fff;
  width: 100px;
  padding: 15px 10px;
  cursor: pointer;
}

.choose-button-icon {
  width: 20px;
}

.active-button {
  border: 2px solid rgba(110, 166, 247, 0.8);
}

.input-assets {
  padding: 20px 0 15px;
}

.swap-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border: none;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
}

.input-labal {
  margin-bottom: 6px;
}

.btns-wrap {
  padding: 30px 0 0;
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.stake-stand {
  padding: 30px;
  border-radius: 30px;
  background-color: $clrBg2;
  text-align: center;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 30px;
  text-transform: uppercase;
}

.title::first-letter {
  text-transform: lowercase;
}

.claim-wrap {
  margin: 20px 0 0;
}

.stake-description {
  padding: 20px 0;
  line-height: 24px;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.description-link {
  color: #759ffa;
}

@media (max-width: 1320px) {
  .stake-view {
    grid-template-columns: 0.9fr 1.1fr;
  }
}

@media (max-width: 1024px) {
  .stake-view {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .deposit-block,
  .stake-stand {
    padding: 30px 10px;
  }

  .title {
    font-size: 20px;
  }
}
</style>
