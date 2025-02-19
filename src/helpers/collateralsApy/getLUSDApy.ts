import { formatUnits, parseUnits } from "viem";
import { getPublicClient } from "@/helpers/chains/getChainsInfo";
import { getTokenPriceByAddress } from "@/helpers/prices/getTokenPriceByAddress";
import { MAINNET_LQTY_ADDRESS } from "@/constants/tokensAddress";
import { MAINNET_CHAIN_ID, ONE_ETHER_VIEM } from "@/constants/global";
import communityIssuanceAbi from "@/abis/communityIssuacneLUSD";
import stabilityPoolAbi from "@/abis/StabilityPoolLUSD";

const NORMAL_DECIMALS = 18;
const ONE_BIGINT = ONE_ETHER_VIEM;

const stabilityPoolAddress = "0x66017D22b0f8556afDd19FC67041899Eb65a21bb";
const communityIssuanceAddress = "0xD8c9D9071123a059C6E0A945cF0e0c82b508d816";

const getLUSDApy = async () => {
  try {
    const lqtyPrice = await getTokenPriceByAddress(1, MAINNET_LQTY_ADDRESS);
    if (!lqtyPrice) return 0;

    const publicClient = getPublicClient(MAINNET_CHAIN_ID)

    const lqtyPriceBigint = parseUnits(lqtyPrice.toString(), NORMAL_DECIMALS);

    const [totalLQTYIssued, issuanceCap, lusdInStabilityPool] = await publicClient.multicall({
      contracts: [
        { address: communityIssuanceAddress, abi: communityIssuanceAbi, functionName: "totalLQTYIssued" },
        { address: communityIssuanceAddress, abi: communityIssuanceAbi, functionName: "LQTYSupplyCap" },
        { address: stabilityPoolAddress, abi: stabilityPoolAbi, functionName: "getTotalLUSDDeposits" },
      ]
    })

    const remainingStabilityPoolLQTYReward: bigint = (issuanceCap.result as bigint) - (totalLQTYIssued.result as bigint);

    const yearlyIssuanceFraction = 0.5;
    const poweredyearlyIssuanceFraction = yearlyIssuanceFraction ** (1 / 365);
    const poweredyearlyIssuanceFractionBigint = parseUnits(poweredyearlyIssuanceFraction.toString(), NORMAL_DECIMALS);
    const dailyIssuanceFraction = ONE_BIGINT - poweredyearlyIssuanceFractionBigint;

    const lqtyIssuanceOneDay =
      (remainingStabilityPoolLQTYReward * dailyIssuanceFraction) / ONE_BIGINT;

    const lqtyIssuanceOneDayInUSD = (lqtyIssuanceOneDay * lqtyPriceBigint) / ONE_BIGINT;

    const aprPercentageBase =
      (lqtyIssuanceOneDayInUSD * (parseUnits('36500', NORMAL_DECIMALS))) / (lusdInStabilityPool.result as bigint);

    const apr = aprPercentageBase * 95n / 100n;

    return Number(formatUnits(apr, NORMAL_DECIMALS));
  } catch (error) {
    console.log("getLUSDApy error:", error);
    return 0;
  }
};

export { getLUSDApy };
