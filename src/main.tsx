import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Tabs, Tab } from 'react-bootstrap';
import Crypto from './components/Crypto/Crypto';
import StockShares from './components/Stocks/StockShares/StockShares';
import StockFutures from './components/Stocks/StockFutures/StockFutures';
import './main.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('stock-futures');
  return (
    <StrictMode>
    <div className="container mt-4">
      <Tabs
        id="controlled-tabs"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || 'crypto')}
        className="mb-3">
        <Tab eventKey="crypto" title="Crypto Leverage">
          <Crypto />
        </Tab>
        <Tab eventKey="stock-shares" title="Stock Shares">
          <StockShares />
        </Tab>
        <Tab eventKey="stock-futures" title="Stock Futures">
          <StockFutures />
        </Tab>
      </Tabs>
    </div>
  </StrictMode>
  );
};

export default App;

createRoot(document.getElementById('root')!).render(<App />);
