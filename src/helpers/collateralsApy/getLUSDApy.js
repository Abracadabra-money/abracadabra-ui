import { ethers } from "ethers";
import stabilityPoolAbi from "@/utils/abi/StabilityPoolLUSD";
import { MAINNET_LQTY_ADDRESS } from "@/constants/tokensAddress";
import communityIssuanceAbi from "@/utils/abi/communityIssuacneLUSD";
import { getTokenPriceByCoinGecko } from "@/helpers/getTokenPriceByCoinGecko";

const stabilityPoolAddress = "0x66017D22b0f8556afDd19FC67041899Eb65a21bb";
const communityIssuanceAddress = "0xD8c9D9071123a059C6E0A945cF0e0c82b508d816";

const getLUSDApy = async (provider) => {
  try {
    const communityIssuanceContract = new ethers.Contract(
      communityIssuanceAddress,
      JSON.stringify(communityIssuanceAbi),
      provider
    );

    const stabilityPoolContract = new ethers.Contract(
      stabilityPoolAddress,
      JSON.stringify(stabilityPoolAbi),
      provider
    );

    const lqtyPrice = await getTokenPriceByCoinGecko(1, MAINNET_LQTY_ADDRESS);
    if (!lqtyPrice) return 0;

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

    const apr = aprPercentageBase * 0.95;

    return apr;
  } catch (error) {
    console.log("getLUSDApy error:", error);
    return false;
  }
};

export { getLUSDApy };
