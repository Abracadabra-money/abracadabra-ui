import { formatUnits } from "viem";
import { formatLargeSum } from "@/helpers/filters";

export const getPoolTvlPieChartOption = async (pool: any) => {
  const tvlByToken: TvlByToken = await getTvlByToken(pool);

  const baseTokenName = pool.config.baseToken.name;
  const quoteTokenName = pool.config.quoteToken.name;

  return {
    title: {
      show: true,
      text: `TVL`,
      textStyle: {
        color: "rgba(153, 160, 178, 1)",
        fontSize: 14,
        fontWeight: "500",
        fontFamily: "Poppins",
      },
      subtext: `$${formatLargeSum(tvlByToken.total)}`,
      subtextStyle: {
        fontSize: 32,
        fontWeight: "500",
        fontFamily: "Poppins",
        color: "white",
      },
      textAlign: "center",
      x: "47.5%",
      y: "35%",
    },

    series: [
      {
        name: "TVL",
        type: "pie",
        radius: ["65%", "95%"],
        avoidLabelOverlap: true,
        label: {
          show: false,
          color: "white",
          rich: {
            name: {
              fontSize: 14,
              fontWeight: "500",
              fontFamily: "Poppins",
              color: "rgba(153, 160, 178, 1)",
            },
            value: {
              fontSize: 32,
              fontWeight: "500",
              fontFamily: "Poppins",
              padding: [12, 0, 4, 0],
            },
            percent: {
              fontSize: 14,
              fontWeight: "500",
              fontFamily: "Poppins",
              color: "rgba(153, 160, 178, 1)",
            },
          },
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            formatter: function (params: any) {
              const value = formatLargeSum(params.value.toString());
              return [
                `{name|${params.name}}` +
                "\n" +
                `{value|$${value}}` +
                "\n" +
                `{name|${params.percent}%}`,
              ].join();
            },
          },
        },
        data: [
          {
            value: tvlByToken.base,
            name: baseTokenName,
            itemStyle: { color: "#745CD2" },
          },
          {
            value: tvlByToken.quote,
            name: quoteTokenName,
            itemStyle: { color: "#2D4A96" },
          },
        ],
      },
    ],
  };
};

const getTvlByToken = async (pool: any) => {
  const baseTokenDecimals = pool.config.baseToken.decimals;
  const quoteTokenDecimals = pool.config.quoteToken.decimals;

  const baseTokenAmount = pool.vaultReserve[0];
  const quoteTokenAmount = pool.vaultReserve[1];

  const baseTokenValue = Number(formatUnits(baseTokenAmount, baseTokenDecimals));
  const quoteTokenValue = Number(formatUnits(quoteTokenAmount, quoteTokenDecimals));

  return {
    base: baseTokenValue,
    quote: quoteTokenValue,
    total: baseTokenValue + quoteTokenValue
  };
};

type TvlByToken = {
  base: number;
  quote: number;
  total: number;
};
