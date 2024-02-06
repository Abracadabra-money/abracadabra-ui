<template>
  <div class="banner" v-if="showPopup && !closeClicked">
    <img
      class="banner-close"
      src="@/assets/images/close.svg"
      @click="closeClicked = true"
      alt="Close"
    />
    <img class="banner-img" src="@/assets/images/claim/skull.png" alt="Skull" />
    <div class="banner-content">
      <h3 class="banner-title">Your address is affected by a vulnerability!</h3>
      <p class="banner-text">
        Follow the Steps below
        <router-link class="banner-link" :to="{ name: 'Claim' }"
          >here</router-link
        >
        to get back your secured funds.
      </p>
      <a
        class="banner-link"
        href="https://mirror.xyz/0x5744b051845B62D6f5B6Db095cc428bCbBBAc6F9/47LK6nUpMrVsYzfCYBTyZsc_7t5Sh5onxO8sSEotNMY"
        target="_blank"
        rel="noopener noreferrer"
        >Read more about it here</a
      >
    </div>
    <img class="banner-img" src="@/assets/images/claim/skull.png" alt="Skull" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import degenBoxAbi from "@/abis/degenBox.js";
import claimAbi from "@/abis/tokensClaim";
const claimETHAddress = "0xfbCB80d7ec773F3711788643b8AF828Feb59cf9a";
const claimARBAddress = "0x83a4e315baaa0f26de83df29b6e2d0376817ecaf";
const crvAddress = "0xD533a949740bb3306d119CC777fa900bA034cd52";
const sGlpAddress = "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf";
const mimAddress = "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A";

export default {
  data() {
    return {
      activeNetworks: [42161, 1],
      mainnetMasterContract: [
        "0xb2EBF227188E44ac268565C73e0fCd82D4Bfb1E3",
        "0x43243F7BdDCb850acB687c42BBf5066c224054a5",
      ],
      aethMasterContract: ["0x303A59A1020807B6FD78D3BB0e3c8B6a26Bbc0B9"],
      degenContract: null,
      isAffected: false,
      closeClicked: false,
    };
  },
  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      userSigner: "getSigner",
      defaultProvider: "getProvider",
    }),
    contractProvider() {
      return this.userSigner ? this.userSigner : this.defaultProvider;
    },
    showPopup() {
      return this.isAffected && this.$route.name !== "Claim";
    },
  },
  watch: {
    account(val) {
      this.checkAccount(val);
    },
  },
  methods: {
    async checkAccount(account) {
      if (account && (this.chainId === 1 || this.chainId === 42161)) {
        const address =
          this.chainId === 1
            ? "0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce"
            : "0x7c8fef8ea9b1fe46a7689bfb8149341c90431d38";

        this.degenContract = new this.$ethers.Contract(
          address,
          JSON.stringify(degenBoxAbi),
          this.contractProvider
        );

        if (this.chainId === 1) {
          const isApproveOne = await this.degenContract.masterContractApproved(
            "0xb2EBF227188E44ac268565C73e0fCd82D4Bfb1E3",
            account
          );

          const isApproveTwo = await this.degenContract.masterContractApproved(
            "0x43243F7BdDCb850acB687c42BBf5066c224054a5",
            account
          );

          const claimContract = new this.$ethers.Contract(
            claimETHAddress,
            JSON.stringify(claimAbi),
            this.contractProvider
          );

          this.claimContract = claimContract;

          const crvBalance = await claimContract.amounts(
            this.account,
            crvAddress
          );

          const mimBalance = await claimContract.amounts(
            this.account,
            "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3"
          );

          this.isAffected =
            isApproveOne ||
            isApproveTwo ||
            +crvBalance !== 0 ||
            +mimBalance !== 0;
        }

        if (this.chainId === 42161) {
          const isApprove = await this.degenContract.masterContractApproved(
            "0x303A59A1020807B6FD78D3BB0e3c8B6a26Bbc0B9",
            account
          );

          const claimContract = new this.$ethers.Contract(
            claimARBAddress,
            JSON.stringify(claimAbi),
            this.contractProvider
          );

          const sGlpBalance = await claimContract.amounts(account, sGlpAddress);

          const mimBalance = await claimContract.amounts(account, mimAddress);

          this.isAffected =
            isApprove || +sGlpBalance !== 0 || +mimBalance !== 0;
        }
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
