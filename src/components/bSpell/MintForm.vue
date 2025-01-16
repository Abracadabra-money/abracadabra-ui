<template>
  <div class="action-form">
    <div class="inputs-wrap">
      <BaseTokenInput
        :value="inputValue"
        :icon="lockerInfo.spell?.icon"
        :name="lockerInfo.spell?.name"
        :max="lockerInfo.spell?.balance"
        :tokenPrice="lockerInfo.spell?.price"
        @updateInputValue="updateMainValue"
      />

      <div class="arrow">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M4.71932 12.9698C4.78898 12.9 4.8717 12.8447 4.96275 12.807C5.05379 12.7692 5.15139 12.7498 5.24995 12.7498C5.34851 12.7498 5.44611 12.7692 5.53716 12.807C5.6282 12.8447 5.71092 12.9 5.78057 12.9698L11.2499 18.4401L11.25 3.75039C11.25 3.55147 11.329 3.36071 11.4696 3.22006C11.6103 3.0794 11.801 3.00039 12 3.00039C12.1989 3.00039 12.3896 3.0794 12.5303 3.22006C12.6709 3.36071 12.75 3.55147 12.75 3.75039L12.7499 18.4401L18.2193 12.9698C18.3601 12.829 18.5509 12.75 18.7499 12.75C18.949 12.75 19.1398 12.829 19.2806 12.9698C19.4213 13.1105 19.5004 13.3014 19.5004 13.5004C19.5004 13.6994 19.4213 13.8903 19.2806 14.031L12.5306 20.781C12.4609 20.8507 12.3782 20.9061 12.2872 20.9438C12.1961 20.9815 12.0985 21.001 11.9999 21.001C11.9014 21.001 11.8038 20.9815 11.7127 20.9438C11.6217 20.9061 11.539 20.8507 11.4693 20.781L4.71932 14.031C4.64959 13.9614 4.59427 13.8786 4.55653 13.7876C4.51879 13.6965 4.49936 13.5989 4.49936 13.5004C4.49936 13.4018 4.51879 13.3042 4.55653 13.2132C4.59427 13.1221 4.64959 13.0394 4.71932 12.9698Z"
            fill="white"
          />
        </svg>
      </div>

      <BaseTokenInput
        :value="inputValue"
        :icon="lockerInfo.bSpell.icon"
        :name="lockerInfo.bSpell.name"
        :tokenPrice="lockerInfo.bSpell.price"
        disabled
      />
    </div>

    <div class="description">
      <img class="left-icon" src="@/assets/images/bSpell/timer.png" alt="" />
      <p class="description-text">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam,
      </p>
      <img class="right-icon" src="@/assets/images/bSpell/timer.png" alt="" />
    </div>

    <BaseButton primary :disabled="isActionDisabled" @click="mintHandler">
      {{ actionButtonText }}
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { formatUnits } from "viem";
import type { PropType } from "vue";
import { defineAsyncComponent } from "vue";
import { mint } from "@/helpers/bSpell/actions/mint";
import { approveTokenViem } from "@/helpers/approval";
import type { LockerInfo } from "@/helpers/bSpell/types";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { switchNetwork } from "@/helpers/chains/switchNetwork";
import notification from "@/helpers/notification/notification";

export default {
  emits: ["updateBSpellInfo"],

  props: {
    lockerInfo: {
      type: Object as PropType<LockerInfo>,
      required: true,
    },

    selectedChain: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      inputValue: "" as string | bigint,
      inputAmount: BigInt(0),
    };
  },

  computed: {
    ...mapGetters({ account: "getAccount", chainId: "getChainId" }),

    isUnsupportedChain() {
      return this.chainId === this.selectedChain;
    },

    isInsufficientBalance() {
      return this.inputAmount > this.lockerInfo.spell?.balance;
    },

    isActionDisabled() {
      if (!this.account) return false;
      if (!this.isUnsupportedChain) return false;
      if (!this.inputAmount) return true;
      return this.isInsufficientBalance;
    },

    isTokenApproved() {
      if (!this.inputAmount) return true;
      if (!this.account) return true;
      if (!this.isUnsupportedChain) return true;
      return this.lockerInfo.spell?.approvedAmount >= this.inputAmount;
    },

    actionButtonText() {
      if (!this.account && this.isUnsupportedChain) return "Connect wallet";
      if (!this.isUnsupportedChain) return "Switch Network";
      if (this.isInsufficientBalance) return "Insufficient balance";
      if (!this.isTokenApproved) return "Approve";
      return "Mint";
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),

    updateMainValue(amount: bigint) {
      if (!amount) {
        this.inputValue = "";
        this.inputAmount = BigInt(0);
      } else {
        this.inputAmount = amount;
        this.inputValue = formatUnits(amount, 18);
      }
    },

    async approveTokenHandler() {
      if (!this.isUnsupportedChain) return false;

      const notificationId = await this.createNotification(
        notification.approvePending
      );

      const approve = await approveTokenViem(
        this.lockerInfo.spell.contract,
        this.lockerInfo.tokenBank.address,
        this.inputAmount
      );

      if (approve) this.$emit("updateBSpellInfo");
      await this.deleteNotification(notificationId);

      if (!approve) await this.createNotification(notification.approveError);
      return false;
    },

    async mintHandler() {
      if (this.isActionDisabled) return false;

      if (!this.account && this.isUnsupportedChain) {
        // @ts-ignore
        return this.$openWeb3modal();
      }

      if (!this.isUnsupportedChain) {
        switchNetwork(this.selectedChain);
        return false;
      }

      if (!this.isTokenApproved) return await this.approveTokenHandler();

      const notificationId = await this.createNotification(
        notification.pending
      );

      // @ts-ignore
      const { error } = await mint(
        this.lockerInfo.tokenBank,
        this.inputAmount,
        this.account
      );

      if (error) {
        await this.deleteNotification(notificationId);
        await this.createNotification(error);
      } else {
        this.$emit("updateBSpellInfo");
        this.inputValue = "";
        await this.deleteNotification(notificationId);
        await this.createNotification(notification.success);
      }
    },
  },

  components: {
    BaseTokenInput: defineAsyncComponent(
      () => import("@/components/base/BaseTokenInput.vue")
    ),
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.action-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.inputs-wrap {
  position: relative;
  gap: 16px;
  display: flex;
  flex-direction: column;
}

.arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 44px;
  height: 44px;
  border-radius: 16px;
  border: 1px solid #2d4a96;
  background: rgba(25, 31, 47, 0.38);
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(67.9000015258789px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.description {
  position: relative;
  border-radius: 10px;
  border: 1px solid #2d4a96;
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.32) 0%,
    rgba(116, 92, 210, 0.32) 100%
  );
  box-shadow: 0px 4px 33px 0px rgba(0, 0, 0, 0.06);
  padding: 8px 12px;
  overflow: hidden;
}

.left-icon {
  width: 122px;
  position: absolute;
  top: 0;
  left: 0;
}

.right-icon {
  width: 122px;
  position: absolute;
  top: 40%;
  right: -10%;
}

.description-text {
  max-width: 377px;
  font-size: 14px;
  font-weight: 600;
  line-height: 195%;
  color: #fff;
  margin: 0 auto;
}
</style>
