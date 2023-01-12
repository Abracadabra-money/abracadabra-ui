import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home"),
  },
  {
    path: "/borrow",
    name: "Borrow",
    component: () => import("@/views/borrow/Borrow"),
  },
  {
    path: "/borrow/:id",
    name: "BorrowId",
    component: () => import("@/views/borrow/Borrow"),
  },
  {
    path: "/repay",
    name: "Repay",
    component: () => import("@/views/borrow/Repay"),
  },
  {
    path: "/repay/:id",
    name: "RepayId",
    component: () => import("@/views/borrow/Repay"),
  },
  {
    path: "/sSPELL",
    name: "Stake",
    component: () => import("@/views/stake/SSpell"),
  },
  {
    path: "/mSPELL",
    name: "mStake",
    component: () => import("@/views/stake/MSpell"),
  },
  {
    path: "/leverage",
    name: "Leverage",
    component: () => import("@/views/borrow/Leverage"),
  },
  {
    path: "/leverage/:id",
    name: "LeverageId",
    component: () => import("@/views/borrow/Leverage"),
  },
  {
    path: "/deleverage",
    name: "Deleverage",
    component: () => import("@/views/borrow/Deleverage"),
  },
  {
    path: "/deleverage/:id",
    name: "DeleverageId",
    component: () => import("@/views/borrow/Deleverage"),
  },
  {
    path: "/bridge",
    name: "Bridge",
    component: () => import("@/views/Bridge"),
  },
  {
    path: "/farm",
    name: "Farm",
    component: () => import("@/views/Farm"),
  },
  {
    path: "/farm/:id",
    name: "FarmPool",
    component: () => import("@/views/Farm"),
    props: true,
  },
  {
    path: "/my-positions",
    name: "MyPositions",
    component: () => import("@/views/MyPositions"),
  },
  {
    path: "/markets",
    component: () => import("@/views/markets/Markets"),
    children: [
      {
        path: "",
        name: "MarketsBorrow",
        component: () => import("@/views/markets/MarketsView"),
      },
      {
        path: "farm",
        name: "MarketsFarm",
        component: () => import("@/views/markets/MarketsView"),
        props: { isFarm: true },
      },
    ],
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

export default router;
