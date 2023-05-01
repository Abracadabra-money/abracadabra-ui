import { describe, it, expect } from "vitest";

import { BigNumber } from "ethers";

import { getInterest } from "./getInterest";

describe("getInterest()", () => {
  it("should return interest if accrueInfo INTEREST_PER_SECOND more than 0", () => {
    const accrueInfo = {
      INTEREST_PER_SECOND: BigNumber.from(317097920),
    }
    const result = getInterest(accrueInfo);
    expect(result).toBe("1.0");
  });

  it("should return 0 if accrueInfo INTEREST_PER_SECOND is 0", () => {
    const accrueInfo = {
      INTEREST_PER_SECOND: BigNumber.from(0),
    }
    const result = getInterest(accrueInfo);
    expect(result).toBe("0.0");
  });

  it("shoud return 0 if accrueInfo has no INTEREST_PER_SECOND", () => {
    const accrueInfo = { }
    const result = getInterest(accrueInfo);
    expect(result).toBe("0.0");
  });
});
