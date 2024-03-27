<template>
  <div class="my-points-view">
    <div class="my-points-wrapper">
      <div class="row head-row">
        <div class="btns-wrap">
          <h3 class="title">Points Dashboard</h3>
          <h4 class="subtitle">
            Track your Blast, Potion and Gold points earned by taking part in
            the Abracadabra Ecosystem.
          </h4>
          <div class="links-wrap">
            <BaseButton class="btn" @click="goToPool">MIM/USDB Pool</BaseButton>
            <BaseButton class="btn" @click="goToSwap">Swap</BaseButton>
          </div>
        </div>

        <CardPointsPending
          :distributionAmount="userPointsStatistics?.liquidityPoints?.total?.finalized ?? 0"
          :pendingDistributionAmount="userPointsStatistics?.liquidityPoints?.total?.pending ?? 0"
        />
      </div>

      <div class="banner">
        <div class="description">
          <img class="blast-icon" src="@/assets/images/networks/blast.png" />
          <div>
            <h3 class="description-title">Build on Blast</h3>
            <h4 class="description-subtitle">
              Native Yield & Airdrops included
            </h4>
          </div>
        </div>

        <div class="totals-wrap">
          <div class="total-item">
            <span class="total-title">Total Points Distributed</span>
            <span class="total-value">{{
              formatTokenBalance(pointsStatistics?.liquidityPoints?.total?.finalized ?? 0)
            }}</span>
          </div>
          <div class="total-item">
            <span class="total-title">Total Gold Distributed</span>
            <span class="total-value">{{ formatTokenBalance(0) }}</span>
          </div>
        </div>
      </div>

      <div class="row card-info-row">
        <CardPointsInfo :pointsInfo="cauldronPointsInfo" />
        <CardPointsInfo
          :pointsInfo="llePointsInfo"
          :withdrawLogic="true"
          @showWithdrawPopup="showWithdrawPopup = true"
        />
        <CardPointsInfo :pointsInfo="goldPointsInfo" />
      </div>
    </div>

    <WlpWithdrawPopup
      :balances="stakeLpBalances"
      :poolInfo="poolInfo"
      @close="showWithdrawPopup = false"
      @updateInfo="updateBalances"
      v-if="showWithdrawPopup"
    />
  </div>
</template>

<script lang="ts">
import {
  fetchPointsStatistics,
  fetchUserPointsStatistics,
} from "@/helpers/blast/stake/points";
import { formatUnits } from "viem";
import { providers } from "ethers";
import { defineAsyncComponent } from "vue";
import { useImage } from "@/helpers/useImage";
import { defaultRpc } from "@/helpers/chains";
import { formatTokenBalance } from "@/helpers/filters";
import { getPoolInfo } from "@/helpers/pools/getPoolInfo";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { getPublicClient } from "@/helpers/getPublicClient";
import { getCauldronInfo } from "@/helpers/cauldron/getCauldronInfo";
import BlastLockingMultiRewardsAbi from "@/abis/BlastLockingMultiRewards";
import { BlastLockingMultiRewards } from "@/constants/blast";

const BLAST_CHAIN_ID = 81457;
const MIM_USDB_POOL_ID = 1;

