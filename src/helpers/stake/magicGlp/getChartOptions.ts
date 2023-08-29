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
            return ` ${label} ${data[dataIndex].toFixed(2)}%`;
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
            return `${value}%`;
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
