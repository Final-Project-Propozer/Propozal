import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardDoughnutChart = () => {
  const data = {
    labels: ['제조업', '농업', '축산업', '어업'],
    datasets: [
      {
        label: '고객 비율',
        data: [30, 25, 20, 25], // 비율 데이터를 입력합니다.
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // 그래프 옵션 설정 (가운데가 비어있는 도넛형으로 설정)
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '70%', // 이 옵션이 도넛형 그래프의 가운데 빈 공간 크기를 결정합니다.
    plugins: {
      legend: {
        position: 'right', // 범례 위치
        labels: {
          boxWidth:15,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DashboardDoughnutChart;
