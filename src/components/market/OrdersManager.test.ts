import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import OrdersManager from "@/components/market/OrdersManager.vue";

describe("OrdersManager", () => {
  it("not renders component", () => {
    const wrapper = shallowMount(OrdersManager, {
      props: {
        orders: [],
      },
      created() {},
    });

    const orderItems = wrapper.findAllComponents({ name: "OrderItem" });
    expect(orderItems.length).toBe(0);
  });
});
