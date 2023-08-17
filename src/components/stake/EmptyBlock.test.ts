import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import EmptyBlock from "@/components/stake/EmptyBlock.vue";
import { useImage } from "@/helpers/useImage";

describe("EmptyBlock.vue", async () => {
  it("Should render empty state for sSpell token", async () => {
    const props = { warningType: "sSpell" };

    const sSpellState = {
      img: useImage(`assets/images/empty_borrow.png`),
      text: "Please use Ethereum Mainnet to stake Spell",
      bottom: "If you want to learn more read our docs",
      link: "https://abracadabramoney.gitbook.io/intro/stake/sspell",
    };

    const wrapper = mount(EmptyBlock, { props });

    expect(wrapper.find("img").attributes().src).toBe(sSpellState.img);
    expect(wrapper.find(".empty-text p").text()).toBe(sSpellState.text);
    expect(wrapper.find(".empty-bottom").text()).toBe(
      `${sSpellState.bottom} here`
    );
    expect(wrapper.find(".empty-link").attributes().href).toBe(
      sSpellState.link
    );
  });

  it("Should render empty state for mSpell token", async () => {
    const props = { warningType: "mSpell" };

    const mSpellState = {
      img: useImage(`assets/images/empty_borrow.png`),
      text: "mSPELL staking is available on Avalanche, Arbitrum, Ethereum and Fantom Opera!",
      bottom: "If you want to learn more read our docs",
      link: "https://abracadabramoney.gitbook.io/intro/stake/mspell",
    };

    const wrapper = mount(EmptyBlock, { props });

    expect(wrapper.find("img").attributes().src).toBe(mSpellState.img);
    expect(wrapper.find(".empty-text p").text()).toBe(mSpellState.text);
    expect(wrapper.find(".empty-bottom").text()).toBe(
      `${mSpellState.bottom} here`
    );
    expect(wrapper.find(".empty-link").attributes().href).toBe(
      mSpellState.link
    );
  });

  it("Should render empty state for mGlp token", async () => {
    const props = { warningType: "mglp" };

    const mGlpState = {
      img: useImage(`assets/images/empty_borrow.png`),
      text: "Please use Arbitrum Mainnet to obtain magicGLP",
      bottom: "If you want to learn more read our docs",
      link: "https://abracadabramoney.gitbook.io/learn/intro/stake/mglp",
    };

    const wrapper = mount(EmptyBlock, { props });

    expect(wrapper.find("img").attributes().src).toBe(mGlpState.img);
    expect(wrapper.find(".empty-text p").text()).toBe(mGlpState.text);
    expect(wrapper.find(".empty-bottom").text()).toBe(
      `${mGlpState.bottom} here`
    );
    expect(wrapper.find(".empty-link").attributes().href).toBe(mGlpState.link);
  });

  it("Should render empty state for mApe token", async () => {
    const props = { warningType: "mape" };

    const mGlpState = {
      img: useImage(`assets/images/empty_borrow.png`),
      text: "Please use  Mainnet to obtain magicAPE",
      bottom: "If you want to learn more read our docs",
      link: "https://abracadabramoney.gitbook.io/learn/intro/stake/mglp",
    };

    const wrapper = mount(EmptyBlock, { props });

    expect(wrapper.find("img").attributes().src).toBe(mGlpState.img);
    expect(wrapper.find(".empty-text p").text()).toBe(mGlpState.text);
    expect(wrapper.find(".empty-bottom").text()).toBe(
      `${mGlpState.bottom} here`
    );
    expect(wrapper.find(".empty-link").attributes().href).toBe(mGlpState.link);
  });

  it("Should render empty state for mLvl token", async () => {
    const props = { warningType: "mlvl" };

    const mlvlState = {
      img: useImage(`assets/images/empty_borrow.png`),
      text: "Please use  Binance Smart Chain to obtain magicLVL",
      bottom: "If you want to learn more read our docs",
      link: false,
    };

    const wrapper = mount(EmptyBlock, { props });

    expect(wrapper.find("img").attributes().src).toBe(mlvlState.img);
    expect(wrapper.find(".empty-text p").text()).toBe(mlvlState.text);
    expect(wrapper.find(".empty-bottom").exists()).toBe(false);
    expect(wrapper.find(".empty-link").exists()).toBe(false);
  });
});
