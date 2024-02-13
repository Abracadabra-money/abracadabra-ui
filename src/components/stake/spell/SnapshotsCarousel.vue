<template>
  <div class="carousel-wrap">
    <h3 class="title">Governance Proposals</h3>
    <Carousel :wrap-around="true" :transition="500" :autoplay="100000">
      <slide :index="1" v-for="data in proposalsData" :key="data.id">
        <CarouselSlide :data="data" />
      </slide>

      <template #addons>
        <pagination />
      </template>
    </Carousel>
  </div>
</template>

<script lang="ts">
import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination } from "vue3-carousel";
// @ts-ignore
import { fetchProposals } from "@/helpers/snapshot/fetchProposals";
import { defineAsyncComponent } from "vue";

export default {
  data(): any {
    return {
      proposalsData: [],
    };
  },

  async created() {
    // this.proposalsData = await fetchProposals();
    this.proposalsData = [
      {
        id: "0x9fa35cbadc33e796c0ddba6d931734fa1d21789a832599694c75a54c340931e1",
        title: "AIP #44: Constitute a Depeg Contingency Fund",
        body: "Tl;dr: Constitute a Depeg Contingency Fund (DCF), coming initially from the DAO’s SPELL emissions budget and later on from other sources of revenue of the DAO, to step in and improve MIM peg and collateralisation in situations of extreme stress.\n\n📖 Read more on the proposal: https://forum.abracadabra.money/t/aip-44-constitute-a-depeg-contingency-fund/4464",
        choices: ["Yes, Approve the DCF", "No, Do Not Approve the DCF"],
        start: 1707318000,
        end: 1707577200,
        snapshot: "19176410",
        state: "closed",
        author: "0x5EeDA5BDF0A647a7089329428009eCc9CB9451cc",
        space: {
          id: "abracadabrabymerlinthemagician.eth",
          name: "Magic Internet Money",
        },
      },
      {
        id: "0x34e25dcfcfa50e574cc322c430efdb21c7a502cd8b97e2f27fd92f9448375522",
        title: "SAIP #43: Add a WBTC and WETH Market",
        body: "Tl;dr: Add a new BTC and WETH market on Arbitrum, to allow market makers to borrow MIM and pair it with USDT and USDC to improve liquidity for MIM on chain.\n\nBoth Market Parameters:\n\nInterest: 6%\n\nBorrow Fee: 0.25%\n\nMCR: 80%\n\nLiquidation Fee: 6%\n\nInitial top up of 1 m $MIMs each, with the possibility of scaling up to 3m depending on volumes and liquidity without further votes.",
        choices: [
          "Yes, Launch the Cauldrons",
          "No, Do not launch the Cauldrons",
        ],
        start: 1706202000,
        end: 1706288400,
        snapshot: "19084909",
        state: "closed",
        author: "0x941ec857134B13c255d6EBEeD1623b1904378De9",
        space: {
          id: "abracadabrabymerlinthemagician.eth",
          name: "Magic Internet Money",
        },
      },
      {
        id: "0x1e020123441e04b423c2857bb612f13534b2468451186b300bb32c4e6e90b497",
        title: "SAIP #39: DWF Labs $MIM Loan and Market Making Proposal",
        body: "Tl;dr Provide 100k MIM to the DAO Market Makers, coming from the DAO treasury to deepen MIM liquidity on CEXs.\n\n📖 Read more on the proposal: https://forum.abracadabra.money/t/saip-39-dwf-labs-mim-loan-and-market-making-proposal/4452",
        choices: [
          "Yes, Approve the proposal",
          "No, Do Not Approve the proposal",
        ],
        start: 1706281200,
        end: 1706540400,
        snapshot: "19083326",
        state: "closed",
        author: "0x5EeDA5BDF0A647a7089329428009eCc9CB9451cc",
        space: {
          id: "abracadabrabymerlinthemagician.eth",
          name: "Magic Internet Money",
        },
      },
      {
        id: "0x69fe0da47278245b5b36b02f969ea1d00f5733c8f37706fbe5a44cce42c7bb35",
        title: "SAIP #38: Voting for GMX as LTIP Council Candidate",
        body: "tl;dr Vote with treasury ARB in favour of GMX as LTIP Council Candidate\n\n📖 Read more on the proposal: https://forum.abracadabra.money/t/saip-38-voting-for-gmx-as-ltip-council-candidate/4450",
        choices: ["Yes, Vote for GMX", "No, Do Not vote for GMX"],
        start: 1705590000,
        end: 1705676400,
        snapshot: "19028970",
        state: "closed",
        author: "0x5EeDA5BDF0A647a7089329428009eCc9CB9451cc",
        space: {
          id: "abracadabrabymerlinthemagician.eth",
          name: "Magic Internet Money",
        },
      },
      {
        id: "0xef9932b1c8ba96aafe32fbd0d052310106f7a02c43aaf1124f081275e51e699e",
        title:
          "SAIP #37: Voting for Jojo and Castle Capital as LTIP Advisor Candidates",
        body: "tl;dr Vote with treasury ARB in favour of JoJo and Castle Capital as LTIP Advisor Candidates\n\n📖 Read more on the proposal: https://forum.abracadabra.money/t/saip-37-voting-for-jojo-and-castle-capital-as-ltip-advisor-candidate/4449",
        choices: [
          "Yes Vote for both",
          "No, Vote only for JoJo",
          "No, Vote only for Castle Capital",
          "No, Abstain ",
        ],
        start: 1705590000,
        end: 1705676400,
        snapshot: "19026467",
        state: "closed",
        author: "0x5EeDA5BDF0A647a7089329428009eCc9CB9451cc",
        space: {
          id: "abracadabrabymerlinthemagician.eth",
          name: "Magic Internet Money",
        },
      },
    ];
  },

  components: {
    Slide,
    Carousel,
    Pagination,
    CarouselSlide: defineAsyncComponent(
      () => import("@/components/stake/spell/CarouselSlide.vue")
    ),
  },
};
</script>

<style lang="scss" scoped>
.carousel-wrap {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #00296b;
  background: linear-gradient(
    146deg,
    rgba(0, 10, 35, 0.07) 0%,
    rgba(0, 80, 156, 0.07) 101.49%
  );
  box-shadow: 0px 4px 32px 0px rgba(103, 103, 103, 0.14);
  backdrop-filter: blur(12.5px);
}

.title {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.45px;
  margin-bottom: 18px;
}

.carousel {
  width: 100%;
}

.carousel::v-deep(.carousel__slide) {
  padding: 0 8px;
}

.carousel::v-deep(.carousel__pagination-button::after) {
  width: 10px;
  height: 10px;
  border-radius: 6px;
  background-color: rgba(112, 136, 204, 0.4);
}

.carousel::v-deep(.carousel__pagination-button--active::after) {
  transform: scale(1.4);
  background-color: #7088cc;
}

@media screen and (max-width: 600px) {
  .carousel-wrap {
    padding: 12px;
  }
}
</style>
