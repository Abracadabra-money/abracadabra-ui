import { describe, it, expect } from "vitest";

import { getLiquidationPrice } from "./getUserLiquidationPrice";

describe("getLiquidationPrice function", () => {
  it("should return 0 if userCollateralShare is 0", () => {
    expect(getLiquidationPrice(0, 100, 50)).toBe(0);
  });

  it("should return 0 if userBorrowPart is 0", () => {
    expect(getLiquidationPrice(100, 0, 50)).toBe(0);
  });

  it("should return correct liquidation price for given input values", () => {
    expect(getLiquidationPrice(1000, 200, 20)).toBe(1);
    expect(getLiquidationPrice("1000", "200", 20)).toBe(1);
  });
});
