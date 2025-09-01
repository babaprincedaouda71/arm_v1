// components/DepartmentChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Colors,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DepartmentChart = () => {
  const data = {
    labels: ["Engineering", "IT", "Marketing", "Security"],
    datasets: [
      {
        label: "Departments",
        data: [19, 11, 6, 2],
        backgroundColor: ["#a3bffa", "#fddb7e", "#89d4f5", "#b3b3ff"],
        borderRadius: 5,
        borderSkipped: false,
        barPercentage: 0.3,
        categoryPercentage: 0.5,
        barThickness: 19,
        fontSize: 17,
        fontWeight: 700,
        Colors: "#6D6E75",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        max: 20,
        ticks: {
          stepSize: 5,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        position: "left",
        ticks: {
          callback: function (value, index) {
            const labels = ["Engineering", "IT", "Marketing", "Security"];
            return labels[index];
          },
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y1: {
        beginAtZero: true,
        position: "right",
        ticks: {
          callback: function (value, index) {
            const numbers = ["03", "05", "04", "05"];
            return numbers[index];
          },
        },
        grid: {
          drawOnChartArea: false,
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: function (context) {
            const numbers = [3, 5, 4, 5];
            return `Number: ${numbers[context.dataIndex]}`;
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default DepartmentChart;
