<template>
  <div class="claim-view">
    <div class="banner" v-if="isAffected">
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
          Follow the Steps to get back your secured funds.
        </p>
      </div>
      <img
        class="banner-img"
        src="@/assets/images/claim/skull.png"
        alt="Skull"
      />
    </div>

    <div class="wrapper" v-if="account">
      <h4>Check Both Chains</h4>
      <NetworksList :items="2" :activeList="activeNetworks" />
    </div>

    <h3 class="claim-title" v-if="false">
      Claimable funds on: Ethereum & Arbitrum
    </h3>

    <div class="claim-table" v-if="account">
      <div class="table-header">
        <div class="header-item">Status</div>
        <div class="header-item">Token</div>
        <div class="header-item">Network</div>
      </div>

      <div v-if="!tokensInfo" class="not-claimed">No tokens to be Claimed</div>

      <div class="table-item" v-for="token in tokensInfo" :key="token.name">
        <div class="item-status">
          <span class="mobile-status">Status</span>
          ! unclaimed
        </div>
        <div class="item-token">
          <p class="token-wrap">
            <BaseTokenIcon size="50px" :icon="token.img" />
            <span class="mobile-token">{{ token.name }}</span>
          </p>
          <div class="token-info">
            <div class="info token-info-name">{{ token.name }}</div>
            <div class="info">{{ formatTokenBalance(token.balance) }}</div>
            <div class="info-usd" v-if="!token.isNotBalanceUsd">
              {{ formatUSD(token.balanceUsd) }}
            </div>
          </div>
        </div>
        <div class="item-network">
          <span class="mobile-network">Network</span>
          <span class="network-wrap">
            <img class="network-icon" :src="token.networkImg" alt="" />
            {{ token.network }}</span
          >
        </div>
      </div>

      <div
        class="table-claimed"
        v-if="
          (!isClaimedEth && chainId === 1) ||
          (!isClaimedAeth && chainId === 42161)
        "
      >
        <img
          class="claimed-img"
          src="@/assets/images/claim/coin.png"
          alt="Coin"
        />
        <p class="claimed-text">{{ claimTokensText }}</p>
      </div>
    </div>

    <div class="wrapper info-block" v-if="isEthChain || isAETHChain">
      <h3 class="claim-title">{{ progressBlockTitle }}</h3>
      <template v-if="account">
        <div
          class="info info-claimed"
          v-if="!isApproveMasterContracts && isConnectedAddress"
        >
          <p class="info-text">Connected address not affected</p>
          <img class="info-img" src="@/assets/images/claim/check.png" alt="" />
        </div>
        <div
          class="info info-claim"
          :class="{ 'info-claimed': !isApproveMasterContracts }"
        >
          <p class="info-text">{{ isApprovalMasterContractText }}</p>
          <img
            class="info-img"
            v-if="isApproveMasterContracts"
            src="@/assets/images/claim/not-check.png"
            alt="Not check"
          />
          <img
            class="info-img"
            v-else
            src="@/assets/images/claim/check.png"
            alt="Check"
          />
        </div>
        <div
          class="info info-claim"
          :class="{ 'info-claimed': isConnectedAddress }"
        >
          <p class="info-text">{{ isClaimedText }}</p>
          <img
            class="info-img"
            v-if="!isConnectedAddress"
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
      </template>
      <div class="btn-wrap">
        <BaseButton primary @click="actionHandler" :disabled="disabledBtn">{{
          btnText
        }}</BaseButton>
      </div>
    </div>

    <p class="claim-text">
      Read more about post mortem
      <a
        class="banner-link"
        href="https://mirror.xyz/0x5744b051845B62D6f5B6Db095cc428bCbBBAc6F9/47LK6nUpMrVsYzfCYBTyZsc_7t5Sh5onxO8sSEotNMY"
        target="_blank"
        rel="noopener noreferrer"
        >Here</a
      >
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import degenBoxAbi from "@/utils/abi/degenBox.js";
import BaseButton from "@/components/base/BaseButton.vue";
import { tokensChainLink } from "@/utils/chainLink/config";
import NetworksList from "@/components/ui/NetworksList.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";
import { formatUSD, formatTokenBalance } from "@/helpers/filters";
import { getApprovalEncode } from "@/helpers/getRevokeApprovalSignature";
import { getTokenPriceByChain } from "@/helpers/prices/getTokenPriceByChain";

const ethPrivilegedMasterContract =
  "0xb2EBF227188E44ac268565C73e0fCd82D4Bfb1E3";
const ethCauldronV4MasterContract =
  "0x43243F7BdDCb850acB687c42BBf5066c224054a5";
const aethCauldronV4MasterContract =
  "0x303A59A1020807B6FD78D3BB0e3c8B6a26Bbc0B9";
const claimETHAddress = "0xfbCB80d7ec773F3711788643b8AF828Feb59cf9a";
const claimARBAddress = "0x83a4e315baaa0f26de83df29b6e2d0376817ecaf";
const crvAddress = "0xD533a949740bb3306d119CC777fa900bA034cd52";
const sGlpAddress = "0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf";
const aethMimAddress = "0xFEa7a6a0B346362BF88A9e4A88416B77a57D6c2A";
const ethMimAddress = "0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3";

