import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expensesByCategory }) => {
  const data = {
    labels: expensesByCategory.map(cat => cat.name),
    datasets: [
      {
        data: expensesByCategory.map(cat => cat.total),
        backgroundColor: expensesByCategory.map(cat => cat.color),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  return <Pie data={data} options={options} />;
};

export default ExpenseChart;