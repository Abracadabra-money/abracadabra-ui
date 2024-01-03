<template>
  <div class="cauldrons-page">
    <img class="bg-top" src="@/assets/images/cauldrons/bg-top.png" alt="" />
    <img
      class="bg-bottom"
      src="@/assets/images/cauldrons/bg-bottom.png"
      alt=""
    />
    <div class="cauldrons-container">
      <div class="text-wrap">
        <h3 class="title">Available Cauldrons</h3>
        <h4 class="subtitle">
          Use your favourite assets as collateral to borrow
        </h4>
        <h4 class="subtitle">
          <img class="mim-icon" src="@/assets/images/PixelMIM.svg" alt="" />
          Magic Internet Money, a leading decentralised and collateral-backed
          stablecoin.
        </h4>
      </div>
      <div class="cards-wrap">
        <CamelotCard />
        <EmpowerCard />
        <CamelotUsdcMimCard />
      </div>

      <CauldronsTable
        :cauldrons="cauldrons"
        :cauldronsLoading="cauldronsLoading"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { providers } from "ethers";
import filters from "@/filters/index.js";
import { defineAsyncComponent } from "vue";
import { defaultRpc } from "@/helpers/chains";
import { getMarketList } from "@/helpers/cauldron/lists/getMarketList";
import { isApyCalcExist, fetchTokenApy } from "@/helpers/collateralsApy";
import { getMaxLeverageMultiplier } from "@/helpers/cauldron/getMaxLeverageMultiplier.ts";

const APR_KEY = "abracadabraCauldronsApr";

export default {
  data() {
    return {
      cauldrons: [],
      cauldronsLoading: true,
      updateInterval: null,
    };
  },

  computed: {
    ...mapGetters({
      account: "getAccount",
    }),
  },

  methods: {
    async createCauldronsList() {
      this.cauldrons = await getMarketList(this.account);
      this.cauldronsLoading = false;
      this.updateInterval = setInterval(
        await getMarketList(this.account),
        60000
      );
    },

    async fetchCollateralApy(cauldron, chainId, address) {
      const provider = new providers.StaticJsonRpcProvider(defaultRpc[chainId]);

      const apr = await fetchTokenApy(cauldron, chainId, provider);

      const localData = localStorage.getItem("abracadabraCauldronsApr");
      const parsedData = localData ? JSON.parse(localData) : {};

      parsedData[address] = {
        chainId,
        apr: Number(filters.formatToFixed(apr, 2)),
        createdAt: new Date().getTime(),
      };

      localStorage.setItem(APR_KEY, JSON.stringify(parsedData));

      return filters.formatToFixed(apr, 2);
    },

    timeHasPassed(localData, address) {
      if (!localData) return true;
      if (!localData[address]) return true;

      const allowedTime = 5;
      const { createdAt } = localData[address];
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - createdAt;
      const minutes = Math.floor(timeDiff / 1000 / 60);
      return minutes > allowedTime;
    },

    async getCollateralApr(cauldron) {
      const { chainId, id, contract } = cauldron.config;
      const isApyExist = isApyCalcExist(chainId, id);

      if (isApyExist) {
        const localApr = localStorage.getItem("abracadabraCauldronsApr");
        const parseLocalApr = localApr ? JSON.parse(localApr) : null;

        const isOutdated = this.timeHasPassed(parseLocalApr, contract.address);
        const collateralApy = !isOutdated
          ? parseLocalApr[contract.address].apr
          : await this.fetchCollateralApy(cauldron, chainId, contract.address);

        const multiplier = getMaxLeverageMultiplier(cauldron);

        return { value: collateralApy, multiplier };
      } else return { value: 0, multiplier: 0 };
    },

    async getCollateralsApr() {
      this.cauldrons = await Promise.all(
        this.cauldrons.map(async (cauldron) => {
          const apr = await this.getCollateralApr(cauldron);
          cauldron.apr = apr;
          return cauldron;
        })
      );
    },
  },

  async created() {
    await this.createCauldronsList();
    await this.getCollateralsApr();
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    CamelotCard: defineAsyncComponent(() =>
      import("@/components/cauldrons/CamelotCard.vue")
    ),
    EmpowerCard: defineAsyncComponent(() =>
      import("@/components/cauldrons/EmpowerCard.vue")
    ),
    CamelotUsdcMimCard: defineAsyncComponent(() =>
      import("@/components/cauldrons/CamelotUsdcMimCard.vue")
    ),
    CauldronsTable: defineAsyncComponent(() =>
      import("@/components/cauldrons/CauldronsTable.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

.cauldrons-page {
  @include font;
  min-height: 100vh;
  width: 100%;
  height: 100%;
  background: url("@/assets/images/cauldrons/background.svg");
  background-repeat: no-repeat;
  background-size: cover;
}

.bg-top {
  position: absolute;
  top: 118px;
  left: 0;
}

.bg-bottom {
  position: absolute;
  top: 85vh;
  right: 70px;
}

.cauldrons-container {
  padding: 125px 15px 100px;
  max-width: 1310px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  line-height: 150%;
}

.subtitle {
  display: flex;
  gap: 4px;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  line-height: 150%;
}

.mim-icon {
  width: 24px;
  height: 24px;
}

.cards-wrap {
  display: grid;
  gap: 16px;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
}

@media screen and (max-width: 1024px) {
  .cards-wrap {
    grid-template-columns: 1fr;
    width: 100%;
  }
}
</style>
