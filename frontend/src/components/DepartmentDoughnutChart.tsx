// components/DepartmentDoughnutChart.js
import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DepartmentDoughnutChart = () => {
  const data: ChartData<"doughnut"> = {
    labels: ["05", "04", "03", "02"],
    datasets: [
      {
        data: [5, 4, 3, 2],
        backgroundColor: [
          "#fddb7e", // Color for segment "05"
          "#89d4f5", // Color for segment "04"
          "#a3bffa", // Color for segment "03"
          "#b3b3ff", // Color for segment "02"
        ],
        borderColor: "transparent",
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    cutout: "65%",
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw;
          },
        },
      },
      datalabels: {
        display: true,
        color: "#fff",
        anchor: "center",
        align: "center",
        offset: -10,
        font: {
          size: 20,
          weight: "bold",
        },
        formatter: (value) => value,
      },
    },
  };

  return (
    <div style={{ position: "relative", width: "353.1px", height: "351.83px" }}>
      <Doughnut data={data} options={options} />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <p className="text-[40px] m-0 font-[700]">10</p>

        <p className="m-0">Departments</p>
      </div>
    </div>
  );
};

export default DepartmentDoughnutChart;
