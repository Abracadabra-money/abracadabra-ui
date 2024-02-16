import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import MyPositionsInfo from "@/components/myPositions/MyPositionsInfo.vue";

describe("MyPositionsInfo", () => {
  it("renders the correct title", () => {
    const totalAssetsData = [
      { title: "Asset 1", value: 100 },
      { title: "Asset 2", value: 200 },
    ];
    const wrapper = shallowMount(MyPositionsInfo, {
      propsData: { totalAssetsData },
    });
    const title = wrapper.find(".title");
    expect(title.text()).toBe("Positions");
  });

  it("renders the correct description", () => {
    const totalAssetsData = [
      { title: "Asset 1", value: 100 },
      { title: "Asset 2", value: 200 },
    ];
    const wrapper = shallowMount(MyPositionsInfo, {
      propsData: { totalAssetsData },
    });
    const description = wrapper.find(".description");
    expect(description.text()).toContain("Manage your positions");
  });

  it("renders the correct reward cards", () => {
    const totalAssetsData = [
      { title: "Asset 1", value: 100 },
      { title: "Asset 2", value: 200 },
    ];
    const wrapper = shallowMount(MyPositionsInfo, {
      propsData: { totalAssetsData },
    });
    const rewardCards = wrapper.findAll(".reward-card");
    expect(rewardCards.length).toBe(totalAssetsData.length);
    rewardCards.forEach((card, index) => {
      const title = card.find(".reward-title");
      const value = card.find(".token-amount");
      expect(title.text()).toBe(`Total ${totalAssetsData[index].title}`);
      expect(value.text()).toBe(totalAssetsData[index].value.toString());
    });
  });
});
