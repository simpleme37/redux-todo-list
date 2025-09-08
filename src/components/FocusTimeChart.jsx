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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// 取 Tailwind 變數裡的顏色
const rootStyle = getComputedStyle(document.documentElement);
const purple = rootStyle.getPropertyValue('--color-purple').trim();

export default function FocusTimeChart({ days }) {
  const data = {
    labels: days.map(d => d.label),
    datasets: [
      {
        label: '專注分鐘數',
        data: days.map(d => d.minutes),
        backgroundColor: purple,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 25,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
