import { getTvl } from "@/helpers/stake/magicApe/subgraph/getTvl";
import { getYield } from "@/helpers/stake/magicApe/subgraph/getYield";
import { getPrice } from "@/helpers/stake/magicApe/subgraph/getPrice";
import { getMagicGlpTvl } from "@/helpers/stake/magicGlp/subgraph/getChartData/getMagicGlpTvl";

export const getChartData = async (
  type: any,
  period: any,
  chainId: number,
  feePercent: any
) => {
  let chartData: any;

  try {
    switch (type) {
      case "Yield":
        chartData = await getYield(period, chainId);
        break;
      case "TVL":
        chartData = await getTvl(type, period, chainId);
        break;
      case "Price":
        chartData = await getPrice(type, period, chainId);
        break;
      case "magicGlpTvl":
        chartData = await getMagicGlpTvl(chainId, period, feePercent);
        break;
      default:
        console.log("Error Get Chart Data");
    }
  } catch (error) {
    return { error: "No results found" };
  }

  return chartData;
};
