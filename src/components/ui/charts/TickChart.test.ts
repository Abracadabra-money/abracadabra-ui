import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TickChart from "@/components/ui/charts/TickChart.vue";

describe("TickChart", () => {
  it("renders a canvas element", () => {
    const wrapper = shallowMount(TickChart, {
      mounted() {},
    });
    expect(wrapper.find("canvas").exists()).toBe(true);
  });
});
