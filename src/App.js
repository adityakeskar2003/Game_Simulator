import React, { useState } from 'react';
import PortfolioCreator from './components/PortfolioController.jsx';
import MarketSimulator from './components/MarketSimulator.jsx';
import './index.css'; // Tailwind CSS

function App() {
  const [portfolio, setPortfolio] = useState({
    stocks: 0,
    bonds: 0,
    realEstate: 0,
    commodities: 0,
    cash: 0,
  });

  return (
    <div className="App">
      <h1 className="text-3xl font-bold mb-4 text-center">Diversification and Risk Management Game</h1>
      <div className="container mx-auto">
        <div className="mb-8"> {/* Adding margin bottom for spacing */}
          <MarketSimulator portfolio={portfolio} />
        </div>
        <div>
          <PortfolioCreator setPortfolio={setPortfolio} />
        </div>
      </div>
    </div>
  );
}

export default App;

