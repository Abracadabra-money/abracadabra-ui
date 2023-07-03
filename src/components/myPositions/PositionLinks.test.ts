import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import PositionLinks from "@/components/myPositions/PositionLinks.vue";

const actionsTest = [
  {
    title: "Add Collateral/ Borrow MIM",
    icon: "@/assets/images/myposition/AddCollateral.png",
    name: "BorrowId",
    id: 11,
  },
  {
    title: "Repay MIMs/ Remove Collateral",
    icon: "@/assets/images/myposition/Repay.png",
    name: "RepayId",
    id: 11,
  },
  {
    title: "Deleverage",
    icon: "@/assets/images/myposition/Deleverage.png",
    name: "DeleverageId",
    id: 11,
  },
];

describe("PositionLinks.vue", () => {
  it("Should render correct", () => {
    const wrapper = mount(PositionLinks, {
      props: { actions: actionsTest },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("Should render assetsItems", () => {
    const wrapper = mount(PositionLinks, {
      props: { actions: actionsTest },
    });

    const assetsItems = wrapper.findAll(".position-link").at(0)!;
    expect(assetsItems.classes()).toContain("position-link");
  });

  it("Asset item should have proper title", () => {
    const wrapper = mount(PositionLinks, {
      props: { actions: actionsTest },
    });

    const title = wrapper.findAll(".position-link-title")!;
    expect(title[0].text()).toBe("Add Collateral/ Borrow MIM");
    expect(title[1].text()).toBe("Repay MIMs/ Remove Collateral");
    expect(title[2].text()).toBe("Deleverage");
  });
});
