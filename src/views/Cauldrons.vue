<template>
  <div class="cauldrons-page">
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
        <CauldronCard v-for="item in 3" :key="item" />
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
  },

  async created() {
    this.createCauldronsList();
  },

  beforeUnmount() {
    clearInterval(this.updateInterval);
  },

  components: {
    CauldronCard: defineAsyncComponent(() =>
      import("@/components/cauldrons/CauldronCard.vue")
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
  background: url("@/assets/images/cauldrons/background.png");
  background-repeat: no-repeat;
  background-size: cover;
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
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}
</style>
