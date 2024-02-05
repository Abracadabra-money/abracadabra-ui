<template>
  <div class="market-head-wrap">
    <div class="market-head">
      <div class="group-wrap">
        <TokenInfo :cauldron="cauldron" />
      </div>

      <div class="icons-wrap group-wrap">
        <IconButton v-if="isActiveChain" wallet @click="addCollateral" />
        <IconButton link tag-name="a" :href="cauldronScanUrl" target="_blank" />
      </div>

      <div class="group-wrap additional-wrap">
        <BaseLink
          v-if="strategyLink"
          :href="strategyLink"
          target="_blank"
          text="DEGENBOX"
        />

        <BaseLink
          v-if="tokenLinkData"
          :href="tokenLinkData.href"
          target="_blank"
          :text="tokenLinkData.label"
          :icon="tokenLinkData.icon"
        />

        <DepositButton :cauldron="cauldron" v-if="isActiveChain" />

        <ClaimButton :cauldron="cauldron" v-if="isActiveChain" />
      </div>

      <div class="info-wrap group-wrap">
        <InfoButton
          title="TMB"
          tooltip="Total MIM Borrowed."
          :value="totalMimBorrowed"
        />
        <InfoButton
          title="TVL"
          tooltip="Total Value Locked."
          :value="totalValueLocked"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { utils } from "ethers";
import { mapGetters } from "vuex";
import { defineAsyncComponent } from "vue";
import { chainsList } from "@/helpers/chains";
import { formatLargeSum } from "@/helpers/filters";
import { getTokenLinkData } from "@/helpers/getTokenLinkData";

export default {
  props: {
    cauldron: {
      type: Object as any,
    },
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
    }),

    strategyLink() {
      return this.cauldron.config.cauldronSettings.strategyLink;
    },

    tokenLinkData(): any {
      return getTokenLinkData(
        this.cauldron.config.id,
        this.cauldron.config.chainId
      );
    },

    totalMimBorrowed() {
      return formatLargeSum(
        utils.formatUnits(this.cauldron.mainParams.totalBorrowed)
      );
    },

    totalValueLocked() {
      return formatLargeSum(utils.formatUnits(this.cauldron.mainParams.tvl));
    },

    cauldronScanUrl() {
      return `${
        chainsList[this.cauldron.config.chainId as keyof typeof chainsList]
          .blockExplorers.etherscan.url
      }/address/${this.cauldron.config.contract.address}`;
    },

    isActiveChain() {
      return this.chainId === this.cauldron.config.chainId;
    },
  },

  methods: {
    async addCollateral() {
      const { ethereum }: any = window;
      const { collateralInfo, icon } = this.cauldron.config;

      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20", // Initially only supports ERC20, but eventually more!
            options: {
              address: collateralInfo.address, // The address that the token is at.
              symbol: collateralInfo.name, // A ticker symbol or shorthand, up to 5 chars.
              decimals: collateralInfo.decimals, // The number of decimals in the token
              image: icon, // A string url of the token logo
            },
          },
        });
      } catch (error) {
        console.log("Add collateral token error:", error);
      }
    },
  },

  components: {
    TokenInfo: defineAsyncComponent(
      () => import("@/components/market/TokenInfo.vue")
    ),
    IconButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/IconButton.vue")
    ),
    BaseLink: defineAsyncComponent(
      () => import("@/components/ui/links/BaseLink.vue")
    ),
    InfoButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/InfoButton.vue")
    ),
    DepositButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/DepositButton.vue")
    ),
    ClaimButton: defineAsyncComponent(
      () => import("@/components/ui/buttons/ClaimButton.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.market-head-wrap {
  background: linear-gradient(
    90deg,
    rgba(45, 74, 150, 0.07) 0%,
    rgba(116, 92, 210, 0.07) 100%
  );
  backdrop-filter: blur(10.75px);
}

.market-head {
  max-width: 1310px;
  width: 100%;
  padding: 8px 15px;
  margin: 0 auto;
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
}

.token-info-wrap {
  margin-right: 16px;
}

.info-wrap {
  margin-left: auto;
}

.group-wrap {
  display: flex;
  gap: 8px;
  align-items: center;
}

@media screen and (max-width: 1024px) {
  .market-head {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .info-wrap {
    margin-left: 0;
  }
}

@media screen and (max-width: 860px) {
  .market-head {
    gap: 12px;
  }
  .icons-wrap {
    order: 1;
  }

  .info-wrap {
    order: 2;
  }

  .additional-wrap {
    order: 3;
  }
}

@media screen and (max-width: 640px) {
  .icons-wrap {
    margin-left: auto;
  }
}
</style>
