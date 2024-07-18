import React, { useState, useEffect, useMemo } from 'react';
import Chart from 'chart.js/auto';

function PortfolioCreator({ setPortfolio }) {
  const [portfolioName, setPortfolioName] = useState('');
  const [portfolio, setPortfolioState] = useState({
    stocks: {
      rate: 150,
      amount: 0,
      totalCost: 0,
      previousRate: 150,
    },
    bonds: {
      rate: 1000,
      amount: 0,
      totalCost: 0,
      previousRate: 1000,
    },
    realEstate: {
      rate: 50000,
      amount: 0,
      totalCost: 0,
      previousRate: 50000,
    },
    commodities: {
      rate: 50,
      amount: 0,
      totalCost: 0,
      previousRate: 50,
    },
    cash: 0,
  });

  const [maxPortfolioValue, setMaxPortfolioValue] = useState(10000);
  const [submitted, setSubmitted] = useState(false);
  const [profitLoss, setProfitLoss] = useState(0);
  const [error, setError] = useState('');

  const clearForm = () => {
    setPortfolioName('');
    setPortfolioState({
      stocks: { rate: 150, amount: 0, totalCost: 0, previousRate: 150 },
      bonds: { rate: 1000, amount: 0, totalCost: 0, previousRate: 1000 },
      realEstate: { rate: 50000, amount: 0, totalCost: 0, previousRate: 50000 },
      commodities: { rate: 50, amount: 0, totalCost: 0, previousRate: 50 },
      cash: 0,
    });
    setSubmitted(false);
    setProfitLoss(0);
    setError('');
  };

  useEffect(() => {
    const generateRandomRates = () => {
      return {
        stocks: 100 + Math.floor(Math.random() * 200),
        bonds: 800 + Math.floor(Math.random() * 400),
        realEstate: 40000 + Math.floor(Math.random() * 10000),
        commodities: 40 + Math.floor(Math.random() * 20),
      };
    };

    const randomRates = generateRandomRates();

    setPortfolioState((prevPortfolio) => ({
      ...prevPortfolio,
      stocks: { ...prevPortfolio.stocks, rate: randomRates.stocks },
      bonds: { ...prevPortfolio.bonds, rate: randomRates.bonds },
      realEstate: { ...prevPortfolio.realEstate, rate: randomRates.realEstate },
      commodities: { ...prevPortfolio.commodities, rate: randomRates.commodities },
    }));

    const randomMaxValue = 10000 + Math.floor(Math.random() * 1000);
    setMaxPortfolioValue(randomMaxValue);
  }, []);

  const totalPortfolioValue = useMemo(() => {
    const stocksValue = portfolio.stocks.amount * portfolio.stocks.rate;
    const bondsValue = portfolio.bonds.amount * portfolio.bonds.rate;
    const realEstateValue = portfolio.realEstate.amount * portfolio.realEstate.rate;
    const commoditiesValue = portfolio.commodities.amount * portfolio.commodities.rate;
    const cashValue = portfolio.cash;

    return stocksValue + bondsValue + realEstateValue + commoditiesValue + cashValue;
  }, [portfolio]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (totalPortfolioValue > maxPortfolioValue) {
      setError('Total portfolio value exceeds threshold!');
      return;
    }

    const previousRates = {
      stocks: portfolio.stocks.previousRate,
      bonds: portfolio.bonds.previousRate,
      realEstate: portfolio.realEstate.previousRate,
      commodities: portfolio.commodities.previousRate,
    };

    const generateNewRates = () => {
      const varyRate = (rate) => {
        const variation = rate * 0.1;
        return rate + (Math.random() * (variation * 2) - variation);
      };

      return {
        stocks: varyRate(previousRates.stocks),
        bonds: varyRate(previousRates.bonds),
        realEstate: varyRate(previousRates.realEstate),
        commodities: varyRate(previousRates.commodities),
      };
    };

    const newRates = generateNewRates();

    const newPortfolio = {
      ...portfolio,
      stocks: {
        ...portfolio.stocks,
        rate: newRates.stocks,
        previousRate: previousRates.stocks,
        totalCost: portfolio.stocks.amount * newRates.stocks,
      },
      bonds: {
        ...portfolio.bonds,
        rate: newRates.bonds,
        previousRate: previousRates.bonds,
        totalCost: portfolio.bonds.amount * newRates.bonds,
      },
      realEstate: {
        ...portfolio.realEstate,
        rate: newRates.realEstate,
        previousRate: previousRates.realEstate,
        totalCost: portfolio.realEstate.amount * newRates.realEstate,
      },
      commodities: {
        ...portfolio.commodities,
        rate: newRates.commodities,
        previousRate: previousRates.commodities,
        totalCost: portfolio.commodities.amount * newRates.commodities,
      },
      cash: portfolio.cash,
    };

    const previousValue = Object.keys(previousRates).reduce(
      (acc, key) => acc + portfolio[key].amount * previousRates[key],
      0
    ) + portfolio.cash;
    const currentTotalValue = Object.keys(newRates).reduce(
      (acc, key) => acc + newPortfolio[key].amount * newRates[key],
      0
    ) + newPortfolio.cash;

    setProfitLoss(currentTotalValue - previousValue);
    setPortfolioState(newPortfolio);
    setSubmitted(true);
    setPortfolio({ portfolioName, ...newPortfolio });
    setError('');
  };

  const handleInputChange = (key, value) => {
    const parsedValue = parseFloat(value);
    const totalCost = parsedValue * portfolio[key].rate;

    setPortfolioState((prevPortfolio) => ({
      ...prevPortfolio,
      [key]: {
        ...prevPortfolio[key],
        amount: parsedValue,
        totalCost: isNaN(totalCost) ? 0 : totalCost,
      },
    }));
  };

  const createOrUpdateChart = (ctx, currentData, previousData, label, existingChart) => {
    if (existingChart) {
      existingChart.destroy();
    }

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Stocks', 'Bonds', 'Real Estate', 'Commodities'],
        datasets: [
          {
            label: 'Current Value',
            data: currentData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
          },
          {
            label: 'Previous Value',
            data: previousData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            borderWidth: 1,
          },
        ],
      },
    });
  };

  useEffect(() => {
    const chartCanvas = document.getElementById('portfolio-chart');
    let portfolioChart;

    if (chartCanvas) {
      const currentData = [
        portfolio.stocks.amount * portfolio.stocks.rate,
        portfolio.bonds.amount * portfolio.bonds.rate,
        portfolio.realEstate.amount * portfolio.realEstate.rate,
        portfolio.commodities.amount * portfolio.commodities.rate,
      ];

      const previousData = [
        portfolio.stocks.amount * portfolio.stocks.previousRate,
        portfolio.bonds.amount * portfolio.bonds.previousRate,
        portfolio.realEstate.amount * portfolio.realEstate.previousRate,
        portfolio.commodities.amount * portfolio.commodities.previousRate,
      ];

      portfolioChart = createOrUpdateChart(
        chartCanvas.getContext('2d'),
        currentData,
        previousData,
        'Portfolio Value',
        portfolioChart
      );
    }

    return () => {
      if (portfolioChart) portfolioChart.destroy();
    };
  }, [portfolio]);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-4">Create Your Portfolio</h2>
        <div className="text-right">
          <p>
            <strong>Threshold Value:</strong> ${maxPortfolioValue.toFixed(2)}
          </p>
          <p>
            <strong>Total Portfolio Value:</strong> ${totalPortfolioValue.toFixed(2)}
          </p>
          {totalPortfolioValue > maxPortfolioValue && (
            <p className="text-red-500">Total value exceeds threshold!</p>
          )}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <div className="col-span-full mb-4">
          <label className="block mb-1">Portfolio Name:</label>
          <input
            type="text"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Stocks (Number of Stocks):</label>
          <input
            type="number"
            value={portfolio.stocks.amount}
            onChange={(e) => handleInputChange('stocks', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <small className="text-gray-500">
            Current Rate: ${portfolio.stocks.rate.toFixed(2)} per stock
          </small>
          <br />
          <small className="text-gray-500">
            Total Cost: ${portfolio.stocks.totalCost.toFixed(2)}
          </small>
        </div>

        <div>
          <label className="block mb-1">Bonds (Number of Bonds):</label>
          <input
            type="number"
            value={portfolio.bonds.amount}
            onChange={(e) => handleInputChange('bonds', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <small className="text-gray-500">
            Current Rate: ${portfolio.bonds.rate.toFixed(2)} per bond
          </small>
          <br />
          <small className="text-gray-500">
            Total Cost: ${portfolio.bonds.totalCost.toFixed(2)}
          </small>
        </div>

        <div>
          <label className="block mb-1">Real Estate (Number of Properties):</label>
          <input
            type="number"
            value={portfolio.realEstate.amount}
            onChange={(e) => handleInputChange('realEstate', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <small className="text-gray-500">
            Current Rate: ${portfolio.realEstate.rate.toFixed(2)} per property
          </small>
          <br />
          <small className="text-gray-500">
            Total Cost: ${portfolio.realEstate.totalCost.toFixed(2)}
          </small>
        </div>

        <div>
          <label className="block mb-1">Commodities (Amount in Units):</label>
          <input
            type="number"
            value={portfolio.commodities.amount}
            onChange={(e) => handleInputChange('commodities', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
          <small className="text-gray-500">
            Current Rate: ${portfolio.commodities.rate.toFixed(2)} per unit
          </small>
          <br />
          <small className="text-gray-500">
            Total Cost: ${portfolio.commodities.totalCost.toFixed(2)}
          </small>
        </div>

        <div className="col-span-full mb-4">
          <label className="block mb-1">Cash:</label>
          <input
            type="number"
            value={portfolio.cash}
            onChange={(e) =>
              setPortfolioState({ ...portfolio, cash: parseFloat(e.target.value) })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
          <small className="text-gray-500">Total Cash: ${portfolio.cash.toFixed(2)}</small>
        </div>

        <div className="col-span-full mb-4">
          <button
            type="submit"
            className={`w-full p-2 bg-blue-500 text-white rounded ${
              totalPortfolioValue > maxPortfolioValue ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={totalPortfolioValue > maxPortfolioValue}
          >
            Submit
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </form>

      <div className="mt-4">
        {submitted && (
          <>
            <h3 className="text-xl font-semibold mb-2">Portfolio Summary</h3>
            <p>
              <strong>Portfolio Name:</strong> {portfolioName}
            </p>
            <p>
              <strong>Total Value:</strong> ${totalPortfolioValue.toFixed(2)}
            </p>
            <p>
              <strong>Profit/Loss:</strong> ${profitLoss.toFixed(2)}
            </p>
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Individual Asset Summary</h4>
              <ul>
                <li>
                  <strong>Stocks:</strong> Current: ${portfolio.stocks.amount * portfolio.stocks.rate.toFixed(2)} Previous: ${portfolio.stocks.amount * portfolio.stocks.previousRate.toFixed(2)}
                </li>
                <li>
                  <strong>Bonds:</strong> Current: ${portfolio.bonds.amount * portfolio.bonds.rate.toFixed(2)} Previous: ${portfolio.bonds.amount * portfolio.bonds.previousRate.toFixed(2)}
                </li>
                <li>
                  <strong>Real Estate:</strong> Current: ${portfolio.realEstate.amount * portfolio.realEstate.rate.toFixed(2)} Previous: ${portfolio.realEstate.amount * portfolio.realEstate.previousRate.toFixed(2)}
                </li>
                <li>
                  <strong>Commodities:</strong> Current: ${portfolio.commodities.amount * portfolio.commodities.rate.toFixed(2)} Previous: ${portfolio.commodities.amount * portfolio.commodities.previousRate.toFixed(2)}
                </li>
                <li>
                  <strong>Cash:</strong> ${portfolio.cash.toFixed(2)}
                </li>
              </ul>
            </div>
            <button
              onClick={clearForm}
              className="mt-2 p-2 bg-red-500 text-white rounded"
            >
              Clear
            </button>
          </>
        )}
      </div>

      <div className="mt-4">
        <canvas id="portfolio-chart" width="400" height="200"></canvas>
      </div>
    </div>
  );
}

export default PortfolioCreator;
