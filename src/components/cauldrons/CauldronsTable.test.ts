import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import CauldronsTable from "@/components/cauldrons/CauldronsTable.vue";

describe("CauldronsTable", () => {
  it("renders correctly", () => {
    const wrapper = shallowMount(CauldronsTable, {
      props: {
        cauldrons: [],
        cauldronsLoading: false,
        tableKeys: [],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('updates toggle for "My positions"', () => {
    const wrapper = shallowMount(CauldronsTable, {
      props: {
        cauldrons: [],
        cauldronsLoading: false,
        tableKeys: [],
      },
    });

    const toggle = wrapper.findComponent({ name: "Toggle" });
    toggle.vm.$emit("updateToggle");

    expect(wrapper.vm.showMyPositions).toBe(true);
  });

  it('updates toggle for "Active Cauldrons"', () => {
    const wrapper = shallowMount(CauldronsTable, {
      props: {
        cauldrons: [],
        cauldronsLoading: false,
        tableKeys: [],
      },
    });

    const toggle = wrapper.findComponent({ name: "Toggle" });
    toggle.vm.$emit("updateToggle");

    expect(wrapper.vm.showActiveCauldrons).toBe(true);
  });

  it("updates sort keys", () => {
    const wrapper = shallowMount(CauldronsTable, {
      props: {
        cauldrons: [],
        cauldronsLoading: false,
        tableKeys: [],
      },
    });

    wrapper.vm.updateSortKeys("TVL", "down");

    expect(wrapper.vm.sortKey).toBe("TVL");
    expect(wrapper.vm.sortOrder).toBe("down");
  });

  it("updates search value", () => {
    const wrapper = shallowMount(CauldronsTable, {
      props: {
        cauldrons: [],
        cauldronsLoading: false,
        tableKeys: [],
      },
    });

    wrapper.vm.updateSearch("example");

    expect(wrapper.vm.searchValue).toBe("example");
  });

  it("updates selected chain", () => {
    const wrapper = shallowMount(CauldronsTable, {
      props: {
        cauldrons: [],
        cauldronsLoading: false,
        tableKeys: [],
      },
    });

    wrapper.vm.updateSelectedChain("chainId");

    expect(wrapper.vm.selectedChains).toContain("chainId");

    wrapper.vm.updateSelectedChain("chainId");

    expect(wrapper.vm.selectedChains).not.toContain("chainId");
  });
});
