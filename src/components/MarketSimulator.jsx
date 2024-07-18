import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function MarketSimulator({ portfolio }) {
  const [lineData, setLineData] = useState(null);
  const days = 50; // Number of days to simulate

  const simulateMarket = () => {
    const { stocks, bonds, realEstate, commodities } = portfolio;

    // Generate random data for each asset over 'days' number of days
    const stocksValues = generateRandomData(stocks, days, 0.5);
    const bondsValues = generateRandomData(bonds, days, 0.02);
    const realEstateValues = generateRandomData(realEstate, days, 0.03);
    const commoditiesValues = generateRandomData(commodities, days, 0.1);

    // Prepare data for the Line chart
    const dates = generateDates(days); // Generate date labels
    setLineData({
      labels: dates,
      datasets: [
        {
          label: 'Stocks Value',
          data: stocksValues,
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Bonds Value',
          data: bondsValues,
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Real Estate Value',
          data: realEstateValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Commodities Value',
          data: commoditiesValues,
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 2,
          fill: false,
        },
      ],
    });
  };

  // Function to generate random data for an asset over 'days' days
  const generateRandomData = (initialValue, days, volatility) => {
    const data = [Math.max(initialValue, 50)]; // Ensure the initial value is at least 50
    for (let i = 1; i < days; i++) {
      const change = data[i - 1] * (1 + (Math.random() - 0.5) * volatility);
      const newValue = Math.max(change, 50); // Ensure the new value is at least 50
      data.push(newValue);
    }
    return data;
  };

  // Function to generate date labels (e.g., "2024-07-18")
  const generateDates = (days) => {
    const startDate = new Date(); // Use today's date as the starting point
    const dateLabels = [];
    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      dateLabels.push(currentDate.toISOString().slice(0, 10)); // Format as "YYYY-MM-DD"
    }
    return dateLabels;
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Market Simulator</h2>
      <button onClick={simulateMarket} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
        Simulate Market
      </button>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-4">
        {lineData && lineData.datasets.map((dataset, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{dataset.label}</h3>
            <Line data={{ labels: lineData.labels, datasets: [dataset] }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketSimulator;
