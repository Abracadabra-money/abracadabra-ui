import type { BigNumber, Contract } from "ethers";

const toAmount = async (
  bentoBox: Contract,
  token: string,
  base: BigNumber,
  roundUp: boolean = false
): Promise<BigNumber | undefined> => {
  try {
    const total = await bentoBox.totals(token);

    if (total.base.eq(0)) return base;

    let elastic = base.mul(total.elastic).div(total.base);

    if (roundUp && elastic.mul(total.base).div(total.elastic).lt(base)) {
      elastic = elastic.add(1);
    }

    return elastic;
  } catch (error) {
    console.log("toAmount error:", error);
  }
};


export default toAmount;