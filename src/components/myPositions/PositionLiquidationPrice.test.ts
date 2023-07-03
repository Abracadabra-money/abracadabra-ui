import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import PositionLiquidationPrice from "@/components/myPositions/PositionLiquidationPrice.vue";

import filters from "@/filters/index.js";

describe("PositionLinks.vue", () => {
  it("Should have safe status on safe positionRisk prop", () => {
    const wrapper = mount(PositionLiquidationPrice, {
      props: {
        positionRisk: "safe",
        liquidationPrice: 0,
      },
    });
    expect(wrapper.vm.positionStatus).toEqual(`status-safe`);
  });

  it("Should have medium status on medium positionRisk prop", () => {
    const wrapper = mount(PositionLiquidationPrice, {
      props: {
        positionRisk: "medium",
        liquidationPrice: 0,
      },
    });
    expect(wrapper.vm.positionStatus).toEqual(`status-medium`);
  });

  it("Should have high status on high positionRisk prop", () => {
    const wrapper = mount(PositionLiquidationPrice, {
      props: {
        positionRisk: "high",
        liquidationPrice: 0,
      },
    });
    expect(wrapper.vm.positionStatus).toEqual(`status-high`);
  });

  it("Should liquidationPrice properly", () => {
    const wrapper = mount(PositionLiquidationPrice, {
      props: {
        positionRisk: "safe",
        liquidationPrice: 10,
      },
    });
    const convertedLiquidationPrice = filters.formatExactPrice(10);
    expect(wrapper.vm.formatLiquidationPrice).toEqual(
      convertedLiquidationPrice
    );
  });
});
