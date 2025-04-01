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
