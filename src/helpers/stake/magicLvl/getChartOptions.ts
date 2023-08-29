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
            if (+value < 1) return ` ${label} ${value.toFixed(6)}%`;
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
          callback: function (value: any) {
            if (+value === 0) return `% ${Number(value).toFixed(2)}`;
            if (+value < 1) return `% ${Number(value).toFixed(6)}`;
            return `% ${Number(value).toFixed(2)}`;
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
