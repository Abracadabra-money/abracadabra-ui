import { BigNumber } from "ethers";
import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import CauldronPositionItem from "@/components/myPositions/CauldronPositionItem.vue";

describe("CauldronPositionItem", () => {
  it("renders correctly", () => {
    // const wrapper = shallowMount(CauldronPositionItem, {
    //   propsData: {
    //     cauldron: {
    //       chainId: 42161,
    //       config: {
    //         id: 2,
    //         wrapInfo: {
    //           unwrappedToken: {
    //             name: "Unwrapped Token",
    //           },
    //         },
    //         collateralInfo: {
    //           name: "Collateral Info",
    //         },
    //         mimInfo: {
    //           name: "MIM",
    //         },
    //       },
    //       apr: 0.05,
    //       liquidationPrice: 100,
    //       positionHealth: 10,
    //       collateralInfo: {
    //         userCollateralAmount: 1000,
    //       },
    //       borrowInfo: {
    //         userBorrowAmount: 500,
    //       },
    //       cauldronSettings: {
    //         isDepreciated: false,
    //       },
    //       oracleRate: BigNumber.from("100"),
    //     },
    //   },
    // });
    // expect(wrapper.exists()).toBe(true);
  });

  // it("displays the correct collateral symbol for MIM", () => {
  //   const wrapper = shallowMount(CauldronPositionItem, {
  //     propsData: {
  //       cauldron: {
  //         chainId: 42161,
  //         config: {
  //           id: 2,
  //           wrapInfo: {
  //             unwrappedToken: {
  //               name: "MIM",
  //             },
  //           },
  //           collateralInfo: {
  //             name: "CollateralName",
  //           },
  //           mimInfo: {
  //             name: "MIM",
  //           },
  //         },
  //         apr: 0.05,
  //         liquidationPrice: 100,
  //         positionHealth: 10,
  //         collateralInfo: {
  //           userCollateralAmount: 1000,
  //         },
  //         borrowInfo: {
  //           userBorrowAmount: 500,
  //         },
  //         oracleRate: BigNumber.from("100"),
  //       },
  //     },
  //   });

  //   const tokenName = wrapper.find(".token-name");
  //   expect(tokenName.text()).toBe("MIM");
  // });

  // it("displays the correct collateral symbol for other tokens", () => {
  //   const wrapper = shallowMount(CauldronPositionItem, {
  //     propsData: {
  //       cauldron: {
  //         chainId: 42161,
  //         config: {
  //           id: 2,
  //           wrapInfo: {
  //             unwrappedToken: {
  //               name: "Unwrapped Token",
  //             },
  //           },
  //           collateralInfo: {
  //             name: "Collateral Info",
  //           },
  //           mimInfo: {
  //             name: "MIM",
  //           },
  //         },
  //         apr: 0.05,
  //         liquidationPrice: 100,
  //         positionHealth: 10,
  //         collateralInfo: {
  //           userCollateralAmount: 1000,
  //         },
  //         borrowInfo: {
  //           userBorrowAmount: 500,
  //         },
  //         oracleRate: BigNumber.from("100"),
  //       },
  //     },
  //   });

  //   const tokenName = wrapper.find(".token-name");
  //   expect(tokenName.text()).toBe("Unwrapped Token");
  // });

  // it("displays the correct APR with 10% APR", () => {
  //   const wrapper = shallowMount(CauldronPositionItem, {
  //     propsData: {
  //       cauldron: {
  //         chainId: 42161,
  //         config: {
  //           id: 2,
  //           wrapInfo: {
  //             unwrappedToken: {
  //               name: "Unwrapped Token",
  //             },
  //           },
  //           collateralInfo: {
  //             name: "Collateral Info",
  //           },
  //           mimInfo: {
  //             name: "MIM",
  //           },
  //         },
  //         apr: 10,
  //         liquidationPrice: 100,
  //         positionHealth: 10,
  //         collateralInfo: {
  //           userCollateralAmount: 1000,
  //         },
  //         borrowInfo: {
  //           userBorrowAmount: 500,
  //         },
  //         oracleRate: BigNumber.from("100"),
  //       },
  //     },
  //   });

  //   const apr = wrapper.find(".apr");
  //   expect(apr.text()).toBe("APR 10%");
  // });

  // it("displays the correct position risk for high health", () => {
  //   const wrapper = shallowMount(CauldronPositionItem, {
  //     propsData: {
  //       cauldron: {
  //         chainId: 42161,
  //         config: {
  //           id: 2,
  //           wrapInfo: {
  //             unwrappedToken: {
  //               name: "Unwrapped Token",
  //             },
  //           },
  //           collateralInfo: {
  //             name: "Collateral Info",
  //           },
  //           mimInfo: {
  //             name: "MIM",
  //           },
  //         },
  //         apr: 0.05,
  //         liquidationPrice: 100,
  //         positionHealth: 3,
  //         collateralInfo: {
  //           userCollateralAmount: 1000,
  //         },
  //         borrowInfo: {
  //           userBorrowAmount: 500,
  //         },
  //         oracleRate: BigNumber.from("100"),
  //       },
  //     },
  //   });

  //   const positionRisk = wrapper.vm.positionRisk;
  //   expect(positionRisk).toBe("high");
  // });

  // it("displays the correct position risk for medium health", () => {
  //   const wrapper = shallowMount(CauldronPositionItem, {
  //     propsData: {
  //       cauldron: {
  //         chainId: 42161,
  //         config: {
  //           id: 2,
  //           wrapInfo: {
  //             unwrappedToken: {
  //               name: "Unwrapped Token",
  //             },
  //           },
  //           collateralInfo: {
  //             name: "Collateral Info",
  //           },
  //           mimInfo: {
  //             name: "MIM",
  //           },
  //         },
  //         apr: 0.05,
  //         liquidationPrice: 100,
  //         positionHealth: 50,
  //         collateralInfo: {
  //           userCollateralAmount: 1000,
  //         },
  //         borrowInfo: {
  //           userBorrowAmount: 500,
  //         },
  //         oracleRate: BigNumber.from("100"),
  //       },
  //     },
  //   });

  //   const positionRisk = wrapper.vm.positionRisk;
  //   expect(positionRisk).toBe("medium");
  // });

  // it("displays the correct position risk for safe health", () => {
  //   const wrapper = shallowMount(CauldronPositionItem, {
  //     propsData: {
  //       cauldron: {
  //         chainId: 42161,
  //         config: {
  //           id: 2,
  //           wrapInfo: {
  //             unwrappedToken: {
  //               name: "Unwrapped Token",
  //             },
  //           },
  //           collateralInfo: {
  //             name: "Collateral Info",
  //           },
  //           mimInfo: {
  //             name: "MIM",
  //           },
  //         },
  //         apr: 0.05,
  //         liquidationPrice: 100,
  //         positionHealth: 80,
  //         collateralInfo: {
  //           userCollateralAmount: 1000,
  //         },
  //         borrowInfo: {
  //           userBorrowAmount: 500,
  //         },
  //         oracleRate: BigNumber.from("100"),
  //       },
  //     },
  //   });

  //   const positionRisk = wrapper.vm.positionRisk;
  //   expect(positionRisk).toBe("safe");
  // });
});
