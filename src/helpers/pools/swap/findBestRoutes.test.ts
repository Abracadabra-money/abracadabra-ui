import { describe, it, expect } from "vitest";
import { findBestSwapPath } from "./findBestRoutes";

describe("find Best Swap Path", () => {
  const testPairs = [
    {
      baseToken: "0xTokenA",
      quoteToken: "0xTokenB",
      lpFeeRate: BigInt("1000000000000000"), // 0.1% fee
      totalSupply: BigInt("1000000000000000000000"), // 1000 tokens
      id: "pair1",
      balances: {
        baseBalance: BigInt("500000000000000000000"), // 500 TokenA
        quoteBalance: BigInt("500000000000000000000"), // 500 TokenB
      },
    },
    {
      baseToken: "0xTokenB",
      quoteToken: "0xTokenC",
      lpFeeRate: BigInt("2000000000000000"), // 0.2% fee
      totalSupply: BigInt("2000000000000000000000"), // 2000 tokens
      id: "pair2",
      balances: {
        baseBalance: BigInt("1000000000000000000000"), // 1000 TokenB
        quoteBalance: BigInt("1000000000000000000000"), // 1000 TokenC
      },
    },
    {
      baseToken: "0xTokenC",
      quoteToken: "0xTokenD",
      lpFeeRate: BigInt("3000000000000000"), // 0.3% fee
      totalSupply: BigInt("3000000000000000000000"), // 3000 tokens
      id: "pair3",
      balances: {
        baseBalance: BigInt("1500000000000000000000"), // 1500 TokenC
        quoteBalance: BigInt("1500000000000000000000"), // 1500 TokenD
      },
    },
  ];

  it("should find the best swap path from TokenA to TokenB", () => {
    const fromToken = "0xTokenA";
    const toToken = "0xTokenB";
    const amountToSwap = BigInt("100000000000000000"); // 0.1 tokens to swap

    const result = findBestSwapPath(
      // @ts-ignore
      testPairs,
      fromToken,
      toToken,
      amountToSwap
    );

    expect(result).toEqual([
      {
        pair: "pair1",
        fromToken: "0xTokenA",
        toToken: "0xTokenB",
        fromBase: true,
      },
    ]);
  });

  it("should find the best swap path from TokenA to TokenC", () => {
    const fromToken = "0xTokenA";
    const toToken = "0xTokenC";
    const amountToSwap = BigInt("100000000000000000"); // 0.1 tokens to swap

    const result = findBestSwapPath(
      // @ts-ignore
      testPairs,
      fromToken,
      toToken,
      amountToSwap
    );

    expect(result).toEqual([
      {
        pair: "pair1",
        fromToken: "0xTokenA",
        toToken: "0xTokenB",
        fromBase: true,
      },
      {
        pair: "pair2",
        fromToken: "0xTokenB",
        toToken: "0xTokenC",
        fromBase: true,
      },
    ]);
  });

  it("should return an empty array if no path is found", () => {
    const fromToken = "0xTokenA";
    const toToken = "0xTokenZ";
    const amountToSwap = BigInt("100000000000000000"); // 0.1 tokens to swap

    const result = findBestSwapPath(
      // @ts-ignore
      testPairs,
      fromToken,
      toToken,
      amountToSwap
    );

    expect(result).toEqual([]);
  });
});

describe("find Best Swap Fees ", () => {
  const testPairs = [
    {
      baseToken: "0xTokenA",
      quoteToken: "0xTokenB",
      lpFeeRate: BigInt("1000000000000000"), // 0.1% fee
      totalSupply: BigInt("1000000000000000000000"), // 1000 tokens
      id: "pair1",
      balances: {
        baseBalance: BigInt("5000000000000000000"), // 5 TokenA
        quoteBalance: BigInt("5000000000000000000"), // 5 TokenB
      },
    },
    {
      baseToken: "0xTokenA",
      quoteToken: "0xTokenB",
      lpFeeRate: BigInt("2000000000000000"), // 0.2% fee
      totalSupply: BigInt("2000000000000000000000"), // 2000 tokens
      id: "pair2",
      balances: {
        baseBalance: BigInt("10000000000000000000"), // 10 TokenA
        quoteBalance: BigInt("10000000000000000000"), // 10 TokenB
      },
    },
    {
      baseToken: "0xTokenA",
      quoteToken: "0xTokenB",
      lpFeeRate: BigInt("3000000000000000"), // 0.3% fee
      totalSupply: BigInt("3000000000000000000000"), // 3000 tokens
      id: "pair3",
      balances: {
        baseBalance: BigInt("1500000000000000000000"), // 1500 TokenA
        quoteBalance: BigInt("1500000000000000000000"), // 1500 TokenB
      },
    },
  ];

  it("should find the best swap path with the lowest fee from TokenA to TokenB", () => {
    const fromToken = "0xTokenA";
    const toToken = "0xTokenB";
    const amountToSwap = BigInt("100000000000000000"); // 0.1 tokens to swap

    const result = findBestSwapPath(
      // @ts-ignore
      testPairs,
      fromToken,
      toToken,
      amountToSwap
    );

    expect(result).toEqual([
      {
        pair: "pair1",
        fromToken: "0xTokenA",
        toToken: "0xTokenB",
        fromBase: true,
      },
    ]);
  });

  it("must find the best exchange path with the lowest commission and with the number of tokens from TokenA to TokenB", () => {
    const fromToken = "0xTokenA";
    const toToken = "0xTokenB";
    const amountToSwap = BigInt("10000000000000000000"); // 10 tokens to swap

    const result = findBestSwapPath(
      // @ts-ignore
      testPairs,
      fromToken,
      toToken,
      amountToSwap
    );

    expect(result).toEqual([
      {
        pair: "pair2",
        fromToken: "0xTokenA",
        toToken: "0xTokenB",
        fromBase: true,
      },
    ]);
  });

  it("must find the best exchange path with the lowest commission and with the number of tokens from TokenA to TokenB", () => {
    const fromToken = "0xTokenA";
    const toToken = "0xTokenB";
    const amountToSwap = BigInt("100000000000000000000"); // 100 tokens to swap

    const result = findBestSwapPath(
      // @ts-ignore
      testPairs,
      fromToken,
      toToken,
      amountToSwap
    );

    expect(result).toEqual([
      {
        pair: "pair3",
        fromToken: "0xTokenA",
        toToken: "0xTokenB",
        fromBase: true,
      },
    ]);
  });
});
