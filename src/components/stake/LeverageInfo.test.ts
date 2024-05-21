import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import LeverageInfo from "@/components/stake/LeverageInfo.vue";

describe("LeverageInfo", () => {
  it("renders correctly", () => {
    const selectedNetwork = 1;
    const leverageInfo = { id: 123, label: "Leverage Info" };
    const wrapper = shallowMount(LeverageInfo, {
      propsData: { selectedNetwork, leverageInfo },
    });

    expect(wrapper.find(".leverage-info").text()).toBe("Leverage Info here.");
    expect(wrapper.find(".leverege-link").exists()).toBe(true);
  });

  it("does not render router-link when leverageInfo.id is not provided", () => {
    const selectedNetwork = 1;
    const leverageInfo = { label: "Leverage Info", id: 123 };
    const wrapper = shallowMount(LeverageInfo, {
      propsData: { selectedNetwork, leverageInfo },
    });

    expect(wrapper.find(".leverage-info").text()).toBe("Leverage Info");
    expect(wrapper.find(".leverege-link").exists()).toBe(false);
  });
});
