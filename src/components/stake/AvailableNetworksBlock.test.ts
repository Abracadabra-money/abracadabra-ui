import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import AvailableNetworksBlock from "@/components/stake/AvailableNetworksBlock.vue";

describe("AvailableNetworksBlock", () => {
  it("renders the correct number of network buttons", () => {
    const availableNetworks = [1, 2, 3];
    const selectedNetwork = 2;
    const wrapper = shallowMount(AvailableNetworksBlock, {
      propsData: { availableNetworks, selectedNetwork },
    });

    const networkButtons = wrapper.findAll(".network-button");
    expect(networkButtons.length).toBe(availableNetworks.length);
  });

  it("emits the changeNetwork event when a network button is clicked", () => {
    const availableNetworks = [1, 2, 3];
    const selectedNetwork = 2;
    const wrapper = shallowMount(AvailableNetworksBlock, {
      propsData: { availableNetworks, selectedNetwork },
    });

    const networkButton = wrapper.find(".network-button");
    networkButton.trigger("click");

    expect(wrapper.emitted().changeNetwork).toBeTruthy();
    expect((wrapper.emitted().changeNetwork as number[][])[0][0]).toBe(
      availableNetworks[0]
    );
  });
});
