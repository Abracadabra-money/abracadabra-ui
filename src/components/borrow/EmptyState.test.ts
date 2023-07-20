import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import EmptyState from "@/components/borrow/EmptyState.vue";
import { useImage } from "@/helpers/useImage";

import { createRouter, createWebHistory } from "vue-router";
const testRoutes = [
  {
    path: "/borrow",
    name: "Borrow",
    component: () => import("@/views/borrow/Borrow.vue"),
  },
  {
    path: "/repay",
    name: "Repay",
    component: () => import("@/views/borrow/Repay.vue"),
  },
  {
    path: "/leverage",
    name: "Leverage",
    component: () => import("@/views/borrow/Leverage.vue"),
  },
  {
    path: "/deleverage",
    name: "Deleverage",
    component: () => import("@/views/borrow/Deleverage.vue"),
  },
];

describe("EmptyState.vue", async () => {
  it("Should render on /borrow correct", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: testRoutes,
    });

    router.push("/borrow");
    await router.isReady();

    const wrapper: any = mount(EmptyState, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.vm.emptyData).toMatchObject({
      img: useImage("assets/images/empty_borrow.png"),
      text: "Choose the asset and amount you want to use as collateral as well as the amount of MIM you want to Borrow",
      bottom: "If you want to learn more read our docs",
      link: "https://abracadabramoney.gitbook.io/intro/lending-markets",
    });

    const emptyText = wrapper.find(".empty-text");
    const emptyBottom = wrapper.find(".empty-bottom");

    expect(emptyText.text()).toContain("Borrow");
    expect(emptyBottom.text()).toBe(
      "If you want to learn more read our docs here"
    );
  }, 30000);

  it("Should render on /repay correct", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: testRoutes,
    });

    router.push("/repay");
    await router.isReady();

    const wrapper: any = mount(EmptyState, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.vm.emptyData).toMatchObject({
      img: useImage("assets/images/empty_borrow.png"),
      text: "Choose the asset and amount you want to use as collateral as well as the amount of MIM you want to Repay",
      bottom: "If you want to learn more read our docs",
      link: "https://abracadabramoney.gitbook.io/",
      glpPoolsId: [2, 3],
    });

    const emptyText = wrapper.find(".empty-text");
    const emptyBottom = wrapper.find(".empty-bottom");

    expect(emptyText.text()).toContain("Repay");
    expect(emptyBottom.text()).toBe(
      "If you want to learn more read our docs here"
    );
  }, 30000);

  it("Should render on /repay correct", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: testRoutes,
    });

    router.push("/leverage");
    await router.isReady();

    const wrapper: any = mount(EmptyState, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.vm.emptyData).toMatchObject({
      img: useImage("assets/images/empty_leverage.png"),
      text: "Leverage up your selected asset using our built in function. Remember you will not receive any MIMs.",
      bottom: "Read more about it",
      link: "https://abracadabramoney.gitbook.io/intro/lending-markets",
    });

    const emptyText = wrapper.find(".empty-text");
    const emptyBottom = wrapper.find(".empty-bottom");

    expect(emptyText.text()).toContain("Leverage");
    expect(emptyBottom.text()).toBe("Read more about it here");
  }, 30000);

  it("Should render on /repay correct", async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: testRoutes,
    });

    router.push("/deleverage");
    await router.isReady();

    const wrapper: any = mount(EmptyState, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.vm.emptyData).toMatchObject({
      img: useImage("assets/images/empty_leverage.png"),
      text: "Deleverage your position using our built-in Flash repay function.",
      bottom: "Read more about it",
      link: "https://abracadabramoney.gitbook.io/intro/lending-markets",
    });

    const emptyText = wrapper.find(".empty-text");
    const emptyBottom = wrapper.find(".empty-bottom");

    expect(emptyText.text()).toContain("Deleverage");
    expect(emptyBottom.text()).toBe("Read more about it here");
  }, 30000);
});
