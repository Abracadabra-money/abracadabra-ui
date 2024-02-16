import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import DynamicApr from "@/components/market/DynamicApr.vue";

describe("DynamicApr", () => {
  it("renders the component when isShowDynamicApr is true", () => {
    const wrapper = shallowMount(DynamicApr, {
      props: {
        aprInfo: { value: 10, multiplier: 1 },
        multiplier: 1,
      },
      data() {
        return {
          aprInfo: { value: 0, multiplier: 0 },
        };
      },
      created() {
        this.aprInfo = { value: 1, multiplier: 2 };
      },
    });

    expect(wrapper.find(".dynamic-apr").exists()).toBe(true);
  });

  it("does not render the component when isShowDynamicApr is false", () => {
    const wrapper = shallowMount(DynamicApr, {
      props: {
        aprInfo: { value: 0, multiplier: 0 },
        multiplier: 0,
      },
      created() {},
    });

    expect(wrapper.find(".dynamic-apr").exists()).toBe(false);
  });

  it("displays the correct opening APR value", () => {
    const wrapper = shallowMount(DynamicApr, {
      props: {
        aprInfo: { value: 10, multiplier: 1 },
        multiplier: 1,
      },
      data() {
        return {
          aprInfo: { value: 0, multiplier: 0 },
        };
      },
      created() {
        this.aprInfo = { value: 1, multiplier: 2 };
      },
    });

    expect(wrapper.find(".value").text()).toBe("1.0%");
  });
});
