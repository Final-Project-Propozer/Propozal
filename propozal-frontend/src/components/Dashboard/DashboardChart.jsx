import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js에 필요한 요소들을 등록합니다.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashBoardChart = ({ data = [] }) => {
  // 백엔드에서 받은 monthlyPerformance 배열을 사용합니다.
  const labels = data.map((d) => d.month);
  const values = data.map((d) => d.estimateCount);
  const chartData = {
    labels,
    datasets: [
      {
        label: '월별 견적 추이(건수)',
        data: values,
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // 그래프의 옵션 설정
  const options = {
    responsive: true,
    maintainAspectRatio: false, // 부모 컨테이너 크기에 맞춰 비율을 조정합니다.
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: '',
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default DashBoardChart;