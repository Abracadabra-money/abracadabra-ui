import { describe, it, expect, vi } from "vitest";

import { BigNumber } from "ethers";

import { getInterest } from "./interest";

describe("getInterest()", () => {
  it("should execute accrueInfo", async () => {
    const dummyCauldron = {
      accrueInfo: vi.fn(() => {
        return {};
      }),
    };

    await getInterest(dummyCauldron);
    expect(dummyCauldron.accrueInfo).toBeCalled();
  });

  it("should return interest if accrueInfo INTEREST_PER_SECOND more than 0", async () => {
    const dummyCauldron = {
      accrueInfo: () => {
        return {
          INTEREST_PER_SECOND: BigNumber.from(1e8),
        };
      },
    };
    const result = await getInterest(dummyCauldron);
    expect(Number(result)).toBeGreaterThan(0);
  });

  it("should return 0 if accrueInfo INTEREST_PER_SECOND is 0", async () => {
    const dummyCauldron = {
      accrueInfo: () => {
        return {
          INTEREST_PER_SECOND: BigNumber.from(0),
        };
      },
    };
    const result = await getInterest(dummyCauldron);
    expect(Number(result)).toBe(0);
  });

  it("shoud return 0 if accrueInfo has no INTEREST_PER_SECOND", async () => {
    const dummyCauldron = {
      accrueInfo: () => {
        return {};
      },
    };
    const result = await getInterest(dummyCauldron);
    expect(result).toBe("0");
  });
});
