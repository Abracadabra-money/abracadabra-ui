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
    component: () => import("@/views/Borrow"),
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
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
