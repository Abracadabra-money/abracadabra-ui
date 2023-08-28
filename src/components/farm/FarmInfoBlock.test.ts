import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import FarmInfoBlock from "@/components/farm/FarmInfoBlock.vue";
import GetLpLink from "@/components/ui/GetLpLink.vue";

const tooltip = vi.fn();

const testSelectedFarm = {
  farmRoi: 100,
  farmTvl: 2000,
  stakingToken: { link: "test-link" },
};

describe("FarmInfoBlock.vue", () => {
  const wrapper = mount(FarmInfoBlock, {
    props: { selectedFarm: testSelectedFarm },
    global: { directives: { tooltip } },
  });

  it("Should render correct", () => {
    const infoItem = wrapper.find(".info-item");
    expect(infoItem.exists()).toBe(true);

    const infoItemsValue = wrapper.findAll(".info-item-value");
    expect(infoItemsValue[0].text()).toBe("100%");
    expect(infoItemsValue[1].text()).toBe("$ 2,000");
    expect(wrapper.findComponent(GetLpLink).props().link).toBe("test-link");
  });
});
