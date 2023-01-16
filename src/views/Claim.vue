<template>
  <div class="claim-view">
    <div class="wrapper check-content" :style="`background-image: url(${bg})`">
      The front end claiming process is being finalised, please check back
      later. While being developed, funds have already been secured in the claim
      contract.
    </div>

    <div class="banner" v-if="false">
      <img
        class="banner-img"
        src="@/assets/images/claim/skull.png"
        alt="Skull"
      />
      <div class="banner-content">
        <h3 class="banner-title">
          Your address is affected by a vulnerability!
        </h3>
        <p class="banner-text">
          Follow the Steps
          <a
            class="banner-link"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            >here</a
          >
          to get back your secured funds.
        </p>
        <a
          class="banner-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          >Read more about it here</a
        >
      </div>
      <img
        class="banner-img"
        src="@/assets/images/claim/skull.png"
        alt="Skull"
      />
    </div>

    <div class="wrapper" v-if="account">
      <h4>Choose Chain</h4>
      <NetworksList :items="2" :activeList="activeNetworks" />
    </div>

    <h3 class="claim-title" v-if="false">
      Claimable funds on: Ethereum & Arbitrum
    </h3>

    <div class="claim-table" v-if="false">
      <div class="table-header">
        <div class="header-item">Status</div>
        <div class="header-item">Token</div>
        <div class="header-item">Network</div>
      </div>

      <div v-if="false" class="not-claimed">No tokens to be Claimed</div>

      <template v-else>
        <div class="table-item">
          <div class="item-status">! unclaimed</div>
          <div class="item-token">
            <BaseTokenIcon size="50px" />
            <div class="token-info">
              <div class="info">sGLP</div>
              <div class="info">0.0</div>
              <div class="info-usd">$ 0.0</div>
            </div>
          </div>
          <div class="item-network">
            <img
              class="network-icon"
              src="@/assets/images/networks/ethereum-icon.svg"
              alt=""
            />
            ETH
          </div>
        </div>
        <div class="table-item">
          <div class="item-status">! unclaimed</div>
          <div class="item-token">
            <BaseTokenIcon size="50px" />
            <div class="token-info">
              <div class="info">sGLP</div>
              <div class="info">0.0</div>
              <div class="info-usd">$ 0.0</div>
            </div>
          </div>
          <div class="item-network">
            <img
              class="network-icon"
              src="@/assets/images/networks/ethereum-icon.svg"
              alt=""
            />
            ETH
          </div>
        </div>
        <div class="table-item">
          <div class="item-status">! unclaimed</div>
          <div class="item-token">
            <BaseTokenIcon size="50px" />
            <div class="token-info">
              <div class="info">sGLP</div>
              <div class="info">0.0</div>
              <div class="info-usd">$ 0.0</div>
            </div>
          </div>
          <div class="item-network">
            <img
              class="network-icon"
              src="@/assets/images/networks/ethereum-icon.svg"
              alt=""
            />
            ETH
          </div>
        </div>
      </template>

      <div class="table-claimed" v-if="false">
        <img
          class="claimed-img"
          src="@/assets/images/claim/coin.png"
          alt="Coin"
        />
        <p class="claimed-text">All tokens have been claimed</p>
      </div>
    </div>

    <div class="table-mobile" v-if="false">
      <div v-if="false" class="not-claimed">No tokens to be Claimed</div>

      <template v-else>
        <div class="mobile-item">
          <p class="mobile-status">
            Status <span class="unclaimed">! unclaimed</span>
          </p>
          <div>
            <p class="mobile-title">Token</p>
            <div class="mobile-token">
              <div class="mobile-token-icon">
                <BaseTokenIcon size="50px" name="MIM" /> MIM
              </div>
              <div class="mobile-info">
                <div>0.0</div>
                <div class="mobile-info-usd">$ 0.0</div>
              </div>
            </div>
          </div>
          <div class="mobile-network">
            <p>Network</p>
            <div class="item-network">
              <img
                class="network-icon"
                src="@/assets/images/networks/ethereum-icon.svg"
                alt=""
              />
              ETH
            </div>
          </div>
        </div>
        <div class="mobile-item">
          <p class="mobile-status">
            Status <span class="unclaimed">! unclaimed</span>
          </p>
          <div>
            <p class="mobile-title">Token</p>
            <div class="mobile-token">
              <div class="mobile-token-icon">
                <BaseTokenIcon size="50px" name="MIM" /> MIM
              </div>
              <div class="mobile-info">
                <div>0.0</div>
                <div class="mobile-info-usd">$ 0.0</div>
              </div>
            </div>
          </div>
          <div class="mobile-network">
            <p>Network</p>
            <div class="item-network">
              <img
                class="network-icon"
                src="@/assets/images/networks/ethereum-icon.svg"
                alt=""
              />
              ETH
            </div>
          </div>
        </div>
        <div class="mobile-item">
          <p class="mobile-status">
            Status <span class="unclaimed">! unclaimed</span>
          </p>
          <div>
            <p class="mobile-title">Token</p>
            <div class="mobile-token">
              <div class="mobile-token-icon">
                <BaseTokenIcon size="50px" name="MIM" /> MIM
              </div>
              <div class="mobile-info">
                <div>0.0</div>
                <div class="mobile-info-usd">$ 0.0</div>
              </div>
            </div>
          </div>
          <div class="mobile-network">
            <p>Network</p>
            <div class="item-network">
              <img
                class="network-icon"
                src="@/assets/images/networks/ethereum-icon.svg"
                alt=""
              />
              ETH
            </div>
          </div>
        </div>
      </template>

      <div class="table-claimed" v-if="false">
        <img
          class="claimed-img"
          src="@/assets/images/claim/coin.png"
          alt="Coin"
        />
        <p class="claimed-text">All tokens have been claimed</p>
      </div>
    </div>

    <div class="wrapper info-block">
      <!-- <h3 class="claim-title">Connected address affected</h3> -->
      <h3 class="claim-title" v-if="!account">Connect your wallet to check if you have been affected</h3>
      <h3 class="claim-title" v-else-if="!isApproveMasterContracts && account">Your Address is not affected</h3>
      <h3 class="claim-title" v-else>Your address may have been affected</h3>
      <template v-if="account">
        <div class="info info-claim" v-if="isApproveMasterContracts">
          <p class="info-text">Revoke Master Contract Approval</p>
          <img
            class="info-img"
            v-if="true"
            src="@/assets/images/claim/not-check.png"
            alt=""
          />
          <img
            class="info-img"
            v-else
            src="@/assets/images/claim/check.png"
            alt=""
          />
        </div>

        <div class="info info-claimed" v-else>
          <p class="info-text">MasterContract Approval revoked</p>
          <img
            class="info-img"
            v-if="false"
            src="@/assets/images/claim/not-check.png"
            alt=""
          />
          <img
            class="info-img"
            v-else
            src="@/assets/images/claim/check.png"
            alt=""
          />
        </div>

        <!-- <div class="info info-claim">
          <p class="info-text">Claim secured funds</p>
          <img
            class="info-img"
            v-if="true"
            src="@/assets/images/claim/not-check.png"
            alt=""
          />
          <img
            class="info-img"
            v-else
            src="@/assets/images/claim/check.png"
            alt=""
          />
        </div>
        <div class="info info-claimed">
          <p class="info-text">Connected address not affected</p>
          <img
            class="info-img"
            v-if="false"
            src="@/assets/images/claim/not-check.png"
            alt=""
          />
          <img
            class="info-img"
            v-else
            src="@/assets/images/claim/check.png"
            alt=""
          />
        </div>
        <div class="info info-claimed">
          <p class="info-text">MasterContract Approval revoked</p>
          <img
            class="info-img"
            v-if="false"
            src="@/assets/images/claim/not-check.png"
            alt=""
          />
          <img
            class="info-img"
            v-else
            src="@/assets/images/claim/check.png"
            alt=""
          />
        </div> -->
      </template>

      <div class="btn-wrap">
        <!-- <BaseButton primary @click="actionHandler" >{{ -->
        <BaseButton primary @click="actionHandler" :disabled="disabledBtn">{{
          btnText
        }}</BaseButton>
      </div>
    </div>

    <!-- <p class="claim-text">
      Read more about post mortem
      <a class="banner-link" href="#" target="_blank" rel="noopener noreferrer"
        >Here</a
      >
    </p> -->
  </div>
</template>

<script>
const NetworksList = () => import("@/components/ui/NetworksList");
const BaseTokenIcon = () => import("@/components/base/BaseTokenIcon");
const BaseButton = () => import("@/components/base/BaseButton");
import bg from "@/assets/images/claim/checkBg.png";
import degenBoxAbi from "@/utils/abi/degenBox.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      bg,
      activeNetworks: [1, 42161],
      mainnet: {
        id: 1,
        degen: "0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce",
        masterContract: [
          "0xb2EBF227188E44ac268565C73e0fCd82D4Bfb1E3",
          "0x43243F7BdDCb850acB687c42BBf5066c224054a5",
        ],
      },

      mainnetMasterContract: [
        // "0xb2EBF227188E44ac268565C73e0fCd82D4Bfb1E3",
        "0x43243F7BdDCb850acB687c42BBf5066c224054a5",
      ],

      aethMasterContract: ["0x303A59A1020807B6FD78D3BB0e3c8B6a26Bbc0B9"],

      degenContract: null,
      isApproveMasterContracts: false,
      gasLimitConst: 1000,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      userSigner: "getSigner",
      defaultProvider: "getProvider",
    }),

    btnText() {
      if (this.account) {
        return !this.isApproveMasterContracts
          ? "No further actions required"
          : "Revoke Contract";
      } else return "Connect wallet";
    },

    disabledBtn() {
      return this.btnText === "No further actions required" ? true : false;
    },

    contractProvider() {
      return this.userSigner ? this.userSigner : this.defaultProvider;
    },
  },

  methods: {
    async actionHandler() {
      if (!this.account) await this.$connectWallet();
      else {
        const arr =
          this.chainId === 1
            ? this.mainnetMasterContract
            : this.aethMasterContract;

        arr.forEach(async (masterContract) => {
          await this.revokeMasterContract(masterContract);
        });
      }
    },

    async revokeMasterContract(masterContract) {
      try {
        const estimateGas =
          await this.degenContract.estimateGas.setMasterContractApproval(
            this.account,
            masterContract,
            false,
            this.$ethers.utils.formatBytes32String(""),
            this.$ethers.utils.formatBytes32String(""),
            this.$ethers.utils.formatBytes32String("")
          );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        const tx = await this.degenContract.setMasterContractApproval(
          this.account,
          masterContract,
          false,
          this.$ethers.utils.formatBytes32String(""),
          this.$ethers.utils.formatBytes32String(""),
          this.$ethers.utils.formatBytes32String(""),
          { gasLimit }
        );

        const receipt = await tx.wait();
        return receipt;
      } catch (e) {
        console.log("approveMasterContract err:", masterContract);
        return false;
      }
    },
  },

  async created() {
    if (this.account && (this.chainId === 1 || this.chainId === 42161)) {
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
          this.account
        );

        const isApproveTwo = await this.degenContract.masterContractApproved(
          "0x43243F7BdDCb850acB687c42BBf5066c224054a5",
          this.account
        );

        this.isApproveMasterContracts = isApproveOne || isApproveTwo;
      }

      if (this.chainId === 42161) {
        const isApprove = await this.degenContract.masterContractApproved(
          "0x303A59A1020807B6FD78D3BB0e3c8B6a26Bbc0B9",
          this.account
        );

        this.isApproveMasterContracts = isApprove;
      }
    }
  },

  components: {
    NetworksList,
    BaseTokenIcon,
    BaseButton,
  },
};
</script>

