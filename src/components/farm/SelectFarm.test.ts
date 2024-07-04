import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import SelectFarm from "@/components/farm/SelectFarm.vue";
import { emptyFarmData } from "@/helpers/farm/createFarmData";

describe("SelectFarm", () => {
  it("renders the correct selected farm name", () => {
    const selectedFarm = {
      ...emptyFarmData,
      name: "Farm A",
      icon: "farm-icon",
      chainId: 1,
    };

    const wrapper = shallowMount(SelectFarm, {
      propsData: {
        selectedFarm,
      },
    });

    const selectText = wrapper.find(".select-text");
    expect(selectText.text()).toBe(selectedFarm.name);
  });

  it('renders "Select Farm" when no farm is selected', () => {
    const wrapper = shallowMount(SelectFarm);

    const selectText = wrapper.find(".select-text");
    expect(selectText.text()).toBe("Select Farm");
  });

  it('emits "openFarmsPopup" event when the button is clicked', () => {
    const wrapper = shallowMount(SelectFarm);

    wrapper.find(".select").trigger("click");
    expect(wrapper.emitted("openFarmsPopup")).toBeTruthy();
  });
});
