import { testStore } from "@/test/store";
import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import OrderItem from "@/components/market/OrderItem.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", component: OrderItem }],
});

describe("OrderItem", () => {
  it("renders order information correctly", () => {
    const wrapper = shallowMount(OrderItem, {
      global: { plugins: [testStore, router] },
      props: {
        cauldronObject: {
          config: {
            chainId: 1,
          },
        },
        cauldron: {},
        order: "0x123456789abcdef",
        recoverLeverage: vi.fn(),
        deleverageFromOrder: vi.fn(),
      },
    });

    // Assert that the order text is rendered correctly
    expect(wrapper.find(".order-address").text()).toBe("0x1234...abcdef");

    // Assert that the order link is rendered correctly
    expect(wrapper.find(".order-link").attributes("href")).toBe(
      "https://arbiscan.io/address/0x123456789abcdef"
    );

    // Assert that the buttons are rendered correctly
    expect(wrapper.find(".btns-wrap").exists()).toBe(true);
  });
});
