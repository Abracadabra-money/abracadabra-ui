import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import CauldronsTableHead from "@/components/cauldrons/CauldronsTableHead.vue";

describe("CauldronsTableHead", () => {
  it("renders the correct number of table items", () => {
    const wrapper = shallowMount(CauldronsTableHead);
    const tableItems = wrapper.findAll(".table-item");
    expect(tableItems.length).toBe(wrapper.vm.tableKeys.length);
  });

  it("updates the sort order when updateSort method is called", () => {
    const wrapper = shallowMount(CauldronsTableHead);
    const key = "TVL";
    wrapper.vm.updateSort(key);
    expect(wrapper.vm.sortKey).toBe(key);
    expect(wrapper.vm.sortOrder).toBe("up");
  });

  it("emits the updateSort event when updateSort method is called", () => {
    const wrapper = shallowMount(CauldronsTableHead);
    const key = "TVL";
    wrapper.vm.updateSort(key);
    expect(wrapper.emitted("updateSort")).toBeTruthy();
    expect(wrapper.emitted("updateSort")![0]).toEqual([key, "up"]);
  });

  it("returns the correct sort order when getSortOrder method is called", () => {
    const wrapper: any = shallowMount(CauldronsTableHead);
    const key = "TVL";
    wrapper.vm.sortKey = key;
    wrapper.vm.sortOrder = "up";
    expect(wrapper.vm.getSortOrder(key)).toBe("up");
  });
});
