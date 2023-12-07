<template>
  <div
    v-if="isOpenSignUpCta && !!account && !isSignedUp"
    class="signup-cta-overlay"
    @click="closeSignUpCta"
  ></div>
  <div
    v-if="notifiWalletBlockchain && notifiCardId"
    class="notifi-modal-button"
  >
    <div class="bell" @click="clickBell">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="15"
        viewBox="0 0 12 15"
        fill="none"
      >
        <path
          d="M5.94872 14.5C6.76667 14.5 7.4359 13.8308 7.4359 13.0128H4.46154C4.46154 13.8308 5.12333 14.5 5.94872 14.5ZM10.4103 10.0385V6.32051C10.4103 4.03769 9.19077 2.12667 7.0641 1.62103V1.11538C7.0641 0.498205 6.5659 0 5.94872 0C5.33154 0 4.83333 0.498205 4.83333 1.11538V1.62103C2.69923 2.12667 1.48718 4.03026 1.48718 6.32051V10.0385L0 11.5256V12.2692H11.8974V11.5256L10.4103 10.0385Z"
          fill="white"
        />
      </svg>
    </div>

    <div
      v-if="unreadNotificationCount > 0"
      :class="
        unreadNotificationCount > 99
          ? 'unreadCount-number big-number'
          : 'unreadCount-number'
      "
    >
      {{ unreadNotificationCount > 99 ? "99+" : unreadNotificationCount }}
    </div>

    <div
      v-if="isOpenSignUpCta && !!account && !isSignedUp"
      class="signup-cta-popover"
    >
      <div class="signup-cta-title">Get Notifications</div>
      <div class="signup-cta-content">
        Get real time alerts like announcements, order fill & trade
        confirmations, and take profit reminders.
      </div>
      <div class="signup-cta">
        <div @click="openSignupView">Set up now</div>
        <div @click="closeSignUpCta">Maybe later</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    notifiCardId: {
      type: String,
      required: true,
    },
    notifiWalletBlockchain: {
      type: String,
      required: true,
    },
    unreadNotificationCount: {
      type: Number,
      required: true,
    },
    isSignedUp: {
      type: Boolean,
      required: true,
    },
    isOpenNotifiModal: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["toggleNotifiModal"],
  data() {
    return {
      isOpenSignUpCta: false,
    };
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
    }),
  },
  methods: {
    clickBell() {
      if (this.isSignedUp) {
        this.$emit("toggleNotifiModal");
        this.isOpenSignUpCta = false;
        return;
      }
      if (!this.isSignedUp && this.isOpenNotifiModal) {
        this.$emit("toggleNotifiModal");
        this.isOpenSignUpCta = false;
        return;
      }
      this.isOpenSignUpCta = !this.isOpenSignUpCta;
    },
    openSignupView() {
      this.$emit("toggleNotifiModal");
      this.isOpenSignUpCta = false;
    },
    closeSignUpCta() {
      this.isOpenSignUpCta = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.bell {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.notifi-modal-button {
  min-width: 43px !important;
  min-height: 43px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: default;

  background: #ffffff0f;
  backdrop-filter: blur(40px);
  border-radius: 20px;
  color: #fff;
  min-width: 80px;
}

.unreadCount-number {
  position: absolute;
  top: 11px;
  left: 22px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #a9e2fc;
  color: #06061a;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Roboto;
  font-size: 8px;
  text-align: center;
  font-weight: 900;
}

.unreadCount-number.big-number {
  width: 18px;
  border-radius: 10px;
}

.signup-cta-overlay {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0);
  z-index: 1;
  top: 0;
  left: 0;
}
.signup-cta-popover {
  position: absolute;
  width: 334px;
  top: calc(100% + 15px);
  background-color: #2b2b3b;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 15px 25px;
}
.signup-cta-popover::after {
  content: "";
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #2b2b3b;
}
// TODO: consolidate with .signup-cta-popover pseudo element after being approved
.signup-cta-popover::before {
  content: "";
  position: absolute;
  top: -11px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid rgba(255, 255, 255, 0.1);
}

.signup-cta-title {
  color: #fff;
  font-size: 16px;
  text-align: start;
  margin-bottom: 5px;
}

.signup-cta-content {
  font-size: 14px;
  color: #b3afb6;
  line-height: 1.5rem;
  text-align: start;
  margin-right: -4px;
}

.signup-cta {
  margin: 10px 0;
  text-align: start !important;
}
.signup-cta > div {
  display: inline;
}

.signup-cta > div:first-child {
  margin-right: 37px;
  color: #69c3f5;
  font-size: 16px;
  cursor: pointer;
}

.signup-cta > div:last-child {
  color: #b3afb6;
  font-size: 16px;
  cursor: pointer;
}

@media (max-width: 1110px) {
  .signup-cta-popover {
    transform: translateX(20%);
  }
  .signup-cta-popover::before {
    left: 30%;
  }
  .signup-cta-popover::after {
    left: 30%;
  }
}
</style>
