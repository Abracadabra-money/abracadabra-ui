import { shallowMount } from "@vue/test-utils";
import { describe, it, expect } from "vitest";
import CrvUsdMimCard from "@/components/cauldrons/promoCards/CrvUsdMimCard.vue";

describe("CrvUsdMimCard", () => {
  it("renders the card with correct data", () => {
    const wrapper = shallowMount(CrvUsdMimCard, {
      data(): any {
        return {
          tvl: 1000000,
          apr: 5,
        };
      },
    });

    expect(wrapper.find(".card-title").text()).toBe("NEW Pool");
    expect(wrapper.find(".subtitle").text()).toBe("On Curve finance");
    expect(wrapper.find(".token-pair").text()).toBe("crvUSD / MIM");
    expect(wrapper.find(".value").text()).toBe("$1M");
  });
});
