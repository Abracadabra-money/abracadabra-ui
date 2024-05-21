type LabelCtx = {
  dataset: {
    label: string;
    data: number[];
  };
  dataIndex: number;
};

export const getChartOptions = () => {
  return {
    responsive: true,
    plugins: {
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context: LabelCtx) {
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
          callback: function (value: number) {
            return `${value.toFixed(2)}%`;
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
