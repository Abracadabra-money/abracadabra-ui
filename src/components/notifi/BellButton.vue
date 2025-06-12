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
      <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.95761 5.37728C2.95761 3.14476 4.76742 1.33496 6.99994 1.33496C9.23245 1.33496 11.0423 3.14477 11.0423 5.37728V7.28692V7.32097L11.0457 7.35484C11.0976 7.86243 11.2401 8.35759 11.4673 8.8165L12.6071 11.1185C12.7831 11.474 12.5245 11.8906 12.1279 11.8906H1.87214C1.4755 11.8906 1.21688 11.474 1.39287 11.1185L2.51387 8.85443C2.80201 8.27247 2.95371 7.63261 2.9576 6.98346L2.95761 6.98346V6.97946V5.37728ZM6.99994 0C4.03015 0 1.62265 2.40749 1.62265 5.37728V6.97736C1.6197 7.42312 1.51539 7.86246 1.31753 8.2621L0.196524 10.5262C-0.418794 11.769 0.485397 13.2256 1.87214 13.2256H12.1279C13.5146 13.2256 14.4188 11.769 13.8035 10.5262L12.6637 8.22416C12.5122 7.91827 12.4155 7.58896 12.3772 7.25114V5.37728C12.3772 2.40749 9.96973 0 6.99994 0ZM6.99844 16.0261C5.77519 16.0261 4.76321 15.2504 4.59487 14.2414H9.402C9.23366 15.2504 8.22168 16.0261 6.99844 16.0261ZM6.98386 11.8616H7.01301L6.99844 11.8616L6.98386 11.8616ZM4.57028 13.9439L4.57032 13.9311V13.9566L4.57028 13.9439Z" fill="#E8EBF5"/>
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
        Get real time alerts like announcements, liquidation, and position
        health alerts.
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
  position: relative;
  width: 43px;
  height: 43px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  cursor: default;
  background: rgba(111, 111, 111, 0.06);
  border-radius: 8px;
  color: #fff;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
}

.unreadCount-number {
  position: absolute;
  top: 8px;
  left: 23px;
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
