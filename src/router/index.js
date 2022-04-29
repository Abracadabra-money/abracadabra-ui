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
    path: "/stake/",
    name: "Stake",
    props: { currentComponent: 'SSpell' },
    component: () => import("@/views/Stake")
  },
  {
    path: "/mStake/",
    name: "mStake",
    props: { currentComponent: 'MSpell' },
    component: () => import("@/views/Stake")
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
    path: "/my-positions",
    name: "MyPositions",
    component: () => import("@/views/MyPositions"),
  },
  {
    path: "/stats",
    name: "Stats",
    component: () => import("@/views/Stats"),
    children: [
      {
        path: "",
        name: "StatsBorrow",
        component: () => import("@/views/StatsView"),
      },
      {
        path: "farm",
        name: "StatsFarm",
        component: () => import("@/views/StatsView"),
        props: { isFarm: true },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