export default {
  data() {
    return {
      pointsStatistics: null,
      userPointsStatistics: null,
      poolInfo: null as any,
      cauldronInfo: null as any,
      stakeLpBalances: {
        balance: 0n,
        locked: 0n,
        unlocked: 0n,
      } as any,
      updateInterval: null as any,
      updateIntervalStatistics: null as any,
      showWithdrawPopup: false as any,
    };
  },

  computed: {
    ...mapGetters({
      chainId: "getChainId",
      account: "getAccount",
      signer: "getSigner",
    }),

    cauldronPointsInfo() {
      return {
        chainId: BLAST_CHAIN_ID,
        label: "Cauldron User",
        title: "WETH cauldron",
        subtitle: "Deposited WETH into Cauldron",
        icon: useImage("assets/images/tokens/WETH.png"),
        deposited: this.cauldronInfo?.userPosition?.collateralDeposited || 0,
        depositedUsd:
          this.cauldronInfo?.userPosition?.collateralDepositedUsd || 0,
        distributionAmount: this.userPointsStatistics?.liquidityPoints?.cauldron?.finalized ?? 0,
        pendingDistributionAmount: this.userPointsStatistics?.liquidityPoints?.cauldron?.pending ?? 0,
      };
    },

    llePointsInfo() {
      const deposited = +formatUnits(
        this.stakeLpBalances.unlocked || 0n,
        this.poolInfo?.decimals || 18
      );

      const depositedUsd = deposited * this.poolInfo?.price || 0;

      return {
        chainId: BLAST_CHAIN_ID,
        label: "Liquidity Provider",
        title: "MIM / USDB Pool",
        subtitle: "Staking Liquidity in Pool",
        icon: useImage("assets/images/tokens/MIM-USDB.png"),
        deposited,
        depositedUsd,
        distributionAmount: this.userPointsStatistics?.liquidityPoints?.lp?.finalized ?? 0,
        pendingDistributionAmount: this.userPointsStatistics?.liquidityPoints?.lp?.pending ?? 0,
      };
    },

    goldPointsInfo() {
      const deposited = +formatUnits(
        this.stakeLpBalances.locked || 0n,
        this.poolInfo?.decimals || 18
      );

      const depositedUsd = deposited * this.poolInfo?.price || 0;

      return {
        chainId: BLAST_CHAIN_ID,
        isGold: true,
        label: "Founder Boost",
        title: "MIM / USDB Pool",
        subtitle: "Receive 20% of total ecosystem points",
        icon: useImage("assets/images/tokens/MIM-USDB.png"),
        deposited,
        depositedUsd,
        distributionAmount: this.userPointsStatistics?.liquidityPoints?.founder?.finalized ?? 0,
        pendingDistributionAmount: this.userPointsStatistics?.liquidityPoints?.founder?.pending ?? 0,
      };
    },
  },

  watch: {
    async account() {
      await this.createActivityInfo();
    },

    async chainId() {
      await this.createActivityInfo();
    },
  },

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),
    formatTokenBalance,

    goToPool() {
      this.$router.push({
        name: "Pool",
        params: { id: MIM_USDB_POOL_ID, poolChainId: BLAST_CHAIN_ID },
      });
    },

    goToSwap() {
      this.$router.push({ name: "MimSwap" });
    },

    async getStakeLpBalance() {
      const publicClient = getPublicClient(this.chainId);

      const [balance, locked, unlocked] = await publicClient.multicall({
        contracts: [
          {
            address: BlastLockingMultiRewards,
            // @ts-ignore
            abi: BlastLockingMultiRewardsAbi,
            functionName: "balanceOf",
            args: [this.account],
          },
          {
            address: BlastLockingMultiRewards,
            // @ts-ignore
            abi: BlastLockingMultiRewardsAbi,
            functionName: "locked",
            args: [this.account],
          },
          {
            address: BlastLockingMultiRewards,
            // @ts-ignore
            abi: BlastLockingMultiRewardsAbi,
            functionName: "unlocked",
            args: [this.account],
          },
        ],
      });

      return {
        balance: balance.result,
        locked: locked.result,
        unlocked: unlocked.result,
      };
    },

    async updateBalances() {
      this.stakeLpBalances = await this.getStakeLpBalance();
    },

    // TODO: refactor
    async createActivityInfo() {
      this.stakeLpBalances = await this.getStakeLpBalance();

      this.poolInfo = await getPoolInfo(
        BLAST_CHAIN_ID,
        MIM_USDB_POOL_ID,
        this.account
      );

      const currentRpc = defaultRpc[BLAST_CHAIN_ID as keyof typeof defaultRpc];

      const chainProvider = new providers.StaticJsonRpcProvider(currentRpc);

      const userSigner =
        this.account && this.chainId === BLAST_CHAIN_ID
          ? this.signer
          : chainProvider;

      this.cauldronInfo = await getCauldronInfo(
        MIM_USDB_POOL_ID,
        BLAST_CHAIN_ID,
        chainProvider,
        userSigner
      );
    },

    async fetchStatistics() {
      [this.pointsStatistics, this.userPointsStatistics] = await Promise.all([
        fetchPointsStatistics(),
        fetchUserPointsStatistics(this.account),
      ]);
    },
  },

  async created() {
    await this.createActivityInfo();
    await this.fetchStatistics();

    this.updateInterval = setInterval(async () => {
      await this.createActivityInfo();
    }, 30000);

    this.updateIntervalStatistics = setInterval(async () => {
      await this.fetchStatistics();
    }, 60000);
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
    clearInterval(this.updateIntervalStatistics);
  },

  components: {
    BaseButton: defineAsyncComponent(
      () => import("@/components/base/BaseButton.vue")
    ),
    CardPointsPending: defineAsyncComponent(
      () => import("@/components/ui/card/CardPointsPending.vue")
    ),
    CardPointsInfo: defineAsyncComponent(
      () => import("@/components/ui/card/CardPointsInfo.vue")
    ),
    WlpWithdrawPopup: defineAsyncComponent(
      () => import("@/components/blastOnboarding/WlpWithdrawPopup.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.tooltip-container {
  width: 100%;
}

.my-points-view {
  padding: 124px 0 60px;
  min-height: 100vh;
  width: 100%;
  position: relative;
}

.my-points-wrapper {
  max-width: 1310px;
  width: 100%;
  padding: 0 15px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.row,
.links-wrap {
  gap: 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.links-wrap {
  max-width: 426px;
}

.btns-wrap {
  width: 100%;
  min-width: 337px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  line-height: normal;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 47px;
}

.banner {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.description {
  position: absolute;
  left: 0;
  top: 0;
  width: 45%;
  gap: 8px;
  display: flex;
  align-items: center;
  color: #000;
  background: #fcfd02;
  height: 74px;
  padding: 13px 26px;
}

.blast-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.description-title {
  font-size: 24px;
  font-weight: 600;
  line-height: 30px;
  text-transform: uppercase;
}

.description-subtitle {
  font-size: 16px;
  font-weight: 500;
  line-height: 16px;
}

.grid-img {
  display: none;
}

.totals-wrap {
  padding: 4px 24px 4px 0;
  margin-left: -1px;
  min-width: 720px;
  height: 74px;
  background-image: url("@/assets/images/points-dashboard/baner-bg.png");
  background-size: cover;
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background-position: 0 center;
  justify-content: space-between;
}

.total-item {
  gap: 30px;
  display: flex;
  align-items: center;
}

.total-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 150%;
  width: 190px;
}

.total-value {
  font-size: 26px;
  font-weight: 600;
  line-height: 100%;
  min-width: 200px;
  text-align: end;
}

@media screen and (max-width: 1024px) {
  .head-row {
    flex-direction: column;
    gap: 24px;

    .row {
      justify-content: center;
      gap: 24px;
    }
  }

  .card-info-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media screen and (max-width: 900px) {
  .banner {
    flex-direction: column;
  }

  .description {
    position: inherit;
    width: 100%;
    margin-bottom: 8px;
  }

  .grid-img {
    display: block;
    width: 100%;
    height: 25px;
    object-fit: cover;
  }

  .totals-wrap {
    width: 100%;
    background: transparent;
    padding: 0;
    height: auto;
    gap: 8px;
    min-width: initial;
  }

  .total-item {
    background: #fcfd02;

    width: 100%;
    padding: 13px 16px;
    justify-content: space-between;
  }
}

@media screen and (max-width: 600px) {
  .my-points-wrapper {
    gap: 16px;
  }

  .row {
    gap: 16px;
    flex-direction: column;
  }

  .head-row {
    .row {
      gap: 12px;
    }
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
    margin-bottom: 16px;
  }

  .card-info-row {
    grid-template-columns: 1fr;
  }

  .description {
    padding: 13px;
    justify-content: center;
  }

  .description-title {
    font-size: 20px;
  }

  .description-subtitle {
    font-size: 14px;
  }

  .total-item {
    gap: 6px;
    padding: 13px;
  }

  .total-title {
    font-size: 14px;
    width: auto;
  }

  .total-value {
    font-size: 20px;
    min-width: initial;
  }
}
</style>
