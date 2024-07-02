import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import EmpowerCard from "@/components/cauldrons/promoCards/EmpowerCard.vue";

describe("EmpowerCard", () => {
  it("renders the card with the correct classes and attributes", () => {
    const wrapper = shallowMount(EmpowerCard);

    expect(wrapper.classes()).toContain("empower-card");
    expect(wrapper.attributes("href")).toBe(
      "https://www.tally.xyz/profile/0xa71a021ef66b03e45e0d85590432dfcfa1b7174c?governanceId=eip155:42161:0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9"
    );
    expect(wrapper.attributes("target")).toBe("_blank");
    expect(wrapper.attributes("rel")).toBe("noreferrer noopener");
  });

  it("renders the title and description correctly", () => {
    const wrapper = shallowMount(EmpowerCard);

    const title = wrapper.find(".title");
    expect(title.text()).toBe("Empower the ecosystem");

    const description = wrapper.find(".description");
    expect(description.findAll(".text")[0].text()).toBe("Delegate Your ARB");
    expect(description.findAll(".text")[1].text()).toBe("to Abracadabra DAO");
  });
});
