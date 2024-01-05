import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import FarmItem from "@/components/markets/FarmItem.vue";
import BaseTokenIcon from "@/components/base/BaseTokenIcon.vue";

const testFarm = {
  id: 1,
  name: "testName",
  icon: "testIcon",
  isDeprecated: false,
  farmRoi: 100,
  farmTvl: 2000,
};

const store = new Vuex.Store({
  modules: {
    connectProvider: {
      state: { chainId: 56 },
      getters: {
        getChainId: (state) => state.chainId,
      },
    },
  },
});

describe("FarmItem.vue", () => {
  const wrapper = mount(FarmItem, {
    props: { farm: testFarm },
    global: {
      plugins: [store],
    },
  });

  it("Should render correct", () => {
    const marketsLink = wrapper.find(".markets-link");
    expect(marketsLink.exists()).toBe(true);

    expect(wrapper.find(".chain-icon").attributes().src).toContain("BNB.svg");
    expect(wrapper.findComponent(BaseTokenIcon).props().name).toBe("testName");
    expect(wrapper.findComponent(BaseTokenIcon).props().icon).toBe("testIcon");
    expect(wrapper.find(".farm-name").text()).toBe("testName");
    expect(wrapper.find(".farm-deprecated").exists()).not.toBe(true);
    expect(wrapper.find(".link-wrap").exists()).toBe(true);

    const itemsTitle = wrapper.findAll(".item-title");
    const itemsValue = wrapper.findAll(".item-value");

    expect(itemsTitle[0].text()).toBe("APR");
    expect(itemsTitle[1].text()).toBe("TVL");
    expect(itemsValue[0].text()).toBe("100%");
    expect(itemsValue[1].text()).toBe("$ 2,000");
  });

  it("Should render correct if farm isDeprecated", async () => {
    await wrapper.setProps({ farm: { isDeprecated: true } });
    expect(wrapper.find(".farm-deprecated").exists()).toBe(true);
    expect(wrapper.find(".link-wrap").exists()).not.toBe(true);
  });
});
