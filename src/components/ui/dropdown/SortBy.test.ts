import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SortBy from "@/components/ui/dropdown/SortBy.vue";

const sortListTest = [
  { title: "Title", name: "name" },
  { title: "TVL", name: "tvl" },
  { title: "MIMs Left", name: "mimLeftToBorrow" },
  { title: "Interest", name: "interest" },
  { title: "Fee", name: "fee" },
];
const activeSortValueTest = "name";

describe("SortBy.vue", () => {
  const clickOutside = vi.fn();

  it("Should render with correct computed properties", () => {
    const wrapper = mount(SortBy, {
      props: {
        sortList: sortListTest,
        activeSortValue: activeSortValueTest,
      },
      global: {
        directives: { "click-outside": clickOutside },
      },
    });

    const dropdownList: Array<any> = wrapper.vm.dropdownList;

    expect(dropdownList[0].name).toBe("tvl");
    expect(wrapper.vm.dropdownTitle).toBe("Title");
  });
});
