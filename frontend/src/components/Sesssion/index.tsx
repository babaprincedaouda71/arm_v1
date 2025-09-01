import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const data = {
  labels: ['13 May', '14 May', '15 May', '16 May', '17 May', '18 May'],
  datasets: [
    {
      label: 'Members',
      data: [300, 320, 300, 310, 300, 320],
      backgroundColor: '#a5b4fc', // Correspond à la couleur bleu clair
    },
    {
      label: 'Shortlisted',
      data: [100, 120, 110, 115, 105, 110],
      backgroundColor: '#fcd34d', // Correspond à la couleur jaune
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
};

const SessionChart = () => {
  return (
    <div className="p-2 bg-white rounded-lg shadow-lg w-2/5">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Session</h2>
        <div className="flex space-x-2 text-sm bg-white p-2 rounded-md shadow">
          <span className="">15-18 July</span>
          <button className="">▼</button>
        </div>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SessionChart;
