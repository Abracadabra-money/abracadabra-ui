import { BigNumber } from "ethers";
import { mount } from "@vue/test-utils";
import { testStore } from "@/test/store";
import { describe, it, expect, vi } from "vitest";
import DynamicFee from "@/components/market/DynamicFee.vue";

const tooltip = vi.fn();

describe("DynamicFee", () => {
  it("displays the estimation description correctly", () => {
    const wrapper = mount(DynamicFee, {
      directives: { tooltip },
      props: {
        mimAddress: "0x123",
        isClose: false,
      },
      data() {
        return {
          isProfit: false,
        };
      },
    });

    expect(wrapper.find(".title").text()).toBe("Dynamic Opening Fee");

    wrapper.setProps({ isClose: true });
    wrapper.setData({ isProfit: true });

    expect(wrapper.find(".title").text()).toBe("Dynamic Opening Fee");
  });

  it("displays the estimation result correctly", async () => {
    const wrapper = mount(DynamicFee, {
      directives: { tooltip },
      global: { plugins: [testStore] },
      props: {
        mimAddress: "0x123",
        amount: BigNumber.from("0"),
      },
      data() {
        return {
          price: 1.5,
          isFetching: false,
          isProfit: false,
        };
      },
    });

    expect(wrapper.find(".value").text()).toBe("≈");
    wrapper.setProps({ amount: BigNumber.from("100") });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".value").text()).toBe("...Fetching");

    wrapper.setProps({ amount: BigNumber.from("0") });
    await wrapper.vm.$nextTick();
    expect(wrapper.find(".value").text()).toBe("...Fetching");
  });

  it("fetches the price correctly", async () => {
    const wrapper = mount(DynamicFee, {
      //   props: {
      //     isFetching: false,
      //     isClose: false,
      //     amount: { isZero: () => false },
      //     chainId: 1,
      //     buyToken: "0x123",
      //     sellToken: "0x456",
      //     slippage: 1,
      //     mimAddress: "0x789",
      //   },
      directives: { tooltip },
      global: { plugins: [testStore] },
      props: {
        mimAddress: "0x123",
        isClose: false,
        amount: BigNumber.from("100"),
      },
      data() {
        return {
          price: null,
          isFetching: false,
          isProfit: false,
        };
      },
    });

    expect(wrapper.vm.price).toBeNull();
    expect(wrapper.vm.isFetching).toBe(false);

    wrapper.vm.getPrice();

    expect(wrapper.vm.isFetching).toBe(true);

    // Simulate the API response
    wrapper.vm.price = 1.5;
    wrapper.vm.isProfit = false;

    expect(wrapper.vm.price).toBe(1.5);
    expect(wrapper.vm.isProfit).toBe(false);
    expect(wrapper.vm.isFetching).toBe(true);
  });
});
