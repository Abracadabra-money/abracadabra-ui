import { expect, describe, it } from "vitest";
import type { TokenInfo } from "@/helpers/pools/swap/tokens";
import { getRoutesInfo } from "@/helpers/pools/swap/getRoutesInfo";

const tokensList: TokenInfo[] = [
  {
    config: {
      contract: {
        address: "0x01",
        abi: "ERC20",
      },
      decimals: 18,
      icon: "MIM.png",
      isPopular: true,
      mainColor: "#C9E5FF",
      name: "MIM",
    },
    price: 0.980105,
    userInfo: {
      allowance: 0n,
      balance: 0n,
    },
  },
  {
    config: {
      contract: {
        address: "0x02",
        abi: "ERC20",
      },
      decimals: 18,
      icon: "USDB.png",
      isPopular: true,
      mainColor: "#C9E5FF",
      name: "MIM",
    },
    price: 0.980105,
    userInfo: {
      allowance: 0n,
      balance: 0n,
    },
  },
  {
    config: {
      contract: {
        address: "0x03",
        abi: "ERC20",
      },
      decimals: 18,
      icon: "USDT.png",
      isPopular: true,
      mainColor: "#C9E5FF",
      name: "USDT",
    },
    price: 0.980105,
    userInfo: {
      allowance: 0n,
      balance: 0n,
    },
  },
  {
    config: {
      contract: {
        address: "0x04",
        abi: "ERC20",
      },
      decimals: 18,
      icon: "BTC.png",
      isPopular: true,
      mainColor: "#C9E5FF",
      name: "BTC",
    },
    price: 0.980105,
    userInfo: {
      allowance: 0n,
      balance: 0n,
    },
  },
];

const routes: any = [
  {
    fees: 500000000000000n,
    inputAmount: 0n,
    inputToken: "0x01",
    lpInfo: {
      icon: "lp-icon",
    },
    outputAmount: 0n,
    outputToken: "0x02",
  },
];

const routings: any = [
  {
    fees: 500000000000000n,
    inputAmount: 0n,
    inputToken: "0x01",
    lpInfo: {
      icon: "lp-icon",
    },
    outputAmount: 0n,
    outputToken: "0x02",
  },
  {
    fees: 300000000000000n,
    inputAmount: 0n,
    inputToken: "0x03",
    lpInfo: {
      icon: "lp-icon",
    },
    outputAmount: 0n,
    outputToken: "0x04",
  },
];

describe("getRoutesInfo", () => {
  it("should return an empty array if tokensList or routes is undefined", () => {
    const tokensList = undefined;
    const routes = undefined;

    const result = getRoutesInfo(tokensList, routes);

    expect(result).toEqual([]);
  });

  it("should return an empty array if tokensList or routes is empty", () => {
    const tokensList: [] = [];
    const routes: [] = [];

    const result = getRoutesInfo(tokensList, routes);

    expect(result).toEqual([]);
  });

  it("should return correct information about one routing", () => {
    const expected = [
      {
        address: "0x01",
        icon: "MIM.png",
        percent: "100%",
      },
      {
        address: "0x02",
        icon: "lp-icon",
        percent: "0.05%",
      },
    ];

    const result = getRoutesInfo(tokensList, routes);

    expect(result).toEqual(expected);
  });

  it("should return correct information about routings", () => {
    const expected = [
      {
        address: "0x01",
        icon: "MIM.png",
        percent: "100%",
      },
      {
        address: "0x02",
        icon: "lp-icon",
        percent: "0.05%",
      },
      {
        address: "0x03",
        icon: "USDT.png",
        percent: "100%",
      },
      {
        address: "0x04",
        icon: "lp-icon",
        percent: "0.03%",
      },
    ];

    const result = getRoutesInfo(tokensList, routings);

    expect(result).toEqual(expected);
  });
});
