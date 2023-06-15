import { describe, it, expect } from "vitest";
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
  it("Should render with correct computed properties", () => {
    const wrapper = mount(SortBy, {
      props: {
        sortList: sortListTest,
        activeSortValue: activeSortValueTest,
      },
    });

    const dropdownList: Array<any> = wrapper.vm.dropdownList;

    expect(dropdownList[0].name).toBe("tvl");
    expect(wrapper.vm.dropdownTitle).toBe("Title");
  });
});
