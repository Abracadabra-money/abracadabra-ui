import { ethers } from "ethers";
import { getTokenPriceByAddress } from "../priceHelper";

const communityIssuanceAddress = "0xD8c9D9071123a059C6E0A945cF0e0c82b508d816";
import communityIssuanceAbi from "@/utils/abi/communityIssuacneLUSD";

const stabilityPoolAddress = "0x66017D22b0f8556afDd19FC67041899Eb65a21bb";
import stabilityPoolAbi from "@/utils/abi/StabilityPoolLUSD";

const getLUSDApy = async (signer) => {
  try {
    const communityIssuanceContract = new ethers.Contract(
      communityIssuanceAddress,
      JSON.stringify(communityIssuanceAbi),
      signer
    );

    const stabilityPoolContract = new ethers.Contract(
      stabilityPoolAddress,
      JSON.stringify(stabilityPoolAbi),
      signer
    );

    const lqtyPrice = await getTokenPriceByAddress(
      1,
      "0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d"
    );

    const totalLQTYIssued = await communityIssuanceContract.totalLQTYIssued();
    const issuanceCap = await communityIssuanceContract.LQTYSupplyCap();

    const remainingStabilityPoolLQTYReward = ethers.utils.formatUnits(
      issuanceCap.sub(totalLQTYIssued)
    );

    const lusdInStabilityPool = ethers.utils.formatUnits(
      await stabilityPoolContract.getTotalLUSDDeposits()
    );

    const yearlyIssuanceFraction = 0.5;
    const dailyIssuanceFraction = 1 - yearlyIssuanceFraction ** (1 / 365);

    const lqtyIssuanceOneDay =
      +remainingStabilityPoolLQTYReward * dailyIssuanceFraction;

    const lqtyIssuanceOneDayInUSD = lqtyIssuanceOneDay * lqtyPrice;

    const aprPercentageBase =
      (lqtyIssuanceOneDayInUSD * (365 * 100)) / lusdInStabilityPool;

    const apr = aprPercentageBase * 0.95 * 0.2;
    
    return apr;
  } catch (error) {
    console.log("getLUSDApy error:", error);
    return false
  }
};

export { getLUSDApy };
