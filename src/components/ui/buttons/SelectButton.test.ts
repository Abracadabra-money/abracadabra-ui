import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import SelectButton from "@/components/ui/buttons/SelectButton.vue";
import { useImage } from "@/helpers/useImage";

describe("SelectButton.vue", () => {
  const activeToken = {
    name: "Ethereum",
    icon: useImage("assets/images/tokens/ETH.png"),
  };

  const wrapper: any = mount(SelectButton, {
    props: { activeToken },
  });

  it("Should render correct token name", async () => {
    const selectBtn = wrapper.find(".select-button");
    expect(selectBtn.text()).toBe(activeToken.name);
  });
});
