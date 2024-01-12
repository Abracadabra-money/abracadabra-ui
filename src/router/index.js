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
    path: "/cauldrons",
    name: "Cauldrons",
    component: () => import("@/views/Cauldrons.vue"),
  },
  {
    path: "/market/:chainId/:cauldronId",
    name: "Market",
    component: () => import("@/views/Market.vue"),
  },
  {
    path: "/farms",
    name: "MarketsFarm",
    component: () => import("@/views/markets/Farms.vue"),
  },
  {
    path: "/farm/:id?/:farmChainId?",
    name: "Farm",
    component: () => import("@/views/Farm.vue"),
    props: true,
    beforeEnter: [removeQueryParams],
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
    path: "/magicKLP",
    name: "magicKLP",
    component: () => import("@/views/stake/MKLP.vue"),
  },
  {
    path: "/my-positions",
    name: "MyPositions",
    component: () => import("@/views/MyPositions.vue"),
  },
  {
    path: "/tenderlyTap",
    name: "TenderlyTap",
    component: () => import("@/views/TenderlyTap.vue"),
  },
  {
    path: "/claim",
    name: "Claim",
    component: () => import("@/views/Claim.vue"),
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
