export const getChartOptions = () => {
  return {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context: any) {
            const { dataset, dataIndex } = context;
            const { label, data } = dataset;
            const value = +data[dataIndex];
            if (label === "TVL") return ` ${label} $ ${value.toFixed(4)}`;
            if (label === "PRICE") return ` $ ${value.toFixed(2)} mAPE`;
            if (label === "APE") {
              return ` ${label}           ${value.toFixed(2)}%`;
            }
            return ` ${label} ${value.toFixed(2)}%`;
          },
        },
      },
      legend: {
        display: false,
      },
      title: {
        color: "#fff",
      },
    },
    scales: {
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: {
            size: 10,
            weight: "light",
          },
          callback: function (value: any): any {
            // @ts-ignore
            const { classList } = this.$context.scale.ctx.canvas.offsetParent;

            const chartValue = value < 1 ? value.toFixed(4) : value;

            if (classList.contains("Yield")) {
              return `${chartValue}%`;
            }

            return `$ ${Number(chartValue).toFixed(2)}`;
          },
        },
      },

      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.5)",
          font: {
            size: 10,
            weight: "light",
          },
        },
      },
    },
  };
};
