import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function PatternAlert() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAlerts() {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:4000/api/v1/patterns/pattern-alerts', {
        withCredentials: true
      });
      if (res.data && res.data.alerts) setAlerts(res.data.alerts);
      console.log('Fetched alerts:', res.data.alerts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAlerts();
    // const id = setInterval(fetchAlerts, 150000);
    // return () => clearInterval(id);
  }, []);

  // Sort data
  const nameDataSorted = [...alerts.filter(a => a.type === 'name')].sort((a, b) => b.count - a.count);
  const cardDataSorted = [...alerts.filter(a => a.type === 'cardNumber')].sort((a, b) => b.count - a.count);

  // Chart data
  const nameChartData = {
    labels: nameDataSorted.map(a => a.key),
    datasets: [
      {
        label: 'Name Count',
        data: nameDataSorted.map(a => a.count),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderRadius: 10,
        barThickness: 80
      }
    ]
  };

  const cardChartData = {
    labels: cardDataSorted.map(a => a.key),
    datasets: [
      {
        label: 'Card Number Count',
        data: cardDataSorted.map(a => a.count),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderRadius: 10,
        barThickness: 80
      }
    ]
  };

  // Chart options with riskScore tooltip
  const chartOptions = (sortedData) => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataItem = sortedData[context.dataIndex];
            return [
              `Count: ${context.parsed.y}`,
              `Risk Score: ${dataItem?.riskScore || 'N/A'}`
            ];
          }
        }
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  });

  return (
    <div style={{ padding: '20px' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '400px', background: '#fff', padding: '20px', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '15px' }}>Suspicious Name Matches</h3>
            <Bar data={nameChartData} options={chartOptions(nameDataSorted)} />
          </div>
          <div style={{ flex: 1, minWidth: '400px', background: '#fff', padding: '20px', borderRadius: '10px' }}>
            <h3 style={{ marginBottom: '15px' }}>Suspicious Card Number Matches</h3>
            <Bar data={cardChartData} options={chartOptions(cardDataSorted)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default PatternAlert;
