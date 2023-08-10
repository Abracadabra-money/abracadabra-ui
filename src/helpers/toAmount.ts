import type { BigNumber, Contract } from "ethers";

const toAmount = async (
  bentoBox: Contract,
  token: string,
  share: BigNumber,
  roundUp: boolean = false
): Promise<BigNumber | undefined> => {
  try {
    const total = await bentoBox.totals(token);

    if (total.base.eq(0)) return share;

    let amount = share.mul(total.elastic).div(total.base);

    if (roundUp && amount.mul(total.base).div(total.elastic).lt(share)) {
      amount = amount.add(1);
    }

    return amount;
  } catch (error) {
    console.log("toAmount error:", error);
  }
};


export default toAmount;