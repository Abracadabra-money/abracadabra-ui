import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import StrategyLink from "@/components/ui/links/StrategyLink.vue";

const testCauldron = {
  config: { cauldronSettings: { strategyLink: "//test_link" } },
};

describe("StrategyLink.vue", () => {
  it("Should render correct", () => {
    const wrapper = mount(StrategyLink, { props: { cauldron: testCauldron } });

    const strategyLink = wrapper.find(".strategy-link");
    expect(strategyLink.exists()).toBe(true);
    expect(strategyLink.attributes().href).toBe("//test_link");
    expect(strategyLink.text()).toBe("Degenbox strategy");
  });
});
