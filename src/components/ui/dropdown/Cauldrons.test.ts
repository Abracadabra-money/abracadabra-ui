import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import Cauldrons from "@/components/ui/dropdown//Cauldrons.vue";

const clickOutside = vi.fn();

describe("Cauldrons", () => {
  it("renders correctly when cauldronData is null", () => {
    const wrapper = shallowMount(Cauldrons, {
      directives: { clickOutside },
      propsData: {
        isDisabled: false,
        forkChainId: 1,
      },
      created() {
        vi.fn();
      },
    });

    expect(wrapper.find(".dropdown-item").exists()).toBe(true);
    expect(wrapper.find(".dropdown-item").text()).toBe(
      "No borrow on this network In the future they will be displayed here"
    );
  });

  it("renders correctly when cauldronData is not null", () => {
    const mockCauldronData = [
      {
        id: 1,
        name: "Cauldron 1",
        address: "0x1234567890abcdef",
        icon: "cauldron1.png",
        interest: 5,
      },
      {
        id: 2,
        name: "Cauldron 2",
        address: "0xabcdef1234567890",
        icon: "cauldron2.png",
        interest: 10,
      },
    ];

    const wrapper = shallowMount(Cauldrons, {
      directives: { clickOutside },
      propsData: {
        isDisabled: false,
        forkChainId: 1,
      },
      data(): any {
        return {
          cauldronData: mockCauldronData,
        };
      },
      created() {
        vi.fn();
      },
    });

    const dropdownItems = wrapper.findAll(".dropdown-item");
    expect(dropdownItems.length).toBe(mockCauldronData.length);

    dropdownItems.forEach((dropdownItem, index) => {
      const data = mockCauldronData[index];
      expect(
        dropdownItem.find(".dropdown-item-info img").attributes("src")
      ).toBe(data.icon);
      expect(dropdownItem.find(".dropdown-item-info span").text()).toBe(
        data.name
      );

      expect(dropdownItem.find(".interest").text()).toBe(`${data.interest}%`);
      expect(dropdownItem.findAll("span")[3].text()).toBe(
        `${data.address.slice(0, 6)}...${data.address.slice(-6)}`
      );
    });
  });
});
