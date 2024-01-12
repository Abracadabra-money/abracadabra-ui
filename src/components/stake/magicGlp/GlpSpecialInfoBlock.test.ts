import { describe, it, expect } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";
import GetTokenLink from "@/components/ui/links/GetTokenLink.vue";
import GlpSpecialInfoBlock from "@/components/stake/magicGlp/GlpSpecialInfoBlock.vue";

describe("GlpSpecialInfoBlock", () => {
  const BUY_GLP_LINK = "https://app.gmx.io/#/buy_glp";
  const SELL_GLP_LINK = "https://app.gmx.io/#/buy_glp#redeem";

  it("renders the component", () => {
    const wrapper = shallowMount(GlpSpecialInfoBlock);
    expect(wrapper.exists()).toBe(true);
  });

  it("displays the title", () => {
    const wrapper = shallowMount(GlpSpecialInfoBlock);
    const title = wrapper.find(".title");
    expect(title.text()).toBe("Simply deposit your GLP");
  });

  it("displays the links", () => {
    const wrapper = mount(GlpSpecialInfoBlock, {
      globals: {
        components: { GetTokenLink },
      },
    });
    const links = wrapper.findAll(".links-wrap a");
    console.log(11111, links);

    expect(links.length).toBe(2);
    expect(links[0].text()).toBe("Buy GLP");
    expect(links[0].attributes("href")).toBe(BUY_GLP_LINK);
    expect(links[1].text()).toBe("Sell GLP");
    expect(links[1].attributes("href")).toBe(SELL_GLP_LINK);
  });

  it("displays the text", () => {
    const wrapper = shallowMount(GlpSpecialInfoBlock);
    const text = wrapper.findAll(".text");
    expect(text.length).toBe(2);
    expect(text[0].text()).toBe(
      "Enjoy the benefits of compounding without having to worry about the tedious work! Simply deposit your GLP into MagicGLP and let it do its magic!"
    );
    expect(text[1].text()).toBe(
      "Note: A 1% protocol fee is taken on the yields."
    );
  });
});
