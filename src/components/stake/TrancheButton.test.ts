import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import TrancheButton from "@/components/stake/TrancheButton.vue";

describe("TrancheButton.vue", async () => {
  it("Should render props", async () => {
    const props = { type: "senior", apr: "34.93%", isActive: false };

    const wrapper = mount(TrancheButton, { props });
    expect(wrapper.find(".title").text()).toBe("senior Tranche");
    expect(wrapper.find(".value").text()).toBe("34.93% APR");
    expect(wrapper.find(".check-icon").exists()).toBe(false);
    expect(wrapper.find("button").classes().includes("senior")).toBe(true);
    expect(wrapper.find("button").classes().includes("active")).toBe(false);
  });

  it("Should render active button", async () => {
    const props = { type: "junior", apr: "8.99%", isActive: true };

    const wrapper = mount(TrancheButton, { props });
    expect(wrapper.find(".title").text()).toBe("junior Tranche");
    expect(wrapper.find(".value").text()).toBe("8.99% APR");
    expect(wrapper.find(".check-icon").exists()).toBe(true);
    expect(wrapper.find("button").classes().includes("junior")).toBe(true);
    expect(wrapper.find("button").classes().includes("active")).toBe(true);
  });
});
