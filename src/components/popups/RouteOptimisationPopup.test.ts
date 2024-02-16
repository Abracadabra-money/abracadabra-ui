import Vuex from "vuex";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import RouteOptimisationPopup from "@/components/popups/RouteOptimisationPopup.vue";
import { utils } from "ethers";
import { createRouter, createWebHistory } from "vue-router";

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      getters: {
        getRouteData: () => [
          {
            address: "0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f",
            amount: utils.parseEther("0.1"),
          },
        ],
      },
    },
  },
});

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", component: RouteOptimisationPopup }],
});

describe("RouteOptimisationPopup", () => {
  it("renders the popup title correctly", () => {
    const wrapper = shallowMount(RouteOptimisationPopup, {
      global: { plugins: [store, router] },
    });
    const title = wrapper.find(".popup-title");
    expect(title.text()).toBe("Route Optimisation");
  });

  it("displays loader when routeDatas is empty", () => {
    const wrapper = shallowMount(RouteOptimisationPopup, {
      global: { plugins: [store, router] },
      computed: {
        routeDatas() {
          return [];
        },
      },
    });
    const loader = wrapper.find(".loader-wrap");
    expect(loader.exists()).toBe(true);
  });

  it("displays routeDatas correctly", () => {
    const wrapper = shallowMount(RouteOptimisationPopup, {
      global: { plugins: [store, router] },
      computed: {
        routeDatas() {
          return [
            {
              name: "WBTC",
              icon: "assets/images/tokens/BTC.png",
              fees: 0.1,
              amount: 100,
            },
            {
              name: "USD",
              icon: "assets/images/tokens/USD.png",
              fees: 0.2,
              amount: 200,
            },
          ];
        },
      },
    });
    const tokens = wrapper.findAll(".list-item");

    expect(tokens.length).toBe(2);
    expect(tokens[0].text()).toContain("WBTC");
    expect(tokens[1].text()).toContain("USD");
  });
});
