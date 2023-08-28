import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SelectFarm from "@/components/farm/SelectFarm.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";

const tooltip = vi.fn();

const testSelectedFarm = {
  name: "testName",
  icon: "testIcon",
};

describe("SelectFarm.vue", () => {
  const wrapper = mount(SelectFarm, {
    global: { directives: { tooltip } },
  });

  it("Should render correct without props", () => {
    const selectWrap = wrapper.find(".select-wrap");
    expect(selectWrap.exists()).toBe(true);
    expect(wrapper.find(".select-text").text()).toBe("Select Farm");

    const baseTokenIcon = wrapper.findComponent(BaseTokenIcon);
    expect(baseTokenIcon.props().type).toBe("select");
    expect(baseTokenIcon.attributes().src).toContain("base_select_icon.png");
  });

  it("Should render correct with props", async () => {
    await wrapper.setProps({ selectedFarm: testSelectedFarm });

    const selectWrap = wrapper.find(".select-wrap");
    expect(selectWrap.exists()).toBe(true);
    expect(wrapper.find(".select-text").text()).toBe("testName");

    const baseTokenIcon = wrapper.findComponent(BaseTokenIcon);
    expect(baseTokenIcon.props().type).toBe("token");
    expect(baseTokenIcon.attributes().src).toContain("testIcon");
  });

  it("Should emit on click", () => {
    const selectButton = wrapper.find(".select");
    expect(selectButton.exists()).toBe(true);
    selectButton.trigger("click");

    expect(wrapper.emitted().openFarmsPopup.length).toBe(1);
  });
});
