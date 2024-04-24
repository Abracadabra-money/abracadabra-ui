import { formatUnits } from "viem";
import { formatLargeSum } from "@/helpers/filters";
import store from "@/store";
import type { PoolInfo } from "@/configs/pools/types";

export const getPoolTvlPieChartOption = async (pool: any) => {
  const tvlByCategory: TvlByCategory = await getTvlByCategory(pool);

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
      subtext: `$${formatLargeSum(tvlByCategory.total)}`,
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
            value: tvlByCategory.locked,
            name: "Locked",
            itemStyle: { color: "#2881D6" },
          },
          {
            value: +tvlByCategory.staked,
            name: "Staked",
            itemStyle: { color: "#9788D7" },
          },
        ],
      },
    ],
  };
};

const getTvlByCategory = async (pool: PoolInfo) => {
  if (!pool.lockContract)
    return {
      staked: 0,
      locked: 0,
      total: 0,
    };

  const publicClient = store.getters.getChainById(pool.chainId).publicClient;

  const total =
    Number(formatUnits(pool.totalSupply, pool.decimals)) * pool.price;

  const lockedSupply: any = await publicClient.readContract({
    address: pool.lockContract.address,
    abi: pool.lockContract.abi,
    functionName: "lockedSupply",
  });

  const locked = Number(formatUnits(lockedSupply, pool.decimals)) * pool.price;

  const staked = total - locked;

  return {
    staked,
    locked,
    total,
  };
};

type TvlByCategory = {
  staked: number | string;
  locked: number | string;
  total: number | string;
};
