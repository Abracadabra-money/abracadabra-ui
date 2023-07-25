import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import InputLabel from "@/components/ui/inputs/InputLabel.vue";

describe("InputLabel.vue", () => {
  const wrapper = mount(InputLabel);
  it("Should render correct without props", () => {
    const inputLabel = wrapper.find(".wrapper");
    expect(inputLabel.exists()).toBe(true);
    expect(inputLabel.find("h4").text()).toBe("Collateral assets");
    expect(inputLabel.find(".amount").text()).toBe("Balance: 0.0");
  });

  it("Should render correct withprops", async () => {
    await wrapper.setProps({
      title: "test title",
      amount: 100,
    });
    expect(wrapper.find("h4").text()).toBe("test title");
    expect(wrapper.find(".amount").text()).toBe("Balance: 100.0");
  });
});
