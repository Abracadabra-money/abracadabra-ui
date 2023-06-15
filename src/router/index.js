import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/borrow",
    name: "Borrow",
    component: () => import("@/views/borrow/Borrow.vue"),
  },
  {
    path: "/borrow/:id",
    name: "BorrowId",
    component: () => import("@/views/borrow/Borrow.vue"),
  },
  {
    path: "/repay",
    name: "Repay",
    component: () => import("@/views/borrow/Repay.vue"),
  },
  {
    path: "/repay/:id",
    name: "RepayId",
    component: () => import("@/views/borrow/Repay.vue"),
  },
  {
    path: "/sSPELL",
    name: "Stake",
    component: () => import("@/views/stake/SSpell.vue"),
  },
  {
    path: "/mSPELL",
    name: "mStake",
    component: () => import("@/views/stake/MSpell.vue"),
  },
  {
    path: "/magicGLP",
    name: "magicGLP",
    component: () => import("@/views/stake/MGLP.vue"),
  },
  {
    path: "/magicAPE",
    name: "magicAPE",
    component: () => import("@/views/stake/MAPE.vue"),
  },
  {
    path: "/magicLVL",
    name: "magicLVL",
    component: () => import("@/views/stake/MLVL.vue"),
  },
  {
    path: "/leverage",
    name: "Leverage",
    component: () => import("@/views/borrow/Leverage.vue"),
  },
  {
    path: "/leverage/:id",
    name: "LeverageId",
    component: () => import("@/views/borrow/Leverage.vue"),
  },
  {
    path: "/deleverage",
    name: "Deleverage",
    component: () => import("@/views/borrow/Deleverage.vue"),
  },
  {
    path: "/deleverage/:id",
    name: "DeleverageId",
    component: () => import("@/views/borrow/Deleverage.vue"),
  },
  {
    path: "/beam",
    name: "Bridge",
    component: () => import("@/views/Bridge.vue"),
  },
  {
    path: "/bridge",
    redirect: "/beam",
  },
  {
    path: "/farm",
    name: "MarketsFarm",
    component: () => import("@/views/markets/Farms.vue"),
  },
  {
    path: "/farm/:id",
    name: "FarmPool",
    component: () => import("@/views/Farm.vue"),
    props: true,
  },
  {
    path: "/my-positions",
    name: "MyPositions",
    component: () => import("@/views/MyPositions.vue"),
  },
  {
    path: "/cauldrons",
    name: "Cauldrons",
    component: () => import("@/views/markets/Cauldrons.vue"),
  },
  {
    path: "/markets",
    name: "Markets",
    component: () => import("@/views/markets/Cauldrons.vue"),
  },
  {
    path: "/claim",
    name: "Claim",
    component: () => import("@/views/Claim.vue"),
  },
  {
    path: "/liquidation",
    name: "Liquidation",
    component: () => import("@/views/Liquidation.vue"),
  },
  {
    path: "/liquidation/:id",
    name: "LiquidationId",
    component: () => import("@/views/Liquidation.vue"),
  },

  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
