import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import PositionLiquidationPrice from "@/components/myPositions/PositionLiquidationPrice.vue";

import filters from "@/filters/index.js";

describe("PositionLinks.vue", () => {
  it("has safe status on safe positionRisk prop", () => {
    const wrapper = mount(PositionLiquidationPrice, {
      props: {
        positionRisk: "safe",
        liquidationPrice: 0,
      },
    });
    expect(wrapper.vm.positionStatus).toEqual(`status-safe`);
  });

  it("has medium status on medium positionRisk prop", () => {
    const wrapper = mount(PositionLiquidationPrice, {
      props: {
        positionRisk: "medium",
        liquidationPrice: 0,
      },
    });
    expect(wrapper.vm.positionStatus).toEqual(`status-medium`);
  });

  it("has high status on high positionRisk prop", () => {
    const wrapper = mount(PositionLiquidationPrice, {
      props: {
        positionRisk: "high",
        liquidationPrice: 0,
      },
    });
    expect(wrapper.vm.positionStatus).toEqual(`status-high`);
  });

  it("convert liquidationPrice properly", () => {
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
