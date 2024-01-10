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
          <img
            class="mim-icon"
            src="@/assets/images/PixelMIM.svg"
            alt="Mim icon"
          />
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
import { defineAsyncComponent } from "vue";
import { getMarketList } from "@/helpers/cauldron/lists/getMarketList";
import { getCollateralApr } from "@/helpers/collateralsApy";

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

    async getCollateralsApr() {
      this.cauldrons = await Promise.all(
        this.cauldrons.map(async (cauldron) => {
          const apr = await getCollateralApr(cauldron);
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
.cauldrons-page {
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
@media screen and (max-width: 600px) {
  .cauldrons-container {
    padding: 100px 12px 60px;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    align-items: flex-start;
    font-size: 14px;
  }

  .mim-icon {
    width: 16px;
    height: 16px;
  }
}
</style>
