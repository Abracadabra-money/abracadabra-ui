import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import DepositButton from "@/components/ui/buttons/DepositButton.vue";

describe("DepositButton", () => {
  it("renders the button when depositConfig is available", () => {
    const wrapper = shallowMount(DepositButton, {
      props: {
        cauldron: {
          config: {
            id: "cauldron-id",
            chainId: "chain-id",
          },
        },
      },
      computed: {
        depositConfig() {
          return {
            id: 15,
            chain: 1,
            title: "Deposit",
            type: "3crv",
            data: {
              address: "0xd92494CB921E5C0d3A39eA88d0147bbd82E51008",
            },
          };
        },
      },
    });

    expect(wrapper.find(".deposit-button").exists()).toBe(true);
  });

  it("does not render the button when depositConfig is not available", () => {
    const wrapper = shallowMount(DepositButton, {
      props: {
        cauldron: {
          config: {},
        },
      },
    });

    expect(wrapper.find(".deposit-button").exists()).toBe(false);
  });
});