import claimAbi from "@/utils/abi/tokensClaim";

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
      isApproveMasterContracts: false,
      gasLimitConst: 1000,
      crvBalance: null,
      crvBalanceUsd: 0,
      claimContract: null,
      sGlpBalance: null,
      sGlpBalanceUsd: 0,
      mimBalance: null,
      mimBalanceUsd: 0,
      isClaimed: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
      chainId: "getChainId",
      userSigner: "getSigner",
      defaultProvider: "getProvider",
    }),

    progressBlockTitle() {
      if (!this.account)
        return "Connect your wallet to check if you have been affected";
      if (!this.isApproveMasterContracts && this.account)
        return " Your Address is not affected";
      if (this.isApproveMasterContracts && this.isAffected)
        return " YOUR ADDRESS IS AFFECTED";
      return "Your address may have been affected";
    },

    isApprovalMasterContractText() {
      return this.isApproveMasterContracts
        ? "Revoke Master Contract Approval"
        : "MasterContract Approval revoked";
    },

    isClaimedText() {
      return !this.isConnectedAddress ? "Claim secured funds" : "Funds claimed";
    },

    tokensInfo() {
      if (this.isEthChain)
        return [
          {
            name: "CRV",
            img: this.$image("assets/images/tokens/CRV.png"),
            balance: this.crvBalance,
            balanceUsd: this.crvBalance * this.crvBalanceUsd,
            network: "ETH",
            networkImg: this.$image("assets/images/networks/ethereum-icon.svg"),
          },
          {
            name: "MIM",
            img: this.$image("assets/images/tokens/MIM.png"),
            balance: this.mimBalance,
            balanceUsd: this.mimBalance * this.mimBalanceUsd,
            network: "ETH",
            networkImg: this.$image("assets/images/networks/ethereum-icon.svg"),
          },
        ];

      if (this.isAETHChain)
        return [
          {
            name: "sGLP",
            img: this.$image("assets/images/tokens/GLP.png"),
            balance: this.sGlpBalance,
            balanceUsd: 0,
            isNotBalanceUsd: true,
            network: "AETH",
            networkImg: this.$image("assets/images/networks/arbitrum-icon.svg"),
          },
          {
            name: "MIM",
            img: this.$image("assets/images/tokens/MIM.png"),
            balance: this.mimBalance,
            balanceUsd: this.mimBalance * this.mimBalanceUsd,
            network: "AETH",
            networkImg: this.$image("assets/images/networks/arbitrum-icon.svg"),
          },
        ];

      return false;
    },

    claimTokensText() {
      if (this.isClaimed) return "All tokens have been claimed";
      return "No tokens to be Claimed";
    },

    btnText() {
      if (this.account) {
        if (this.isApproveMasterContracts && !this.isConnectedAddress)
          return "Revoke Contract & Claim Funds";

        if (this.isApproveMasterContracts) return "Revoke Contract";

        if (!this.isConnectedAddress) return "Claim Funds";

        return "No further actions required";
      } else return "Connect wallet";
    },

    disabledBtn() {
      return this.btnText === "No further actions required" ? true : false;
    },

    contractProvider() {
      return this.userSigner ? this.userSigner : this.defaultProvider;
    },

    isEthChain() {
      return this.chainId === 1;
    },

    isConnectedAddress() {
      if (this.isEthChain) return !this.isClaimedEth;
      else return !this.isClaimedAeth;
    },

    isClaimedEth() {
      return +this.crvBalance > 0 || +this.mimBalance > 0;
    },

    isAETHChain() {
      return this.chainId === 42161;
    },

    isClaimedAeth() {
      return +this.sGlpBalance > 0 || +this.mimBalance > 0;
    },

    isAffected() {
      return this.isClaimedAeth || this.isClaimedEth;
    },
  },

  methods: {
    formatUSD,
    formatTokenBalance,

    async actionHandler() {
      if (!this.account) await this.$openWeb3modal();
      else {
        if (this.isApproveMasterContracts) {
          const arr = this.isEthChain
            ? this.mainnetMasterContract
            : this.aethMasterContract;

          arr.forEach(async (masterContract) => {
            await this.revokeMasterContract(masterContract);
          });
        }

        if (this.isClaimedEth || this.isClaimedAeth) {
          this.claimContract.claim();
          return false;
        }
      }
    },

    async revokeMasterContract(masterContract) {
      let signature = {
        r: this.$ethers.utils.formatBytes32String(""),
        v: this.$ethers.utils.formatBytes32String(""),
        s: this.$ethers.utils.formatBytes32String(""),
      };
      if (masterContract === "0xb2EBF227188E44ac268565C73e0fCd82D4Bfb1E3") {
        signature = await getApprovalEncode(
          this.contractProvider,
          this.degenContract,
          this.account,
          this.chainId,
          masterContract
        );
      }
      try {
        const estimateGas =
          await this.degenContract.estimateGas.setMasterContractApproval(
            this.account,
            masterContract,
            false,
            signature.v,
            signature.r,
            signature.s
          );
        const gasLimit = this.gasLimitConst + +estimateGas.toString();
        const tx = await this.degenContract.setMasterContractApproval(
          this.account,
          masterContract,
          false,
          signature.v,
          signature.r,
          signature.s,
          { gasLimit }
        );
        const receipt = await tx.wait();
        return receipt;
      } catch (e) {
        console.log("approveMasterContract err:", masterContract);
        return false;
      }
    },

    async createDegenboxContract() {
      const degenboxAddress = this.isEthChain
        ? "0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce"
        : "0x7c8fef8ea9b1fe46a7689bfb8149341c90431d38";

      this.degenContract = await new this.$ethers.Contract(
        degenboxAddress,
        JSON.stringify(degenBoxAbi),
        this.contractProvider
      );
    },

    async isApproveMasterContractsEth() {
      const isApprovePrivilegedMasterContract =
        await this.degenContract.masterContractApproved(
          ethPrivilegedMasterContract,
          this.account
        );

      const isApproveCauldronV4MasterContract =
        await this.degenContract.masterContractApproved(
          ethCauldronV4MasterContract,
          this.account
        );

      this.isApproveMasterContracts =
        isApprovePrivilegedMasterContract || isApproveCauldronV4MasterContract;
    },

    async isApproveMasterContractsAeth() {
      this.isApproveMasterContracts =
        await this.degenContract.masterContractApproved(
          aethCauldronV4MasterContract,
          this.account
        );
    },

    async createEthClaimLogic() {
      await this.isApproveMasterContractsEth();

      this.claimContract = new this.$ethers.Contract(
        claimETHAddress,
        JSON.stringify(claimAbi),
        this.contractProvider
      );

      this.isClaimed = await this.claimContract.claimed(this.account);

      const crvBalance = await this.claimContract.amounts(
        this.account,
        crvAddress
      );

      this.crvBalance = this.$ethers.utils.formatUnits(crvBalance, 18);

      this.crvBalanceUsd = await getTokenPriceByChain(
        tokensChainLink.crv.chainId,
        tokensChainLink.crv.address
      );

      const mimBalance = await this.claimContract.amounts(
        this.account,
        ethMimAddress
      );

      this.mimBalance = this.$ethers.utils.formatUnits(mimBalance, 18);

      this.mimBalanceUsd = await getTokenPriceByChain(
        tokensChainLink.mim.chainId,
        tokensChainLink.mim.address
      );
    },

    async createAethClaimLogic() {
      await this.isApproveMasterContractsAeth();

      this.claimContract = new this.$ethers.Contract(
        claimARBAddress,
        JSON.stringify(claimAbi),
        this.contractProvider
      );

      this.isClaimed = await this.claimContract.claimed(this.account);

      const sGlpBalance = await this.claimContract.amounts(
        this.account,
        sGlpAddress
      );

      this.sGlpBalance = this.$ethers.utils.formatUnits(sGlpBalance, 18);

      const mimBalance = await this.claimContract.amounts(
        this.account,
        aethMimAddress
      );

      this.mimBalance = this.$ethers.utils.formatUnits(mimBalance, 18);

      this.mimBalanceUsd = await getTokenPriceByChain(
        tokensChainLink.mim.chainId,
        tokensChainLink.mim.address
      );
    },
  },

  async created() {
    if (this.account && (this.isEthChain || this.isAETHChain)) {
      await this.createDegenboxContract();
      if (this.isEthChain) await this.createEthClaimLogic();
      if (this.isAETHChain) await this.createAethClaimLogic();
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

.claim-table {
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
  background: rgba(64, 58, 92, 0.95);
  border: 1px solid #63ff7b;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  width: 96%;
  height: 90%;
  top: 5%;
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

.mobile-token {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-network {
  display: flex;
  justify-content: space-between;
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
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  height: 40px;
  padding: 10px;

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
  height: 40px;
  padding: 10px;

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

.mobile-status {
  display: none;
  color: #fff;
}

.mobile-token,
.mobile-network {
  display: none;
}

.network-wrap {
  display: flex;
  align-items: center;
}

@media screen and (max-width: 768px) {
  .claim-view {
    margin: 0 5px;
  }

  .claim-title {
    font-size: 22px;
    line-height: 32px;
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

  .table-header {
    display: none;
  }

  .table-item {
    flex-direction: column;
    gap: 16px;
    align-items: initial;

    font-weight: 600;
    font-size: 18px;
    line-height: 27px;

    div {
      width: initial;
    }
  }

  .item-status {
    display: flex;
    justify-content: space-between;
  }

  .mobile-status,
  .mobile-token {
    display: block;
  }

  .token-info-name {
    display: none;
  }

  .item-token {
    display: flex;
    justify-content: space-between;
    padding: 0;
  }

  .token-wrap {
    display: flex;
    align-items: center;
  }

  .token-info {
    width: initial;
  }

  .mobile-network {
    display: block;
  }

  .item-network {
    padding: 0;
    justify-content: space-between;
  }

  .info-usd {
    margin-top: 5px;
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
}
</style>
