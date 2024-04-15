import { formatLargeSum } from "@/helpers/filters";

export const getPoolTvlPieChartOption = (
    pool: any
) => {
    const tvlByCategory: TvlByCategory = getFeesByCategory(pool);

    return {
        title: {
            show: true,
            text: `Total`,
            textStyle: {
                color: "rgba(153, 160, 178, 1)",
                fontSize: 14,
                fontWeight: "500",
                fontFamily: "Poppins",
            },
            subtext: `$${tvlByCategory.total}`,
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

const getFeesByCategory = (pool: any) => {

    return {
        staked: '20',
        locked: '10',
        total: '30',
    };
};

type TvlByCategory = {
    staked: number | string;
    locked: number | string;
    total: string;
};