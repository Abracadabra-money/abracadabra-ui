import { mount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import PositionLinks from "@/components/myPositions/PositionLinks.vue";

import { useImage } from "@/helpers/useImage";

const actionsTest = [
  {
    title: "Add Collateral/ Borrow MIM",
    icon: useImage("assets/images/myposition/AddCollateral.png"),
    name: "BorrowId",
    id: 11,
  },
  {
    title: "Repay MIMs/ Remove Collateral",
    icon: useImage("assets/images/myposition/Repay.png"),
    name: "RepayId",
    id: 11,
  },
  {
    title: "Deleverage",
    icon: useImage("assets/images/myposition/Deleverage.png"),
    name: "DeleverageId",
    id: 11,
  },
];

describe("PositionLinks.vue", () => {
  it("renders", () => {
    const wrapper = mount(PositionLinks, {
      props: { actions: actionsTest },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it("renders assetsItems", () => {
    const wrapper = mount(PositionLinks, {
      props: { actions: actionsTest },
    });

    const assetsItems = wrapper.findAll(".position-link").at(0);
    expect(assetsItems.classes()).toContain("position-link");
  });

  it("asset item has proper title", () => {
    const wrapper = mount(PositionLinks, {
      props: { actions: actionsTest },
    });

    const title = wrapper.findAll(".position-link-title");
    expect(title[0].text()).toBe("Add Collateral/ Borrow MIM");
    expect(title[1].text()).toBe("Repay MIMs/ Remove Collateral");
    expect(title[2].text()).toBe("Deleverage");
  });
});
