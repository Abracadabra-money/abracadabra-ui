<template>
  <div class="my-points-view">
    <div class="my-points-wrapper">
      <div class="row">
        <div class="btns-wrap">
          <h3 class="title">My points</h3>
          <h4 class="subtitle">Manage your positions</h4>
          <div class="row">
            <BaseButton class="btn" @click="console.log('')"
              >MIM/USDB Pool</BaseButton
            >
            <BaseButton class="btn" @click="console.log('')"
              >MIMSwap</BaseButton
            >
          </div>
        </div>

        <CardPointsPending />
        <CardPointsPending />
      </div>

      <div class="banner">
        <div class="description">
          <img class="blast-icon" src="@/assets/images/networks/blast.png" />
          <div>
            <h3 class="description-title">Abracadabra blast</h3>
            <h4 class="description-subtitle">
              Use your favourite assets as collateral to borrow
            </h4>
          </div>
        </div>

        <div class="totals-wrap">
          <div class="total-item">
            <span class="total-title">Total Points Distributed</span>
            <span class="total-value">10,000,000.00</span>
          </div>
          <div class="total-item">
            <span class="total-title">Total Gold Distributed</span>
            <span class="total-value">10,000,000.00</span>
          </div>
        </div>
      </div>

      <div class="row">
        <CardPointsInfo
          v-for="pointsInfo in pointsInfoArr"
          :key="pointsInfo.label"
          :pointsInfo="pointsInfo"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useImage } from "@/helpers/useImage";
import { defineAsyncComponent } from "vue";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      pointsInfoArr: [
        {
          label: "Minter",
          title: "WETH cauldron",
          subtitle: "Deposited WETH into Cauldron",
          icon: useImage("assets/images/tokens/WETH.png"),
          deposited: {
            value: 410.0,
            icon: useImage("assets/images/tokens/WETH.png"),
          },
          list: [
            {
              title: "Points Earned",
              value: {
                amount: 220395,
                price: "$200,000",
              },
            },
            {
              title: "Points Pending",
              value: 410.0,
            },
          ],
        },
        {
          label: "Lp’er",
          title: "MIM / USDB Pool",
          subtitle: "Added liquidity into pool",
          icon: useImage("assets/images/tokens/MIM-USDB.png"),
          deposited: {
            value: 410.0,
          },
          list: [
            {
              title: "Points Earned",
              value: {
                amount: 220395,
                price: "$200,000",
              },
            },
            {
              title: "Points Pending",
              value: 410.0,
            },
          ],
        },
        {
          gold: true,
          label: "Founder buff",
          title: "MIM / USDB Pool",
          subtitle: "Added liquidity into pool",
          icon: useImage("assets/images/tokens/MIM-USDB.png"),
          deposited: {
            value: 410.0,
          },
          list: [
            {
              title: "Points Earned",
              value: {
                amount: 220395,
                price: "$200,000",
              },
            },
            {
              title: "Points Pending",
              value: 410.0,
            },
          ],
        },
      ],
    };
  },

  computed: {
    ...mapGetters({ chainId: "getChainId", account: "getAccount" }),
  },

  watch: {},

  methods: {
    ...mapActions({ createNotification: "notifications/new" }),
    ...mapMutations({ deleteNotification: "notifications/delete" }),
  },

  async created() {},

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
  },
};
</script>

<style lang="scss" scoped>
.my-points-view {
  padding: 124px 0;

  min-height: 100vh;
  width: 100%;
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

.row {
  gap: 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.btns-wrap {
  max-width: 427px;
  width: 100%;
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
  margin-bottom: 12px;
}

.banner {
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.description {
  width: 100%;
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

.totals-wrap {
  padding: 4px 24px 4px 0;
  margin-left: -1px;
  width: 110%;
  height: 74px;
  background-image: url("@/assets/images/myPoints/baner-bg.png");
  background-size: cover;
  color: #000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background-position: 0 center;
  justify-content: space-between;
}

.total-item {
  gap: 46px;
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
}

@media screen and (max-width: 600px) {
  .my-points-wrapper {
    gap: 16px;
  }

  .row {
    gap: 16px;
    flex-direction: column;
  }

  .banner {
    flex-direction: column;
    background: #fcfd02;
  }

  .description {
    padding: 12px;
  }

  .totals-wrap {
    background: #fcfd02;
    height: auto;
    align-items: center;
  }

  .total-item {
    gap: 4px;
    flex-direction: column;
  }
}
</style>
