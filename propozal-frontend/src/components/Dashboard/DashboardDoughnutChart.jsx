import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardDoughnutChart = ({ data = [] }) => {
  const labels = data.map((d) => d.industry || '기타');
  const values = data.map((d) => d.customerCount || 0);
  const palette = [
    'rgba(255, 99, 132, 0.6)',
    'rgba(54, 162, 235, 0.6)',
    'rgba(255, 206, 86, 0.6)',
    'rgba(75, 192, 192, 0.6)',
    'rgba(153, 102, 255, 0.6)',
    'rgba(255, 159, 64, 0.6)'
  ];
  const paletteBorder = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
  ];
  const chartData = {
    labels,
    datasets: [
      {
        label: '업종별 고객 비율',
        data: values,
        backgroundColor: labels.map((_, i) => palette[i % palette.length]),
        borderColor: labels.map((_, i) => paletteBorder[i % paletteBorder.length]),
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

  return <Doughnut data={chartData} options={options} />;
};

export default DashboardDoughnutChart;
