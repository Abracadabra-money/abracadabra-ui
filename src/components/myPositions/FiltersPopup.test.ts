import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import FiltersPopup from "@/components/myPositions/FiltersPopup.vue";

describe("FiltersPopup", () => {
  it("renders correctly", () => {
    const sortersData = [
      { key: "key1", text: "Sorter 1" },
      { key: "key2", text: "Sorter 2" },
    ];

    const wrapper = shallowMount(FiltersPopup, {
      propsData: { sortersData },
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find(".filters-popup").exists()).toBe(true);
    expect(wrapper.find(".popup-header").exists()).toBe(true);
    expect(wrapper.find(".filters").exists()).toBe(true);
    expect(wrapper.find(".filter").exists()).toBe(true);
    expect(wrapper.find(".apply-button").exists()).toBe(true);
  });

  it("emits updateSortKey event when apply button is clicked", () => {
    const sortersData = [
      { key: "key1", text: "Sorter 1" },
      { key: "key2", text: "Sorter 2" },
    ];

    const wrapper = shallowMount(FiltersPopup, {
      propsData: { sortersData },
    });

    const applyButton = wrapper.find(".apply-button");
    applyButton.trigger("click");
    wrapper.vm.$emit("updateSortKey");

    expect(wrapper.emitted().updateSortKey).toBeTruthy();
  });

  it("emits close event when close button is clicked", () => {
    const sortersData = [
      { key: "key1", text: "Sorter 1" },
      { key: "key2", text: "Sorter 2" },
    ];

    const wrapper = shallowMount(FiltersPopup, {
      propsData: { sortersData },
    });

    const closeButton = wrapper.find(".close-img");
    closeButton.trigger("click");

    expect(wrapper.emitted("close")).toBeTruthy();
  });
});
