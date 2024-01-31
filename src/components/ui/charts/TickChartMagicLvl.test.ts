import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import TickChartMagicLvl from "./TickChartMagicLvl.vue";

describe("TickChartMagicLvl", () => {
  it("renders the tick-chart component", () => {
    const wrapper = shallowMount(TickChartMagicLvl, {
      props: {
        labels: ["Label 1", "Label 2"],
        datasets: [
          {
            label: "Dataset 1",
            data: [10, 20],
          },
          {
            label: "Dataset 2",
            data: [30, 40],
          },
        ],
      },
      mounted() {},
    });

    expect(wrapper.find(".tick-chart").exists()).toBe(true);
  });
});
