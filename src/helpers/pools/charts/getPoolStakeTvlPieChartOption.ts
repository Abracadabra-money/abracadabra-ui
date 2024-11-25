import { formatUnits } from "viem";
import { formatLargeSum } from "@/helpers/filters";

export const getPoolStakeTvlPieChartOption = async (pool: any) => {
    const tvlByStake: TvlByStake = await getTvlByStake(pool);

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
            subtext: `$${formatLargeSum(tvlByStake.total)}`,
            subtextStyle: {
                fontSize: 32,
                fontWeight: "500",
                fontFamily: "Poppins",
                color: "white",
            },
            textAlign: "center",
            x: "48%",
            y: "36%",
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
                        value: tvlByStake.staked,
                        name: 'Staked',
                        itemStyle: { color: "#745CD2" },
                    },
                    {
                        value: tvlByStake.unstaked,
                        name: 'Unstaked',
                        itemStyle: { color: "#2D4A96" },
                    },
                ],
            },
        ],
    };
};

const getTvlByStake = async (pool: any) => {
    const price = pool.price;
    const total = Number(formatUnits(pool.totalSupply, pool.decimals)) * price;
    const staked = Number(formatUnits(pool.stakedTotalSupply, pool.decimals)) * price;
    const unstaked = (total - staked)

    return {
        staked: staked,
        unstaked: unstaked,
        total: total
    };
};

type TvlByStake = {
    staked: number;
    unstaked: number;
    total: number;
};
