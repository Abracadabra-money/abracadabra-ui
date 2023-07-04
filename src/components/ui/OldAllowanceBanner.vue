<template>
  <div class="banner" v-if="showBanner && !closeClicked">
    <img
      class="banner-close"
      src="@/assets/images/close.svg"
      @click="closeClicked = true"
      alt="Close"
    />
    <img class="banner-img" src="@/assets/images/claim/skull.png" alt="Skull" />
    <div class="banner-content">
      <h3 class="banner-title">
        {{ titleText }}
      </h3>
      <p class="banner-text">
        Click
        <a @click.prevent.stop="openPopup" class="banner-link">here</a>
        to revoke it!
      </p>
    </div>
    <img class="banner-img" src="@/assets/images/claim/skull.png" alt="Skull" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getAllowanceDatas } from "@/helpers/oldCauldronsAllowance.js";

export default {
  data() {
    return {
      closeClicked: false,
      isStillApproved: false,
      isMoreThanOneApproval: false,
    };
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      userSigner: "getSigner",
    }),
    showBanner() {
      return this.isStillApproved && !this.closeClicked;
    },
    titleText() {
      return `Your address has a ${
        this.isMoreThanOneApproval ? "tokens" : "token"
      } spending allowance to an old ${
        this.isMoreThanOneApproval ? "cauldrons" : "cauldron"
      }
        contract`;
    },
  },
  watch: {
    account(val) {
      this.checkAccount(val);
    },
  },
  methods: {
    openPopup() {
      this.$store.commit("setPopupState", {
        type: "approvals",
        isShow: true,
      });

      this.closeClicked = true;
    },
    async checkAccount(account) {
      if (account && this.chainId === 1) {
        const allovanceData = await getAllowanceDatas(account, this.userSigner);
        this.isMoreThanOneApproval = allovanceData
          ? allovanceData.filter((item) => item.isStillApproved).length > 0
          : false;
        this.isStillApproved = allovanceData
          ? !!allovanceData.find((item) => item.isStillApproved)
          : false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.banner-close {
  position: absolute;
  top: 10px;
  right: 16px;
  cursor: pointer;
}
.banner {
  max-width: 780px;
  width: 100%;
  //   height: 112px;
  background: rgba(64, 58, 92, 0.4);
  border: 2px solid #e54369;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 16px;
  position: fixed;
  top: 100px;
  left: 50%;
  right: 0;
  z-index: 10;
  transform: translateX(-50%);
}

.banner-img {
  max-width: 60px;
  width: 100%;
}

.banner-content {
  text-align: center;
}

.banner-title {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;

  letter-spacing: 0.035em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.banner-text,
.banner-link {
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.035em;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.banner-text {
  margin-bottom: 5px;
}

.banner-link {
  background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  position: relative;
}

.banner-link::after {
  content: "";
  position: absolute;
  bottom: 3px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #9df4ff 0%, #7981ff 100%);
}

.mobile-info-usd {
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 3px;
}

@media screen and (max-width: 600px) {
  .banner {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
