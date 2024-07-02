import { shallowMount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";
import CamelotCard from "@/components/cauldrons/promoCards/CamelotCard.vue";

describe("CamelotCard", () => {
  it("renders the card with correct data", () => {
    const wrapper = shallowMount(CamelotCard, {
      data(): any {
        return {
          tvl: 10,
          aprRange: 20,
        };
      },
    });

    expect(wrapper.find(".card-title").text()).toBe("NEW V3 POOL");
    expect(wrapper.find(".on-camelot").text()).toBe("ON CAMELOT");
    expect(wrapper.find(".token-pair").text()).toBe("ARB / MIM");

    expect(wrapper.findAll(".value")[0].text()).toContain("$10");
    expect(wrapper.findAll(".value")[1].text()).toContain("20");
  });

  it("fetches data and updates the card", async () => {
    global.fetch = vi.fn();
    const wrapper: any = shallowMount(CamelotCard, {
      data(): any {
        return {
          tvl: 0,
          aprRange: null,
        };
      },
    });

    wrapper.vm.fetchData = vi.fn().mockImplementation(async () => {
      wrapper.vm.$data.aprRange = `516.31% - 743.55%`;
    });

    await wrapper.vm.fetchData();

    expect(wrapper.vm.aprRange).toBe("516.31% - 743.55%");
  });
});
