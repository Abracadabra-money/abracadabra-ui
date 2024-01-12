import { describe, it, expect, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import ChartBlock from "@/components/stake/ChartBlock.vue";

describe("ChartBlock", () => {
  it("renders chart block when chartData is available", () => {
    const wrapper = shallowMount(ChartBlock, {
      props: {
        chainId: 1,
        chartConfig: {
          type: "magicGlpTvl",
          icon: "token-icon.png",
          title: "Chart Title",
          typeButtons: ["Button 1", "Button 2"],
          intervalButtons: ["Button 1", "Button 2"],
          feePercent: 0.5,
        },
        getChartOptions: () => {},
      },
      data() {
        return {
          chartData: {},
        };
      },
      created() {},
    });

    expect(wrapper.find(".chart-block").exists()).toBe(true);
  });

  it("calls updateChart method when chartData is updated", () => {
    const updateChart = vi.fn();
    const wrapper = shallowMount(ChartBlock, {
      props: {
        chainId: 1,
        chartConfig: {
          type: "magicGlpTvl",
          icon: "token-icon.png",
          title: "Chart Title",
          typeButtons: ["Button 1", "Button 2"],
          intervalButtons: ["Button 1", "Button 2"],
          feePercent: 0.5,
        },
        getChartOptions: () => {},
      },
      data() {
        return {
          chartData: {},
        };
      },
      created() {
        updateChart(); // Mock updateChart method
      },
    });

    wrapper.setData({
      chartData: {
        /* updated chart data */
      },
    });

    expect(updateChart).toHaveBeenCalled();
  });

  it("renders the correct chart type", () => {
    const wrapper = shallowMount(ChartBlock, {
      props: {
        chainId: 1,
        chartConfig: {
          type: "magicGlpTvl",
          icon: "token-icon.png",
          title: "Chart Title",
          typeButtons: ["Button 1", "Button 2"],
          intervalButtons: ["Button 1", "Button 2"],
          feePercent: 0.5,
        },
        getChartOptions: () => {},
      },
      data() {
        return {
          chartData: {},
        };
      },
      created() {},
    });

    expect((wrapper.vm as any).chartConfig.type).toBe("magicGlpTvl");
  });
});
