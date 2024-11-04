import React from 'react';
import { Chart } from 'primereact/chart';
import { ProgressBar as PrimeProgressBar } from 'primereact/progressbar';
import { Card } from 'primereact/card';
import { ProgressBarProps } from '../../types/ProgressBar';

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const data = [
    {
      name: 'Personal Data',
      progress: progress.personal,
      fill: '#4f46e5'
    },
    {
      name: 'Accident Data',
      progress: progress.accident,
      fill: '#7c3aed'
    },
    {
      name: 'Injury Data',
      progress: progress.injury,
      fill: '#9333ea'
    }
  ];

  // הגדרות התרשים של PrimeReact
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        label: 'Progress',
        data: data.map(item => item.progress),
        backgroundColor: data.map(item => item.fill),
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: '#f3f4f6'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto my-4">
      <div className="border-bottom-1 surface-border pb-3 mb-3">
        <h2 className="text-xl font-semibold text-900">Progress Tracking</h2>
      </div>
      <div className="space-y-4">
        {/* תרשים עמודות */}
        <div className="h-64">
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>

        {/* פסי התקדמות */}
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex justify-content-between align-items-center">
                <span className="font-medium text-700">{item.name}</span>
                <span className="text-600">{item.progress.toFixed(1)}%</span>
              </div>
              <PrimeProgressBar 
                value={item.progress} 
                showValue={false}
                style={{ height: '8px' }}
                color={item.fill}
                className="custom-progress-bar"
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProgressBar;