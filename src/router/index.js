import { createRouter, createWebHashHistory } from "vue-router";

function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash };
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
  },
  {
    path: "/tenderlyTap",
    name: "TenderlyTap",
    component: () => import("@/views/TenderlyTap.vue"),
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
    path: "/spell",
    name: "StakeSpell",
    component: () => import("@/views/stake/Spell.vue"),
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
    name: "Beam",
    component: () => import("@/views/Beam.vue"),
  },
  {
    path: "/bridge",
    redirect: "/beam",
  },
  {
    path: "/farms",
    name: "MarketsFarm",
    component: () => import("@/views/markets/Farms.vue"),
  },
  {
    path: "/farm/:id?",
    name: "Farm",
    component: () => import("@/views/Farm.vue"),
    props: true,
    beforeEnter: [removeQueryParams],
  },
  {
    path: "/my-positions",
    name: "MyPositions",
    component: () => import("@/views/MyPositions.vue"),
  },
  {
    path: "/cauldrons",
    name: "Cauldrons",
    component: () => import("@/views/Cauldrons.vue"),
  },
  {
    path: "/claim",
    name: "Claim",
    component: () => import("@/views/Claim.vue"),
  },
  {
    path: "/magicKLP",
    name: "magicKLP",
    component: () => import("@/views/stake/MKLP.vue"),
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
