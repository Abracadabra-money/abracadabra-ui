import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

function removeQueryParams(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  if (Object.keys(to.query).length)
    next({ path: to.path, query: {}, hash: to.hash });
  else next();
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Cauldrons.vue"),
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
    component: () => import("@/views/Farms.vue"),
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
    path: "/blast",
    name: "Blast",
    component: () => import("@/views/stake/Blast.vue"),
  },
  {
    path: "/mim-swap",
    name: "MimSwap",
    component: () => import("@/views/MimSwap.vue"),
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