<style lang="scss" scoped>
.claim-view {
  max-width: 780px;
  padding: 100px 0;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 23px;
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

.wrapper {
  background: #2a2835;
  backdrop-filter: blur(50px);
  border-radius: 30px;
  position: relative;
  padding: 28px 20px;
}

.claim-title {
  font-family: "Prompt";
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  text-align: center;
}

.claim-table,
.table-mobile {
  background: linear-gradient(
    92.26deg,
    rgba(254, 217, 85, 0.05) 0%,
    rgba(229, 67, 105, 0.05) 100%
  );
  border: 1px solid rgba(129, 128, 255, 0.2);
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.05);
  backdrop-filter: blur(50px);
  border-radius: 20px;
  padding: 14px 10px;
  position: relative;
}

.table-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-item {
  width: 100%;
  padding-left: 20px;
}

.table-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 20px 0;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.table-item {
  div {
    width: 100%;
  }
}

.item-status {
  font-weight: 600;
  font-size: 20px;
  line-height: 30px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #e54369;
}

.item-token {
  padding-left: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.token-info {
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  text-transform: uppercase;
}

.info-usd {
  font-size: 14px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.item-network {
  padding-left: 40px;
  display: flex;
  align-items: center;
}

.network-icon {
  margin-right: 5px;
  max-width: 18px;
}

.not-claimed {
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 60px 0 46px;
}

.table-claimed {
  position: absolute;
  background: rgba(64, 58, 92, 0.4);
  border: 1px solid #63ff7b;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(5px);
  border-radius: 20px;
  width: 96%;
  height: 96%;
  top: 2%;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}

.claimed-img {
  max-width: 56px;
  margin-bottom: 5px;
}

.claimed-text {
  text-align: center;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.table-mobile {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  letter-spacing: 0.025em;
  position: relative;
}

.mobile-item {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-status {
  display: flex;
  justify-content: space-between;
}

.mobile-title {
  margin-bottom: 12px;
}

.mobile-token {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-token-icon {
  display: flex;
  align-items: center;
}

.mobile-info {
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
}

.mobile-info-usd {
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 3px;
}

.mobile-network {
  display: flex;
  justify-content: space-between;
}

.unclaimed {
  font-weight: 600;
  font-size: 18px;
  line-height: 27px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #e54369;
}

.info-block {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info {
  max-width: 540px;
  width: 100%;
  margin: 0 auto;
  height: 40px;
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.info-text {
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  padding-left: 20px;
  position: relative;
}

.info-claim {
  background: rgba(229, 67, 105, 0.1);
  border: 1px solid #e54369;

  .info-text::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: #e54369;
    border-radius: 50%;
  }
}

.info-claimed {
  background: rgba(99, 255, 123, 0.1);
  border: 1px solid #63ff7b;

  .info-text::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 12px;
    height: 12px;
    background: #63ff7b;
    border-radius: 50%;
  }
}

.info-img {
  max-width: 24px;
}

.btn-wrap {
  max-width: 300px;
  margin: 0 auto;
}

.claim-text {
  text-align: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
}

.check-block {
  padding: 100px 0;
}

.check-content {
  max-width: 780px;
  margin: 0 auto;
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  min-height: 320px;
  padding: 90px 70px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

@media screen and (max-width: 768px) {
  .claim-view {
    margin: 0 5px;
  }

  .claim-title {
    font-size: 22px;
    line-height: 32px;
  }

  .check-content {
    margin: 0 10px;
  }
}

@media screen and (max-width: 600px) {
  .banner {
    flex-direction: column;
    gap: 10px;
  }

  .info-block {
    padding: 28px 10px;
  }

  .info-text {
    font-size: 16px;
  }

  .claim-table {
    display: none;
  }

  .table-mobile {
    display: flex;
  }

  .check-content {
    padding: 30px 15px;
    font-size: 18px;
  }
}

@media screen and (max-width: 375px) {
  .info-text {
    font-size: 13px;
  }

  .claim-title {
    font-size: 18px;
    line-height: 26px;
  }

  .not-claimed {
    font-size: 18px;
  }
}
</style>
